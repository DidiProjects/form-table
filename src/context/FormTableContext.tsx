import React, { createContext, useContext, useCallback, useRef, useSyncExternalStore } from 'react';
import * as yup from 'yup';
import { FieldsState, FieldState } from '../types';

type Listener = () => void;

interface FormTableStore {
  getState: () => FieldsState;
  setValue: (field: string, value: any) => void;
  subscribe: (listener: Listener) => () => void;
}

interface FormTableProviderProps<T extends Record<string, any>> {
  children: React.ReactNode;
  initialData: T;
  schema: yup.ObjectSchema<T>;
}

const FormTableContext = createContext<FormTableStore | null>(null);

export const FormTableProvider = <T extends Record<string, any>>({
  children,
  initialData,
  schema
}: FormTableProviderProps<T>) => {
  const storeRef = useRef<FormTableStore | null>(null);

  if (!storeRef.current) {
    let state: FieldsState = {};
    Object.entries(initialData).forEach(([key, value]) => {
      state[key] = { value, error: undefined };
    });

    const listeners = new Set<Listener>();

    const getState = () => state;

    const subscribe = (listener: Listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    };

    const notify = () => {
      listeners.forEach((listener) => listener());
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

    const setValue = async (field: string, value: any) => {
      const error = await validateField(field, value);
      state = {
        ...state,
        [field]: { value, error }
      };
      notify();
    };

    storeRef.current = { getState, setValue, subscribe };
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

export const useField = (field: string) => {
  const store = useStore();
  
  const fieldState = useSelectorContext(
    useCallback((state: FieldsState): FieldState => state[field] ?? { value: '', error: undefined }, [field])
  );

  const setValue = useCallback((value: any) => {
    store.setValue(field, value);
  }, [store, field]);

  return {
    value: fieldState.value,
    error: fieldState.error,
    setValue
  };
};