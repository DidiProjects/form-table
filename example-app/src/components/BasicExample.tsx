import React, { useState } from 'react';
import { Column, FormTableProvider, SchemaFactory } from '@dspackages/form-table';
import { EditableCell } from './EditableCell';
import { CodeBlock } from './CodeBlock';

const columns: Column[] = [
  { formId: 'user', field: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' },
  { formId: 'user', field: 'email', type: 'email', label: 'Email', placeholder: 'email@example.com' },
];

const defaultData = {
  user: { name: 'John Doe', email: 'john@example.com' },
};

const schemas: SchemaFactory = (yup) => ({
  user: yup.object().shape({
    name: yup.string().required('Name is required').min(2, 'Min 2 characters'),
    email: yup.string().email('Invalid email').required('Email is required'),
  }),
});

const codeExample = `import { Column, FormTableProvider, EditableCell, SchemaFactory } from '@dspackages/form-table';

// 1. Define columns
const columns: Column[] = [
  { formId: 'user', field: 'name', type: 'text', label: 'Name' },
  { formId: 'user', field: 'email', type: 'email', label: 'Email' },
];

// 2. Define initial data
const initialData = {
  user: { name: 'John Doe', email: 'john@example.com' },
};

// 3. Define validation schemas (yup is injected!)
const schemas: SchemaFactory = (yup) => ({
  user: yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required(),
  }),
});

// 4. Render
<FormTableProvider
  columns={columns}
  initialData={initialData}
  schemas={schemas}
  onSubmit={{ user: (values) => console.log(values) }}
>
  <table>
    <tbody>
      <tr>
        <EditableCell formId="user" field="name" type="text" />
        <EditableCell formId="user" field="email" type="email" />
      </tr>
    </tbody>
  </table>
</FormTableProvider>`;

export const BasicExample: React.FC = () => {
  const [formData, setFormData] = useState(defaultData);

  return (
    <div className="example-section">
      <div className="example-header">
        <h2>Basic Usage</h2>
        <p className="example-description">
          The simplest example: a single form with text and email fields.
          No need to install yup - it's provided via SchemaFactory!
        </p>
      </div>

      <div className="example-demo">
        <h3>Live Demo</h3>
        <FormTableProvider
          key={JSON.stringify(formData)}
          columns={columns}
          initialData={formData}
          schemas={schemas}
          onSubmit={{
            user: (values) => {
              alert(`Submitted!\n\nName: ${values.name}\nEmail: ${values.email}`);
              setFormData({ user: values });
            },
          }}
          debounceMs={300}
        >
          <div className="demo-table">
            <div className="demo-header">
              {columns.map((col) => (
                <div key={col.field} className="demo-cell">{col.label}</div>
              ))}
            </div>
            <div className="demo-row">
              {columns.map((col) => (
                <EditableCell
                  key={col.field}
                  formId={col.formId}
                  field={col.field}
                  type={col.type}
                  placeholder={col.placeholder}
                />
              ))}
            </div>
          </div>
        </FormTableProvider>
        <p className="demo-hint">Press Tab to navigate, Enter on last field to submit, Escape to reset</p>
      </div>

      <div className="example-code">
        <h3>Code</h3>
        <CodeBlock code={codeExample} title="BasicExample.tsx" />
      </div>
    </div>
  );
};
