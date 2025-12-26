
# FormTable

[Demo: ds-form-table.netlify.app](https://ds-form-table.netlify.app/)

A React form manager for tables with editable cells, keyboard navigation, Yup validation, and context-based state management. Built for performance, flexibility, and modern UI.

## Features

- Editable cells: text, number, email, select
- Keyboard navigation: Tab, Shift+Tab, Enter, Escape
- Validation with Yup via SchemaFactory
- Context-based state management
- Visual states: active, error, self, modified
- Responsive, accessible, and fast
- Virtualized support for large tables

## Installation

```bash
npm install @dspackages/form-table yup
```

> **Important:** `yup` is a peer dependency and must be installed in your project. If you do not install it, your app will fail to compile or run.

## Basic Usage

```tsx
import React, { useState } from 'react';
import { FormTableProvider, SchemaFactory } from '@dspackages/form-table';
import { EditableCell } from 'your-component'
import * as yup from 'yup';

const columns = [
  { formId: 'user', field: 'name', type: 'text', label: 'Name', placeholder: 'Enter name' },
  { formId: 'user', field: 'email', type: 'email', label: 'Email', placeholder: 'email@example.com' },
];

const defaultData = { user: { name: '', email: '' } };

const schemas: SchemaFactory = (yup) => ({
  user: yup.object().shape({
    name: yup.string().required('Name is required').min(2, 'Min 2 characters'),
    email: yup.string().email('Invalid email').required('Email is required'),
  }),
});

export default function App() {
  return (
    <FormTableProvider
      columns={columns}
      initialData={defaultData}
      schemas={schemas}
      onSubmit={{ user: (values) => console.log(values) }}
    >
      <div className="demo-table">
        <div className="demo-header">
          {columns.map(col => (
            <div key={col.field} className="demo-cell">{col.label}</div>
          ))}
        </div>
        <div className="demo-row">
          {columns.map(col => (
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
  );
}
```

## Keyboard Navigation

| Key           | Action                       |
|---------------|-----------------------------|
| Tab           | Next cell                    |
| Shift + Tab   | Previous cell                |
| Enter         | Submit (if all visited/self) |
| Escape        | Reset form                   |

## Validation

- Yup schemas are injected via SchemaFactory
- Validation runs on blur and change
- Error messages and error styling are automatic

## Advanced Usage

- Multiple forms per row (see MultipleFormsExample)
- Virtualized tables for large datasets (see VirtualizedExample)
- Custom cell rendering
- Computed values and derived cells

## Example App

To run the example app:

```bash
cd example-app
npm install
npm start
```

## Compatibility

- React >= 18
- TypeScript >= 4.0
- Modern browsers

## License

MIT

---
Made by Diego (@dspackages)