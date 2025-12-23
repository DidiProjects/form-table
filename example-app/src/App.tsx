import React from 'react';
import { Column, FormTable } from '@dspackages/form-table';
import '@dspackages/form-table/dist/index.css';
import * as yup from 'yup';
import './App.css';

type TMockData = {
  name: string;
  email: string;
  age: number;
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

const ColumnConfigs: Column[] = [
  {
    field: 'name',
    type: 'text',
    label: 'Full Name',
    placeholder: 'Enter full name',
  },
  {
    field: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter email',
  },
  {
    field: 'age',
    type: 'number',
    label: 'Age',
    placeholder: 'Enter age',
  },
  {
    field: 'position',
    type: 'select',
    label: 'Position',
    placeholder: 'Select position',
    options: positionOptions,
  },
  {
    field: 'salary',
    type: 'number',
    label: 'Salary ($)',
    placeholder: 'Enter salary',
  },
  {
    field: 'notes',
    type: 'text',
    label: 'Notes',
    placeholder: 'Enter notes',
  }
];

const initialData: TMockData = {
  name: 'John Silva',
  email: 'john@example.com',
  age: 30,
  position: 'dev',
  salary: 5000,
  notes: 'Experienced developer'
};

const userSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  age: yup.number().min(18, 'Must be at least 18').required('Age is required'),
  position: yup.string().required('Position is required'),
  salary: yup.number().min(0, 'Salary must be positive').required('Salary is required'),
  notes: yup.string()
});

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>FormTable - Table Form Manager</h1>
        <p>
          Edit the fields below to see real-time Yup validation in action.
        </p>
      </header>

      <div className="app-content">
        <div className="demo-section">
          <h2>Employee Registration</h2>
          <p className="demo-hint">
            Try clearing the name field or entering an invalid email to see validation errors.
          </p>
          <FormTable<TMockData>
            columns={ColumnConfigs}
            initialData={initialData}
            schema={userSchema}
          />
        </div>
      </div>
    </div>
  );
}

export default App;