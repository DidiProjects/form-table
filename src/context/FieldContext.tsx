import React, { createContext, useContext, useCallback, useReducer, useMemo } from 'react';
import * as yup from 'yup';

interface FieldData {
  value: any;
  error?: string;
}

interface FieldsState {
  [field: string]: FieldData;
}

type FieldAction =
  | { type: 'SET_VALUE'; field: string; value: any }
  | { type: 'SET_ERROR'; field: string; error?: string }
  | { type: 'RESET_FIELD'; field: string };

interface FieldContextType {
  fields: FieldsState;
  setValue: (field: string, value: any) => void;
  getValue: (field: string) => any;
  getError: (field: string) => string | undefined;
  validate: (field: string, schema: yup.AnySchema) => Promise<boolean>;
  reset: (field: string) => void;
}

const fieldsReducer = (state: FieldsState, action: FieldAction): FieldsState => {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.value,
          error: undefined
        }
      };

    case 'SET_ERROR':
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          error: action.error
        }
      };

    case 'RESET_FIELD':
      return {
        ...state,
        [action.field]: { value: '', error: undefined }
      };

    default:
      return state;
  }
};

const FieldContext = createContext<FieldContextType | null>(null);

interface FieldProviderProps {
  children: React.ReactNode;
  initialValues?: Record<string, any>;
}

export const FieldProvider: React.FC<FieldProviderProps> = ({ children, initialValues = {} }) => {
  const initialState: FieldsState = Object.entries(initialValues).reduce((acc, [field, value]) => {
    acc[field] = { value, error: undefined };
    return acc;
  }, {} as FieldsState);

  const [fields, dispatch] = useReducer(fieldsReducer, initialState);

  const setValue = useCallback((field: string, value: any) => {
    dispatch({ type: 'SET_VALUE', field, value });
  }, []);

  const getValue = useCallback((field: string) => {
    return fields[field]?.value;
  }, [fields]);

  const getError = useCallback((field: string) => {
    return fields[field]?.error;
  }, [fields]);

  const validate = useCallback(async (field: string, schema: yup.AnySchema): Promise<boolean> => {
    try {
      await schema.validate(fields[field]?.value);
      dispatch({ type: 'SET_ERROR', field, error: undefined });
      return true;
    } catch (error) {
      const message = error instanceof yup.ValidationError ? error.message : 'Validation error';
      dispatch({ type: 'SET_ERROR', field, error: message });
      return false;
    }
  }, [fields]);

  const reset = useCallback((field: string) => {
    dispatch({ type: 'RESET_FIELD', field });
  }, []);

  const contextValue = useMemo((): FieldContextType => ({
    fields,
    setValue,
    getValue,
    getError,
    validate,
    reset
  }), [fields, setValue, getValue, getError, validate, reset]);

  return (
    <FieldContext.Provider value={contextValue}>
      {children}
    </FieldContext.Provider>
  );
};

export const useField = (field: string) => {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error('useField must be used within a FieldProvider');
  }

  return useMemo(() => ({
    value: context.fields[field]?.value ?? '',
    error: context.fields[field]?.error,
    setValue: (value: any) => context.setValue(field, value),
    validate: (schema: yup.AnySchema) => context.validate(field, schema),
    reset: () => context.reset(field)
  }), [context, field]);
};

export const useFields = () => {
  const context = useContext(FieldContext);
  if (!context) {
    throw new Error('useFields must be used within a FieldProvider');
  }
  return context;
};
