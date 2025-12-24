import React, { useState } from 'react';
import { Column, FormTableProvider, EditableCell, SchemaFactory, useSelectorContext } from '@dspackages/form-table';
import { CodeBlock } from './CodeBlock';

const columns: Column[] = [
  { formId: 'calc', field: 'quantity', type: 'number', label: 'Quantity', placeholder: '0' },
  { formId: 'calc', field: 'price', type: 'number', label: 'Unit Price', placeholder: '0.00' },
];

const defaultData = {
  calc: { quantity: 10, price: 25.50 },
};

const schemas: SchemaFactory = (yup) => ({
  calc: yup.object().shape({
    quantity: yup.number().min(1, 'Min 1').required('Required'),
    price: yup.number().min(0.01, 'Min 0.01').required('Required'),
  }),
});

const TotalCell: React.FC = () => {
  const total = useSelectorContext((state) => {
    const qty = state.calc?.quantity?.value || 0;
    const price = state.calc?.price?.value || 0;
    return qty * price;
  });

  return (
    <td className="computed-cell">
      <strong>{total.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong>
    </td>
  );
};

const codeExample = `import { useSelectorContext } from '@dspackages/form-table';

// Computed cell that reacts to form changes
const TotalCell: React.FC = () => {
  const total = useSelectorContext((state) => {
    const qty = state.calc?.quantity?.value || 0;
    const price = state.calc?.price?.value || 0;
    return qty * price;
  });

  return (
    <td className="computed-cell">
      <strong>{total.toLocaleString('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      })}</strong>
    </td>
  );
};

// Use inside FormTableProvider
<FormTableProvider columns={columns} initialData={initialData} schemas={schemas}>
  <tr>
    <EditableCell formId="calc" field="quantity" type="number" />
    <EditableCell formId="calc" field="price" type="number" />
    <TotalCell /> {/* Automatically updates! */}
  </tr>
</FormTableProvider>`;

export const ComputedValuesExample: React.FC = () => {
  const [formData, setFormData] = useState(defaultData);

  return (
    <div className="example-section">
      <div className="example-header">
        <h2>Computed Values</h2>
        <p className="example-description">
          Use <code>useSelectorContext</code> to create cells that automatically 
          recalculate when form values change. Perfect for totals, summaries, and derived data.
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
            calc: (values) => {
              const total = values.quantity * values.price;
              alert(`Order Placed!\n\nQuantity: ${values.quantity}\nPrice: $${values.price}\nTotal: $${total.toFixed(2)}`);
              setFormData({ calc: values });
            },
          }}
          debounceMs={300}
        >
          <table className="demo-table">
            <thead>
              <tr>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <EditableCell formId="calc" field="quantity" type="number" placeholder="0" />
                <EditableCell formId="calc" field="price" type="number" placeholder="0.00" />
                <TotalCell />
              </tr>
            </tbody>
          </table>
        </FormTableProvider>
        <p className="demo-hint">Change quantity or price - total updates in real-time!</p>
      </div>

      <div className="example-code">
        <h3>Code</h3>
        <CodeBlock code={codeExample} title="ComputedValuesExample.tsx" />
      </div>
    </div>
  );
};
