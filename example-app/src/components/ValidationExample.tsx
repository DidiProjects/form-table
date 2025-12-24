import React from 'react';
import { Column, FormTableProvider, EditableCell, SchemaFactory } from '@dspackages/form-table';
import { CodeBlock } from './CodeBlock';

const columns: Column[] = [
  { formId: 'user', field: 'username', type: 'text', label: 'Username', placeholder: 'min 3 chars' },
  { formId: 'user', field: 'email', type: 'email', label: 'Email', placeholder: 'valid email' },
  { formId: 'user', field: 'age', type: 'number', label: 'Age', placeholder: '18-120' },
  { formId: 'user', field: 'website', type: 'text', label: 'Website', placeholder: 'https://...' },
];

const users = [
  { username: 'jo', email: 'invalid-email', age: 15, website: 'not-a-url' },
  { username: 'jane_doe', email: 'jane@example.com', age: 28, website: 'https://jane.dev' },
];

const schemas: SchemaFactory = (yup) => ({
  user: yup.object().shape({
    username: yup
      .string()
      .required('Username is required')
      .min(3, 'Minimum 3 characters')
      .max(20, 'Maximum 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
    email: yup
      .string()
      .required('Email is required')
      .email('Must be a valid email address'),
    age: yup
      .number()
      .required('Age is required')
      .min(18, 'Must be at least 18')
      .max(120, 'Must be at most 120')
      .integer('Must be a whole number'),
    website: yup
      .string()
      .url('Must be a valid URL')
      .nullable(),
  }),
});

interface UserRowProps {
  data: typeof users[0];
}

const UserRow: React.FC<UserRowProps> = ({ data }) => {
  return (
    <FormTableProvider
      columns={columns}
      initialData={{ user: data }}
      schemas={schemas}
      onSubmit={{
        user: (values) => alert(`Valid! ${JSON.stringify(values, null, 2)}`),
      }}
      debounceMs={500}
    >
      <tr>
        {columns.map((col) => (
          <EditableCell
            key={col.field}
            formId={col.formId}
            field={col.field}
            type={col.type}
            placeholder={col.placeholder}
          />
        ))}
      </tr>
    </FormTableProvider>
  );
};

const codeExample = `// Rich validation with yup - all built-in!
const schemas: SchemaFactory = (yup) => ({
  user: yup.object().shape({
    // String validations
    username: yup
      .string()
      .required('Username is required')
      .min(3, 'Minimum 3 characters')
      .max(20, 'Maximum 20 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores'),
    
    // Email validation
    email: yup
      .string()
      .required('Email is required')
      .email('Must be a valid email address'),
    
    // Number validations
    age: yup
      .number()
      .required('Age is required')
      .min(18, 'Must be at least 18')
      .max(120, 'Must be at most 120')
      .integer('Must be a whole number'),
    
    // URL validation
    website: yup
      .string()
      .url('Must be a valid URL')
      .nullable(),
  }),
});

// Validation runs with debounce (default 500ms)
<FormTableProvider
  columns={columns}
  initialData={initialData}
  schemas={schemas}
  debounceMs={500}  // Adjust debounce timing
>
  ...
</FormTableProvider>`;

export const ValidationExample: React.FC = () => {
  return (
    <div className="example-section">
      <div className="example-header">
        <h2>Validation</h2>
        <p className="example-description">
          Full yup validation support: required, min/max, email, url, regex patterns, and more.
          Validation runs with debounce to avoid excessive checks while typing.
          First row has invalid data - try fixing it!
        </p>
      </div>

      <div className="example-demo">
        <h3>Live Demo</h3>
        <table className="demo-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.field}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <UserRow key={idx} data={user} />
            ))}
          </tbody>
        </table>
        <p className="demo-hint">First row has validation errors - fix them to submit!</p>
      </div>

      <div className="example-code">
        <h3>Code</h3>
        <CodeBlock code={codeExample} title="ValidationExample.tsx" />
      </div>
    </div>
  );
};
