import React from 'react';
import { Column, FormSchemas, FormSubmitHandlers, FormTableProvider, EditableCell } from '@dspackages/form-table';
import '@dspackages/form-table/dist/index.css';
import * as yup from 'yup';
import './App.css';

type TPersonalData = {
  name: string;
  email: string;
  age: number;
}

type TJobData = {
  position: string;
  salary: number;
  notes: string | undefined;
}

const positionOptions = [
  { value: 'dev', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'manager', label: 'Manager' },
  { value: 'analyst', label: 'Analyst' },
  { value: 'qa', label: 'QA Engineer' },
];

const columns: Column[] = [
  { formId  : 'personal', field: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter full name' },
  { formId: 'personal', field: 'email', type: 'email', label: 'Email', placeholder: 'Enter email' },
  { formId: 'personal', field: 'age', type: 'number', label: 'Age', placeholder: 'Enter age' },
  { formId: 'job', field: 'position', type: 'select', label: 'Position', placeholder: 'Select position', options: positionOptions },
  { formId: 'job', field: 'salary', type: 'number', label: 'Salary ($)', placeholder: 'Enter salary' },
  { formId: 'job', field: 'notes', type: 'text', label: 'Notes', placeholder: 'Enter notes' },
];

const initialData = {
  personal: {
    name: 'John Silva',
    email: 'john@example.com',
    age: 30,
  },
  job: {
    position: 'dev',
    salary: 5000,
    notes: 'Experienced developer',
  },
};

const schemas: FormSchemas = {
  personal: yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    age: yup.number().min(18, 'Must be at least 18').required('Age is required'),
  }),
  job: yup.object().shape({
    position: yup.string().required('Position is required'),
    salary: yup.number().min(0, 'Salary must be positive').required('Salary is required'),
    notes: yup.string(),
  }),
};

const onSubmit: FormSubmitHandlers = {
  personal: (values: TPersonalData) => {
    console.log('Personal form submitted:', values);
    alert('Personal form submitted!\n\n' + JSON.stringify(values, null, 2));
  },
  job: (values: TJobData) => {
    console.log('Job form submitted:', values);
    alert('Job form submitted!\n\n' + JSON.stringify(values, null, 2));
  },
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>FormTable - Multi-Form Support</h1>
        <p>
          Tab navigates within each form. Press Enter on the last field to submit that form.
        </p>
      </header>

      <div className="app-content">
        <FormTableProvider
          columns={columns}
          initialData={initialData}
          schemas={schemas}
          onSubmit={onSubmit}
          debounceMs={300}
        >
          <div className="demo-section">
            <h2>Employee Registration</h2>
            <table className="form-table">
              <thead>
                <tr>
                  {columns.map(col => <th key={`${col.formId}.${col.field}`}>{col.label}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {columns.map(col => (
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
          </div>
        </FormTableProvider>
      </div>
    </div>
  );
}

export default App;