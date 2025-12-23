import React, { createContext, useContext, useCallback, useRef, useSyncExternalStore } from 'react';
import * as yup from 'yup';
import { FieldsState, FieldState, FormsState, FormConfig } from '../types';

type Listener = () => void;

interface NavigationState {
  activeField: string | null;
  fields: string[];
}

interface FormTableStore {
  getState: () => FormsState;
  getNavigation: () => NavigationState;
  setValue: (formId: string, field: string, value: any) => void;
  setActiveField: (field: string | null) => void;
  validateFieldSync: (formId: string, field: string) => Promise<boolean>;
  nextField: () => Promise<void>;
  previousField: () => Promise<void>;
  submit: () => Promise<void>;
  subscribe: (listener: Listener) => () => void;
  subscribeNavigation: (listener: Listener) => () => void;
}

interface FormTableProviderProps {
  children: React.ReactNode;
  forms: FormConfig[];
  debounceMs?: number;
  navigationFields?: string[];
}

const FormTableContext = createContext<FormTableStore | null>(null);

export const FormTableProvider: React.FC<FormTableProviderProps> = ({
  children,
  forms,
  debounceMs = 500,
  navigationFields = []
}) => {
  const storeRef = useRef<FormTableStore | null>(null);

  if (!storeRef.current) {
    let state: FormsState = {};
    const schemas = new Map<string, yup.ObjectSchema<any>>();
    const submitHandlers = new Map<string, ((values: any) => void) | undefined>();

    forms.forEach(form => {
      state[form.id] = {};
      schemas.set(form.id, form.schema);
      submitHandlers.set(form.id, form.onSubmit);
      Object.entries(form.initialData).forEach(([key, value]) => {
        state[form.id][key] = { value, error: undefined };
      });
    });

    let navigation: NavigationState = {
      activeField: null,
      fields: navigationFields
    };

    const listeners = new Set<Listener>();
    const navigationListeners = new Set<Listener>();
    const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

    const getState = () => state;
    const getNavigation = () => navigation;

    const subscribe = (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };

    const subscribeNavigation = (listener: Listener) => {
      navigationListeners.add(listener);
      return () => navigationListeners.delete(listener);
    };

    const notify = () => {
      listeners.forEach((listener) => listener());
    };

    const notifyNavigation = () => {
      navigationListeners.forEach((listener) => listener());
    };

    const parseFieldPath = (fieldPath: string): { formId: string; field: string } => {
      const [formId, field] = fieldPath.split('.');
      return { formId, field };
    };

    const validateField = async (formId: string, field: string, value: any): Promise<string | undefined> => {
      const schema = schemas.get(formId);
      if (!schema) return 'Form not found';

      try {
        const currentValues: Record<string, any> = {};
        Object.entries(state[formId] || {}).forEach(([key, fieldState]) => {
          currentValues[key] = fieldState.value;
        });
        await schema.validateAt(field, { ...currentValues, [field]: value });
        return undefined;
      } catch (err) {
        if (err instanceof yup.ValidationError) {
          return err.message;
        }
        return 'Validation error';
      }
    };

    const setValue = (formId: string, field: string, value: any) => {
      const timerKey = `${formId}.${field}`;

      state = {
        ...state,
        [formId]: {
          ...state[formId],
          [field]: { ...state[formId]?.[field], value }
        }
      };
      notify();

      const existingTimer = debounceTimers.get(timerKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        debounceTimers.delete(timerKey);
        validateField(formId, field, value).then(error => {
          if (state[formId]?.[field]?.value === value) {
            state = {
              ...state,
              [formId]: {
                ...state[formId],
                [field]: { ...state[formId]?.[field], error }
              }
            };
            notify();
          }
        });
      }, debounceMs);

      debounceTimers.set(timerKey, timer);
    };

    const setActiveField = (field: string | null) => {
      navigation = { ...navigation, activeField: field };
      notifyNavigation();
    };

    const validateFieldSync = async (formId: string, field: string): Promise<boolean> => {
      const timerKey = `${formId}.${field}`;
      const existingTimer = debounceTimers.get(timerKey);
      if (existingTimer) {
        clearTimeout(existingTimer);
        debounceTimers.delete(timerKey);
      }

      const value = state[formId]?.[field]?.value;
      const error = await validateField(formId, field, value);
      
      state = {
        ...state,
        [formId]: {
          ...state[formId],
          [field]: { ...state[formId]?.[field], error }
        }
      };
      notify();

      return !error;
    };

    const nextField = async () => {
      const { activeField, fields } = navigation;
      if (fields.length === 0) return;

      if (activeField) {
        const { formId, field } = parseFieldPath(activeField);
        const isValid = await validateFieldSync(formId, field);
        if (!isValid) return;

        const formFields = fields.filter(f => f.startsWith(`${formId}.`));
        const currentIndex = formFields.indexOf(activeField);
        const nextIndex = (currentIndex + 1) % formFields.length;
        setActiveField(formFields[nextIndex]);
      } else {
        setActiveField(fields[0]);
      }
    };

    const previousField = async () => {
      const { activeField, fields } = navigation;
      if (fields.length === 0) return;

      if (activeField) {
        const { formId, field } = parseFieldPath(activeField);
        const isValid = await validateFieldSync(formId, field);
        if (!isValid) return;

        const formFields = fields.filter(f => f.startsWith(`${formId}.`));
        const currentIndex = formFields.indexOf(activeField);
        const prevIndex = (currentIndex - 1 + formFields.length) % formFields.length;
        setActiveField(formFields[prevIndex]);
      } else {
        setActiveField(fields[0]);
      }
    };

    const submit = async () => {
      const { activeField, fields } = navigation;
      if (!activeField) return;

      const { formId } = parseFieldPath(activeField);
      const formFields = fields.filter(f => f.startsWith(`${formId}.`));

      for (const fieldPath of formFields) {
        const { formId: fId, field } = parseFieldPath(fieldPath);
        const isValid = await validateFieldSync(fId, field);
        if (!isValid) {
          setActiveField(fieldPath);
          return;
        }
      }

      const onSubmit = submitHandlers.get(formId);
      if (!onSubmit) return;

      const values: Record<string, any> = {};
      Object.entries(state[formId] || {}).forEach(([fieldName, fieldState]) => {
        values[fieldName] = fieldState.value;
      });
      onSubmit(values);
    };

    storeRef.current = {
      getState,
      getNavigation,
      setValue,
      setActiveField,
      validateFieldSync,
      nextField,
      previousField,
      submit,
      subscribe,
      subscribeNavigation
    };
  }

  return (
    <FormTableContext.Provider value={storeRef.current}>
      {children}
    </FormTableContext.Provider>
  );
};

