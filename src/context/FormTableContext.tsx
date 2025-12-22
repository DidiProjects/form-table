import React, { createContext, useContext, useCallback, useReducer, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';

interface FormTableContextType {
  data: TFormData;
  update: (fieldKey: string, value: string | number | null) => void;
}

type TFormData = {
  [fieldKey: string]: {
    validation: yup.Schema<any> | null;
    value: string | number | null;
    fieldName: string;
    active: boolean;
  };
}

type TValues = {
  [fieldKey: string]: {
    value: string | number | null;
    validation?: yup.Schema<any> | null;
  }
}

const FormTableContext = createContext<FormTableContextType | null>(null);

interface FormTableProviderProps {
  children: React.ReactNode;
  defaultData?: TValues;
}

const getDefaultState = (defaultData?: TValues): TFormData => {
  const state: TFormData = {};
  if (defaultData) {
    Object.keys(defaultData).forEach((key) => {
      state[key] = {
        validation: defaultData[key].validation || null,
        value: defaultData[key].value,
        fieldName: key,
        active: false,
      }
    });
  }
  return state;
};


export const FormTableProvider: React.FC<FormTableProviderProps> = ({
  children,
  defaultData,
}) => {
  const [data, setData] = useState<TFormData>(getDefaultState(defaultData));
  
  const updateValue = useCallback((fieldKey: string, value: string | number | null) => {
    setData((prevData) => ({
      ...prevData,
      [fieldKey]: {
        ...prevData[fieldKey],
        value,
      },
    }));
  }, []);

  const contextValue = useMemo(() => ({ data, update: updateValue }), [data, updateValue]);

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