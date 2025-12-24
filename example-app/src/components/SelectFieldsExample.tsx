import React, { useState, useCallback, memo } from 'react';
import { Column, FormTableProvider, EditableCell, SchemaFactory } from '@dspackages/form-table';
import { CodeBlock } from './CodeBlock';

const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'food', label: 'Food & Beverage' },
  { value: 'books', label: 'Books' },
];

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending Review' },
];

const columns: Column[] = [
  { formId: 'product', field: 'name', type: 'text', label: 'Product Name', placeholder: 'Enter name' },
  { formId: 'product', field: 'category', type: 'select', label: 'Category', options: categoryOptions },
  { formId: 'product', field: 'status', type: 'select', label: 'Status', options: statusOptions },
  { formId: 'product', field: 'price', type: 'number', label: 'Price', placeholder: '0.00' },
];

const defaultProducts = [
  { name: 'Wireless Headphones', category: 'electronics', status: 'active', price: 149.99 },
  { name: 'Organic Green Tea', category: 'food', status: 'active', price: 12.50 },
  { name: 'Programming Book', category: 'books', status: 'pending', price: 45.00 },
];

const schemas: SchemaFactory = (yup) => ({
  product: yup.object().shape({
    name: yup.string().required('Name is required').min(3, 'Min 3 characters'),
    category: yup.string().required('Select a category'),
    status: yup.string().required('Select a status'),
    price: yup.number().min(0.01, 'Min $0.01').required('Price is required'),
  }),
});

interface ProductRowProps {
  data: typeof defaultProducts[0];
  onUpdate: (idx: number, values: typeof defaultProducts[0]) => void;
  idx: number;
}

const ProductRow: React.FC<ProductRowProps> = memo(({ data, onUpdate, idx }) => {
  return (
    <FormTableProvider
      key={JSON.stringify(data)}
      columns={columns}
      initialData={{ product: data }}
      schemas={schemas}
      onSubmit={{
        product: (values) => {
          console.log('Product updated:', values);
          alert(`Product Updated!\n\n${JSON.stringify(values, null, 2)}`);
          onUpdate(idx, values);
        },
      }}
      debounceMs={300}
    >
      <tr>
        {columns.map((col) => (
          <EditableCell
            key={col.field}
            formId={col.formId}
            field={col.field}
            type={col.type}
            placeholder={col.placeholder}
            options={col.options}
          />
        ))}
      </tr>
    </FormTableProvider>
  );
});

const codeExample = `// Define select options
const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'food', label: 'Food & Beverage' },
];

// Include in column definition
const columns: Column[] = [
  { 
    formId: 'product', 
    field: 'name', 
    type: 'text', 
    label: 'Product Name' 
  },
  { 
    formId: 'product', 
    field: 'category', 
    type: 'select',  // <-- select type
    label: 'Category', 
    options: categoryOptions  // <-- options array
  },
  { 
    formId: 'product', 
    field: 'price', 
    type: 'number', 
    label: 'Price' 
  },
];

// Render with options prop
<EditableCell
  formId="product"
  field="category"
  type="select"
  options={categoryOptions}
/>`;

export const SelectFieldsExample: React.FC = () => {
  const [products, setProducts] = useState(defaultProducts);

  const handleUpdate = useCallback((idx: number, values: typeof defaultProducts[0]) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[idx] = values;
      return updated;
    });
  }, []);

  return (
    <div className="example-section">
      <div className="example-header">
        <h2>Select Dropdowns</h2>
        <p className="example-description">
          Use <code>type="select"</code> with an <code>options</code> array for dropdown fields.
          Supports keyboard navigation (Arrow keys, Enter, Escape).
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
            {products.map((product, idx) => (
              <ProductRow key={idx} data={product} onUpdate={handleUpdate} idx={idx} />
            ))}
          </tbody>
        </table>
        <p className="demo-hint">Click dropdown or use keyboard arrows to change selection</p>
      </div>

      <div className="example-code">
        <h3>Code</h3>
        <CodeBlock code={codeExample} title="SelectFieldsExample.tsx" />
      </div>
    </div>
  );
};