const useStore = (): FormTableStore => {
  const store = useContext(FormTableContext);
  if (!store) {
    throw new Error('useStore must be used within a FormTableProvider');
  }
  return store;
};

export const useFormTable = () => {
  const store = useStore();
  const state = useSyncExternalStore(store.subscribe, store.getState);
  return { state, setValue: store.setValue };
};

export const useSelectorContext = <T,>(selector: (state: FormsState) => T): T => {
  const store = useStore();
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState())
  );
};

export const useNavigation = () => {
  const store = useStore();
  const navigation = useSyncExternalStore(store.subscribeNavigation, store.getNavigation);
  
  return {
    activeField: navigation.activeField,
    fields: navigation.fields,
    setActiveField: store.setActiveField,
    nextField: store.nextField,
    previousField: store.previousField,
    submit: store.submit,
    isLastField: navigation.activeField === navigation.fields[navigation.fields.length - 1]
  };
};

export const useField = (formId: string, field: string) => {
  const store = useStore();
  const fieldPath = `${formId}.${field}`;
  
  const fieldState = useSelectorContext(
    useCallback((state: FormsState): FieldState => 
      state[formId]?.[field] ?? { value: '', error: undefined }, 
    [formId, field])
  );

  const navigation = useSyncExternalStore(store.subscribeNavigation, store.getNavigation);
  const isActive = navigation.activeField === fieldPath;
  
  const formFields = navigation.fields.filter(f => f.startsWith(`${formId}.`));
  const isLastField = fieldPath === formFields[formFields.length - 1];

  const setValue = useCallback((value: any) => {
    store.setValue(formId, field, value);
  }, [store, formId, field]);

  return {
    value: fieldState.value,
    error: fieldState.error,
    setValue,
    isActive,
    setActive: () => store.setActiveField(fieldPath),
    nextField: store.nextField,
    previousField: store.previousField,
    submit: store.submit,
    isLastField
  };
};
