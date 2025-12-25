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
      <div className="form-table">
        <div className="form-table-header">
          {columns.map((col) => (
            <div key={`${col.formId}.${col.field}`} className="form-table-cell">{col.label}</div>
          ))}
        </div>
        <div className="form-table-body">
          <div className="form-table-row">
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
          </div>
        </div>
      </div>
    </FormTableProvider>
  );
};
