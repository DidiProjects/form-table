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
  notes: string;
}

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
          This is a usage example of the FormTable component with editable cells,
          Tab navigation, Yup validation, and React context.
        </p>
      </header>

      <div className="app-content">
        <div className="demo-section">
          <h2>Example: Employee Registration</h2>
          <div className="demo-description">
            <p><strong>Available features:</strong></p>
            <ul>
              <li>Editable cells with different types (text, email, number, select)</li>
              <li>Tab/Shift+Tab navigation between cells</li>
              <li>Row submission with Enter</li>
              <li>Yup validation (onBlur and onChange optional)</li>
              <li>Visual focus and cell states</li>
              <li>Individual row reset</li>
              <li>Shared context between cells</li>
            </ul>
          </div>
          <FormTable
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