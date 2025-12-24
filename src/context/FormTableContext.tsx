import React, { createContext, useContext, useCallback, useRef, useSyncExternalStore } from 'react';
import * as yup from 'yup';
import { FieldsState, FieldState, FormsState, Column, FormSchemas, FormSubmitHandlers } from '../types';

type Listener = () => void;

interface NavigationState {
  activeField: string | null;
  fields: string[];
}

interface FormTableStore {
  instanceId: string;
  getState: () => FormsState;
  getNavigation: () => NavigationState;
  getInitialData: () => Record<string, Record<string, any>>;
  setValue: (formId: string, field: string, value: any) => void;
  setActiveField: (field: string | null) => void;
  validateFieldSync: (formId: string, field: string) => Promise<boolean>;
  nextField: () => Promise<void>;
  previousField: () => Promise<void>;
  submit: () => Promise<void>;
  reset: (formId?: string) => void;
  subscribe: (listener: Listener) => () => void;
  subscribeNavigation: (listener: Listener) => () => void;
}

interface FormTableProviderProps {
  children: React.ReactNode;
  columns: Column[];
  initialData: Record<string, Record<string, any>>;
  schemas: FormSchemas;
  onSubmit?: FormSubmitHandlers;
  debounceMs?: number;
}

const FormTableContext = createContext<FormTableStore | null>(null);

export const FormTableProvider: React.FC<FormTableProviderProps> = ({
  children,
  columns,
  initialData,
  schemas,
  onSubmit = {},
  debounceMs = 500
}) => {
  const storeRef = useRef<FormTableStore | null>(null);
  const instanceIdRef = useRef<string>(Math.random().toString(36).substring(2, 9));

  if (!storeRef.current) {
    let state: FormsState = {};

    Object.entries(initialData).forEach(([formId, formData]) => {
      state[formId] = {};
      Object.entries(formData).forEach(([field, value]) => {
        state[formId][field] = { value, error: undefined };
      });
    });

    const navigationFields = columns.map(col => `${col.formId}.${col.field}`);

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
      const schema = schemas[formId];
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

      const submitHandler = onSubmit[formId];
      if (!submitHandler) return;

      const values: Record<string, any> = {};
      Object.entries(state[formId] || {}).forEach(([fieldName, fieldState]) => {
        values[fieldName] = fieldState.value;
      });
      submitHandler(values);
    };

    const getInitialData = () => initialData;

    const reset = (targetFormId?: string) => {
      if (targetFormId) {
        debounceTimers.forEach((timer, key) => {
          if (key.startsWith(`${targetFormId}.`)) {
            clearTimeout(timer);
            debounceTimers.delete(key);
          }
        });

        const formInitialData = initialData[targetFormId];
        if (formInitialData) {
          state = {
            ...state,
            [targetFormId]: {}
          };
          Object.entries(formInitialData).forEach(([field, value]) => {
            state[targetFormId][field] = { value, error: undefined };
          });
        }

        if (navigation.activeField?.startsWith(`${targetFormId}.`)) {
          navigation = { ...navigation, activeField: null };
          notifyNavigation();
        }
        notify();
      } else {
        debounceTimers.forEach((timer) => clearTimeout(timer));
        debounceTimers.clear();

        state = {};
        Object.entries(initialData).forEach(([formId, formData]) => {
          state[formId] = {};
          Object.entries(formData).forEach(([field, value]) => {
            state[formId][field] = { value, error: undefined };
          });
        });

        navigation = { ...navigation, activeField: null };
        notify();
        notifyNavigation();
      }
    };

    storeRef.current = {
      instanceId: instanceIdRef.current,
      getState,
      getNavigation,
      getInitialData,
      setValue,
      setActiveField,
      validateFieldSync,
      nextField,
      previousField,
      submit,
      reset,
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
    reset: store.reset,
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

  const resetForm = useCallback(() => {
    store.reset(formId);
  }, [store, formId]);

  return {
    value: fieldState.value,
    error: fieldState.error,
    setValue,
    isActive,
    setActive: () => store.setActiveField(fieldPath),
    nextField: store.nextField,
    previousField: store.previousField,
    submit: store.submit,
    resetForm,
    isLastField,
    instanceId: store.instanceId
  };
};
