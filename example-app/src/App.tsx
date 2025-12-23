import React from 'react';
import { Column, FormConfig, FormTableProvider, EditableCell } from '@dspackages/form-table';
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

const personalColumns: Column[] = [
  { field: 'name', type: 'text', label: 'Full Name', placeholder: 'Enter full name' },
  { field: 'email', type: 'email', label: 'Email', placeholder: 'Enter email' },
  { field: 'age', type: 'number', label: 'Age', placeholder: 'Enter age' },
];

const jobColumns: Column[] = [
  { field: 'position', type: 'select', label: 'Position', placeholder: 'Select position', options: positionOptions },
  { field: 'salary', type: 'number', label: 'Salary ($)', placeholder: 'Enter salary' },
  { field: 'notes', type: 'text', label: 'Notes', placeholder: 'Enter notes' },
];

const personalSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  age: yup.number().min(18, 'Must be at least 18').required('Age is required'),
});

const jobSchema = yup.object().shape({
  position: yup.string().required('Position is required'),
  salary: yup.number().min(0, 'Salary must be positive').required('Salary is required'),
  notes: yup.string(),
});

const handlePersonalSubmit = (values: TPersonalData) => {
  console.log('Personal form submitted:', values);
  alert('Personal form submitted!\n\n' + JSON.stringify(values, null, 2));
};

const handleJobSubmit = (values: TJobData) => {
  console.log('Job form submitted:', values);
  alert('Job form submitted!\n\n' + JSON.stringify(values, null, 2));
};

const forms: FormConfig[] = [
  { 
    id: 'personal', 
    initialData: { name: 'John Silva', email: 'john@example.com', age: 30 }, 
    schema: personalSchema,
    onSubmit: handlePersonalSubmit
  },
  { 
    id: 'job', 
    initialData: { position: 'dev', salary: 5000, notes: 'Experienced developer' }, 
    schema: jobSchema,
    onSubmit: handleJobSubmit
  },
];

const navigationFields = [
  'personal.name',
  'personal.email', 
  'personal.age',
  'job.position',
  'job.salary',
  'job.notes',
];

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
          forms={forms}
          navigationFields={navigationFields}
          debounceMs={300}
        >
          <div className="demo-section">
            <h2>Employee Registration</h2>
            <table className="form-table">
              <thead>
                <tr>
                  {personalColumns.map(col => <th key={col.field}>{col.label}</th>)}
                  {jobColumns.map(col => <th key={col.field}>{col.label}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {personalColumns.map(col => (
                    <EditableCell
                      key={col.field}
                      formId="personal"
                      field={col.field}
                      type={col.type}
                      placeholder={col.placeholder}
                      options={col.options}
                    />
                  ))}
                  {jobColumns.map(col => (
                    <EditableCell
                      key={col.field}
                      formId="job"
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