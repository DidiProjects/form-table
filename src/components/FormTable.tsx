import React from 'react';
import * as yup from 'yup';
import { FormTableProvider } from '../context/FormTableContext';
import { EditableCell } from './EditableCell';
import { TFormData } from '../types';

interface Column {
  field: string;
  label: string;
  type?: 'text' | 'number' | 'email';
  validation?: yup.AnySchema;
  placeholder?: string;
}

interface FormTableProps {
  columns: Column[];
  initialValues?: TFormData;
}

export const FormTable: React.FC<FormTableProps> = ({ columns, initialValues }) => {
  return (
    <FormTableProvider defaultData={initialValues}>
      <table className="form-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.field}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns.map((col) => (
              <EditableCell
                key={col.field}
                field={col.field}
                type={col.type}
                placeholder={col.placeholder}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </FormTableProvider>
  );
};
