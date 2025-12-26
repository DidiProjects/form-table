import React from 'react';
import { CodeBlock } from './CodeBlock';

const keyboardShortcuts = [
  { key: 'Tab', action: 'Navigate to next field in form' },
  { key: 'Shift + Tab', action: 'Navigate to previous field in form' },
  { key: 'Enter', action: 'Navigate to next field, or Submit if all fields visited' },
  { key: 'Escape', action: 'Reset form to initial values and blur' },
];

const features = [
  {
    title: 'No yup dependency for consumers',
    description: 'Use SchemaFactory to get yup injected - no need to install it separately!',
  },
  {
    title: 'Per-form focus management',
    description: 'Each form group (formId) manages its own navigation. Tab stays within the form.',
  },
  {
    title: 'Auto-reset on blur',
    description: 'When focus leaves a form, it automatically resets to initial values.',
  },
  {
    title: 'Computed values with useSelectorContext',
    description: 'Create reactive cells that update when form values change.',
  },
  {
    title: 'Debounced validation',
    description: 'Validation runs after typing stops, configurable with debounceMs prop.',
  },
  {
    title: 'Multiple forms per row',
    description: 'Perfect for trading interfaces with buy/sell forms on the same row.',
  },
];

const installCode = `npm install @dspackages/form-table yup`;

const quickStartCode = `import { 
  FormTableProvider, 
  EditableCell, 
  SchemaFactory,
  Column 
} from '@dspackages/form-table';
import '@dspackages/form-table/dist/index.css';

const columns: Column[] = [
  { formId: 'form', field: 'name', type: 'text', label: 'Name' },
  { formId: 'form', field: 'value', type: 'number', label: 'Value' },
];

const schemas: SchemaFactory = (yup) => ({
  form: yup.object().shape({
    name: yup.string().required(),
    value: yup.number().min(0).required(),
  }),
});

function App() {
  return (
    <FormTableProvider
      columns={columns}
      initialData={{ form: { name: '', value: 0 } }}
      schemas={schemas}
      onSubmit={{ form: (values) => console.log(values) }}
    >
      <table>
        <tbody>
          <tr>
            <EditableCell formId="form" field="name" type="text" />
            <EditableCell formId="form" field="value" type="number" />
          </tr>
        </tbody>
      </table>
    </FormTableProvider>
  );
}`;

export const KeyboardNav: React.FC = () => {
  return (
    <div className="example-section keyboard-nav-section">
      <div className="example-header">
        <h2>Keyboard Navigation</h2>
        <p className="example-description">
          FormTable is designed for keyboard-first workflows. Navigate quickly between fields without touching the mouse.
        </p>
      </div>

      <div className="keyboard-shortcuts">
        <table className="shortcuts-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {keyboardShortcuts.map((shortcut) => (
              <tr key={shortcut.key}>
                <td><kbd>{shortcut.key}</kbd></td>
                <td>{shortcut.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="example-header" style={{ marginTop: '40px' }}>
        <h2>Features</h2>
      </div>

      <div className="features-grid">
        {features.map((feature) => (
          <div key={feature.title} className="feature-card">
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="example-header" style={{ marginTop: '40px' }}>
        <h2>Quick Start</h2>
      </div>

      <div className="example-code">
        <CodeBlock code={installCode} language="bash" title="Install" />
        <CodeBlock code={quickStartCode} title="App.tsx" />
      </div>
    </div>
  );
};
