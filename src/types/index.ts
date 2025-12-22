import { Schema } from 'yup';

export interface FormTableContextType {
  data: any;
}

export type TFormData = {
  [fieldKey: string]: {
    value: string | number | null;
    validation: Schema<any> | null;
    active: boolean;
  };
}