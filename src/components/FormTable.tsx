import React from 'react';
import { FormTableProvider } from '../context/FormTableContext';
import { EditableCell } from './EditableCell';
import { Column, FormSchemas, FormSubmitHandlers } from '../types';

interface FormTableProps {
  columns: Column[];
  initialData: Record<string, Record<string, any>>;
  schemas: FormSchemas;
  onSubmit?: FormSubmitHandlers;
  debounceMs?: number;
}

export const FormTable: React.FC<FormTableProps> = ({ 
  columns, 
  initialData,
  schemas,
  onSubmit,
  debounceMs
}) => {
  return (
    <FormTableProvider 
      columns={columns}
      initialData={initialData}
      schemas={schemas}
      onSubmit={onSubmit}
      debounceMs={debounceMs}
    >
      <table className="form-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={`${col.formId}.${col.field}`}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {columns.map((col) => (
              <EditableCell
                key={`${col.formId}.${col.field}`}
                formId={col.formId}
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
