import React from 'react';
import * as yup from 'yup';
import { FieldProvider } from '../context/FieldContext';
import { EditableCell } from './EditableCell';

interface Column {
  field: string;
  label: string;
  type?: 'text' | 'number' | 'email';
  validation?: yup.AnySchema;
  placeholder?: string;
}

interface FormTableProps {
  columns: Column[];
  initialValues?: Record<string, any>;
}

export const FormTable: React.FC<FormTableProps> = ({ columns, initialValues = {} }) => {
  return (
    <FieldProvider initialValues={initialValues}>
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
                validation={col.validation}
                placeholder={col.placeholder}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </FieldProvider>
  );
};
