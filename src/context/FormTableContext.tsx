import React, { createContext, useContext, useCallback, useRef, useSyncExternalStore } from 'react';
import * as yup from 'yup';
import { FieldsState, FieldState } from '../types';

type Listener = () => void;

interface NavigationState {
  activeField: string | null;
  fields: string[];
}

interface FormTableStore {
  getState: () => FieldsState;
  getNavigation: () => NavigationState;
  setValue: (field: string, value: any) => void;
  setActiveField: (field: string | null) => void;
  validateFieldSync: (field: string) => Promise<boolean>;
  nextField: () => Promise<void>;
  previousField: () => Promise<void>;
  submit: () => Promise<void>;
  subscribe: (listener: Listener) => () => void;
  subscribeNavigation: (listener: Listener) => () => void;
}

interface FormTableProviderProps<T extends Record<string, any>> {
  children: React.ReactNode;
  initialData: T;
  schema: yup.ObjectSchema<T>;
  debounceMs?: number;
  navigationFields?: string[];
  onSubmit?: (values: T) => void;
}

const FormTableContext = createContext<FormTableStore | null>(null);

export const FormTableProvider = <T extends Record<string, any>>({
  children,
  initialData,
  schema,
  debounceMs = 500,
  navigationFields = [],
  onSubmit
}: FormTableProviderProps<T>) => {
  const storeRef = useRef<FormTableStore | null>(null);

  if (!storeRef.current) {
    let state: FieldsState = {};
    Object.entries(initialData).forEach(([key, value]) => {
      state[key] = { value, error: undefined };
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

    const validateField = async (field: string, value: any): Promise<string | undefined> => {
      try {
        const currentValues: Record<string, any> = {};
        Object.entries(state).forEach(([key, fieldState]) => {
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

    const setValue = (field: string, value: any) => {
      state = {
        ...state,
        [field]: { ...state[field], value }
      };
      notify();

      const existingTimer = debounceTimers.get(field);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      const timer = setTimeout(() => {
        debounceTimers.delete(field);
        validateField(field, value).then(error => {
          if (state[field]?.value === value) {
            state = {
              ...state,
              [field]: { ...state[field], error }
            };
            notify();
          }
        });
      }, debounceMs);

      debounceTimers.set(field, timer);
    };

    const setActiveField = (field: string | null) => {
      navigation = { ...navigation, activeField: field };
      notifyNavigation();
    };

    const validateFieldSync = async (field: string): Promise<boolean> => {
      const existingTimer = debounceTimers.get(field);
      if (existingTimer) {
        clearTimeout(existingTimer);
        debounceTimers.delete(field);
      }

      const value = state[field]?.value;
      const error = await validateField(field, value);
      
      state = {
        ...state,
        [field]: { ...state[field], error }
      };
      notify();

      return !error;
    };

    const hasFieldError = (field: string | null): boolean => {
      if (!field) return false;
      return !!state[field]?.error;
    };

    const nextField = async () => {
      const { activeField, fields } = navigation;
      if (fields.length === 0) return;

      if (activeField) {
        const isValid = await validateFieldSync(activeField);
        if (!isValid) return;
      }

      const currentIndex = activeField ? fields.indexOf(activeField) : -1;
      const nextIndex = currentIndex + 1;

      if (nextIndex < fields.length) {
        setActiveField(fields[nextIndex]);
      }
    };

    const previousField = async () => {
      const { activeField, fields } = navigation;
      if (fields.length === 0) return;

      if (activeField) {
        const isValid = await validateFieldSync(activeField);
        if (!isValid) return;
      }

      const currentIndex = activeField ? fields.indexOf(activeField) : fields.length;
      const prevIndex = currentIndex - 1;

      if (prevIndex >= 0) {
        setActiveField(fields[prevIndex]);
      }
    };

    const submit = async () => {
      if (!onSubmit) return;

      for (const field of navigation.fields) {
        const isValid = await validateFieldSync(field);
        if (!isValid) {
          setActiveField(field);
          return;
        }
      }

      const values: Record<string, any> = {};
      Object.entries(state).forEach(([key, fieldState]) => {
        values[key] = fieldState.value;
      });
      onSubmit(values as T);
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
  const fields = useSyncExternalStore(store.subscribe, store.getState);
  return { fields, setValue: store.setValue };
};

export const useSelectorContext = <T,>(selector: (state: FieldsState) => T): T => {
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

export const useField = (field: string) => {
  const store = useStore();
  
  const fieldState = useSelectorContext(
    useCallback((state: FieldsState): FieldState => state[field] ?? { value: '', error: undefined }, [field])
  );

  const navigation = useSyncExternalStore(store.subscribeNavigation, store.getNavigation);
  const isActive = navigation.activeField === field;

  const setValue = useCallback((value: any) => {
    store.setValue(field, value);
  }, [store, field]);

  return {
    value: fieldState.value,
    error: fieldState.error,
    setValue,
    isActive,
    setActive: () => store.setActiveField(field),
    nextField: store.nextField,
    previousField: store.previousField,
    submit: store.submit,
    isLastField: field === navigation.fields[navigation.fields.length - 1]
  };
};