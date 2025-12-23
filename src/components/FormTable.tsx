import React from 'react';
import * as yup from 'yup';
import { FormTableProvider } from '../context/FormTableContext';
import { EditableCell } from './EditableCell';
import { Column } from '../types';

interface FormTableProps<T extends Record<string, any>> {
  columns: Column[];
  initialData: T;
  schema: yup.ObjectSchema<T>;
}

export const FormTable = <T extends Record<string, any>>({ 
  columns, 
  initialData, 
  schema 
}: FormTableProps<T>) => {
  return (
    <FormTableProvider initialData={initialData} schema={schema}>
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
                options={col.options}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </FormTableProvider>
  );
};
