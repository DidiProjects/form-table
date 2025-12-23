import * as yup from 'yup';

export interface FieldState {
  value: any;
  error?: string;
}

export type FieldsState = Record<string, FieldState>;

export type FormsState = Record<string, FieldsState>;

export interface Column {
  field: string;
  label: string;
  type?: 'text' | 'number' | 'email' | 'select';
  placeholder?: string;
  options?: { value: string | number; label: string }[];
}

export interface FormConfig<T extends Record<string, any> = Record<string, any>> {
  id: string;
  initialData: T;
  schema: yup.ObjectSchema<T>;
  onSubmit?: (values: any) => void;
}

export interface FormTableProps<T extends Record<string, any>> {
  columns: Column[];
  initialData: T;
  schema: yup.ObjectSchema<T>;
}