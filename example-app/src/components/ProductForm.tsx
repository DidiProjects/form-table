import React from 'react';
import { Column, SchemaFactory, FormSubmitHandlers, FormTableProvider } from '@dspackages/form-table';
import { EditableCell } from './EditableCell';

type TProductData = {
  name: string;
  email: string;
  category: string;
  price: number;
  quantity: number;
}

interface Product {
  id: number;
  data: TProductData;
}

const categoryOptions = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'food', label: 'Food' },
  { value: 'books', label: 'Books' },
  { value: 'toys', label: 'Toys' },
];

const initialProducts: Product[] = [
  { id: 1, data: { name: 'Laptop Pro', email: 'tech@store.com', category: 'electronics', price: 2999.99, quantity: 15 } },
  { id: 2, data: { name: 'Winter Jacket', email: 'fashion@store.com', category: 'clothing', price: 189.90, quantity: 42 } },
  { id: 3, data: { name: 'Organic Coffee', email: 'food@store.com', category: 'food', price: 24.50, quantity: 200 } },
  { id: 4, data: { name: 'TypeScript Guide', email: 'books@store.com', category: 'books', price: 59.90, quantity: 85 } },
];

const columns: Column[] = [
  { formId: 'product', field: 'name', type: 'text', label: 'Product Name', placeholder: 'Enter name' },
  { formId: 'product', field: 'email', type: 'email', label: 'Contact Email', placeholder: 'email@example.com' },
  { formId: 'product', field: 'category', type: 'select', label: 'Category', placeholder: 'Select', options: categoryOptions },
  { formId: 'product', field: 'price', type: 'number', label: 'Price ($)', placeholder: '0.00' },
  { formId: 'product', field: 'quantity', type: 'number', label: 'Stock', placeholder: '0' },
];

const schema: SchemaFactory = (yup) => ({
  product: yup.object().shape({
    name: yup.string().required('Name is required').min(3, 'Min 3 chars'),
    email: yup.string().email('Invalid email').required('Email is required'),
    category: yup.string().required('Category is required'),
    price: yup.number().min(0.01, 'Min $0.01').required('Price is required'),
    quantity: yup.number().min(0, 'Min 0').integer('Must be integer').required('Quantity is required'),
  }),
});

interface ProductRowProps {
  product: Product;
}

const ProductRow: React.FC<ProductRowProps> = ({ product }) => {
  const initialData = {
    product: product.data,
  };

  const onSubmit: FormSubmitHandlers = {
    product: (values: TProductData) => {
      console.log(`Product #${product.id} updated:`, values);
      alert(`Product Updated!\n\nName: ${values.name}\nEmail: ${values.email}\nCategory: ${values.category}\nPrice: $${values.price.toFixed(2)}\nStock: ${values.quantity}`);
    },
  };

  return (
    <FormTableProvider
      columns={columns}
      initialData={initialData}
      schemas={schema}
      onSubmit={onSubmit}
      debounceMs={300}
    >
      <div className="demo-row">
        {columns.map(col => (
          <EditableCell
            key={col.field}
            formId={col.formId}
            field={col.field}
            type={col.type}
            placeholder={col.placeholder}
            options={col.options}
          />
        ))}
      </div>
    </FormTableProvider>
  );
};

export const ProductForm: React.FC = () => {
  return (
    <div className="productform-container">
      <h2>Product Inventory</h2>
      <p className="productform-instructions">
        Single form per row with multiple field types: text, email, select, and number.
        Tab navigates through all fields. Press Enter on the last field to submit.
      </p>
      <div className="demo-table productform-table">
        <div className="demo-header">
          {columns.map(col => (
            <div key={col.field} className="demo-cell">{col.label}</div>
          ))}
        </div>
        <div className="demo-body">
          {initialProducts.map(product => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
