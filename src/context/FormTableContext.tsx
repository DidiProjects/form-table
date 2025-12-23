import React, { createContext, useContext, useCallback, useMemo, useState } from 'react';
import * as yup from 'yup';
import { FieldsState } from '../types';

interface FormTableContextType {
  fields: FieldsState;
  setValue: (field: string, value: any) => void;
  errors: Record<string, string | undefined>;
}

interface FormTableProviderProps<T extends Record<string, any>> {
  children: React.ReactNode;
  initialData: T;
  schema: yup.ObjectSchema<T>;
}

const FormTableContext = createContext<FormTableContextType | null>(null);

export const FormTableProvider = <T extends Record<string, any>>({
  children,
  initialData,
  schema
}: FormTableProviderProps<T>) => {
  const [fields, setFields] = useState<FieldsState>(() => {
    const state: FieldsState = {};
    Object.entries(initialData).forEach(([key, value]) => {
      state[key] = { value, error: undefined };
    });
    return state;
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const validateField = useCallback(async (field: string, value: any) => {
    try {
      await schema.validateAt(field, { ...getCurrentValues(), [field]: value });
      return undefined;
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        return err.message;
      }
      return 'Validation error';
    }

    function getCurrentValues() {
      const values: Record<string, any> = {};
      Object.entries(fields).forEach(([key, fieldState]) => {
        values[key] = fieldState.value;
      });
      return values;
    }
  }, [schema, fields]);

  const setValue = useCallback(async (field: string, value: any) => {
    const error = await validateField(field, value);
    
    setFields((prev) => ({
      ...prev,
      [field]: { value, error }
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: error
    }));
  }, [validateField]);

  const contextValue = useMemo((): FormTableContextType => ({
    fields,
    setValue,
    errors
  }), [fields, setValue, errors]);

  return (
    <FormTableContext.Provider value={contextValue}>
      {children}
    </FormTableContext.Provider>
  );
};

export const useFormTable = (): FormTableContextType => {
  const context = useContext(FormTableContext);
  if (!context) {
    throw new Error('useFormTable must be used within a FormTableProvider');
  }
  return context;
};

export const useField = (field: string) => {
  const { fields, setValue, errors } = useFormTable();

  return useMemo(() => ({
    value: fields[field]?.value ?? '',
    error: errors[field],
    setValue: (value: any) => setValue(field, value)
  }), [fields, field, setValue, errors]);
};