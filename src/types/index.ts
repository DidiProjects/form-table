import * as yup from 'yup';

export interface FieldState {
  value: any;
  error?: string;
}

export type FieldsState = Record<string, FieldState>;

export type FormsState = Record<string, FieldsState>;

export interface Column {
  formId: string;
  field: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'select';
  placeholder?: string;
  options?: { value: string | number; label: string }[];
}

export type FormSchemas = Record<string, yup.ObjectSchema<any>>;

export type FormSubmitHandlers = Record<string, (values: any) => void>;