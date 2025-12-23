import React from 'react';
import { FormTableProvider } from '../context/FormTableContext';
import { EditableCell } from './EditableCell';
import { Column, FormConfig } from '../types';

interface FormTableProps {
  formId: string;
  columns: Column[];
  forms: FormConfig[];
  debounceMs?: number;
  navigationFields?: string[];
}

export const FormTable: React.FC<FormTableProps> = ({ 
  formId,
  columns, 
  forms,
  debounceMs,
  navigationFields
}) => {
  const fields = navigationFields ?? columns.map(col => `${formId}.${col.field}`);

  return (
    <FormTableProvider 
      forms={forms}
      debounceMs={debounceMs}
      navigationFields={fields}
    >
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
                formId={formId}
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
