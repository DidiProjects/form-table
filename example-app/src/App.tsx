import React, { useState } from 'react';
import { FormTable, FormTableConfig } from '@dspackages/form-table';
import '@dspackages/form-table/dist/index.css';
import * as yup from 'yup';
import './App.css';

function App() {
  const [tableData, setTableData] = useState<Record<string, Record<string, any>>>({});

  // Table configuration
  const tableConfig: FormTableConfig = {
    columns: [
      {
        key: 'name',
        type: 'text',
        label: 'Full Name',
        required: true,
        validation: yup.string().required('Name is required').min(2, 'Name must have at least 2 characters')
      },
      {
        key: 'email',
        type: 'email',
        label: 'Email',
        required: true,
        validation: yup.string().required('Email is required').email('Invalid email')
      },
      {
        key: 'age',
        type: 'number',
        label: 'Age',
        required: true,
        validation: yup.number()
          .typeError('Must be a number')
          .required('Age is required')
          .min(0, 'Age must be positive')
          .max(120, 'Age must be realistic')
      },
      {
        key: 'position',
        type: 'select',
        label: 'Position',
        required: true,
        options: [
          { value: 'dev', label: 'Developer' },
          { value: 'designer', label: 'Designer' },
          { value: 'manager', label: 'Manager' },
          { value: 'analyst', label: 'Analyst' }
        ],
        validation: yup.string().required('Position is required')
      },
      {
        key: 'salary',
        type: 'number',
        label: 'Salary ($)',
        validation: yup.number()
          .typeError('Must be a number')
          .min(0, 'Salary must be positive')
      },
      {
        key: 'notes',
        type: 'text',
        label: 'Notes',
        validation: yup.string().max(200, 'Maximum 200 characters')
      }
    ],
    initialRows: 3,
    allowAddRows: true,
    allowDeleteRows: true,
    validateOnBlur: true,
    validateOnChange: false,
    submitOnEnter: true
  };

  // Initial data (optional)
  const initialData = {
    'example-1': {
      name: 'John Silva',
      email: 'john@example.com',
      age: 30,
      position: 'dev',
      salary: 5000,
      notes: 'Experienced developer'
    }
  };

  const handleRowSubmit = (rowId: string, data: Record<string, any>) => {
    console.log('Row submitted:', rowId, data);
    alert(`Row ${rowId} submitted successfully!\n${JSON.stringify(data, null, 2)}`);
  };

  const handleDataChange = (data: Record<string, Record<string, any>>) => {
    setTableData(data);
    console.log('Data changed:', data);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(tableData, null, 2);
    console.log('Data exported:', dataStr);
    
    // Creates a JSON file for download
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-table-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
            config={tableConfig}
            initialData={initialData}
            onRowSubmit={handleRowSubmit}
            onDataChange={handleDataChange}
            className="demo-table"
          />

          <div className="export-section">
            <button 
              className="export-btn" 
              onClick={exportData}
              disabled={Object.keys(tableData).length === 0}
            >
              Export JSON Data
            </button>
            
            <div className="data-preview">
              <h3>Current Data:</h3>
              <pre>{JSON.stringify(tableData, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="instructions">
          <h2>How to use:</h2>
          <div className="instruction-cards">
            <div className="card">
              <h3>Editing</h3>
              <p>Click on a cell to edit it. Click outside or press Escape to exit.</p>
            </div>
            
            <div className="card">
              <h3>Navigation</h3>
              <p>Use Tab/Shift+Tab to navigate. Arrows also work within edit mode.</p>
            </div>
            
            <div className="card">
              <h3>Submission</h3>
              <p>Press Enter on any cell to submit the entire row.</p>
            </div>
            
            <div className="card">
              <h3>Validation</h3>
              <p>Automatic validations appear when you leave the cell (onBlur).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;