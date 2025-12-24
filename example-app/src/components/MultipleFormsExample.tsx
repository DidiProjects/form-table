import React, { useState, useCallback, memo } from 'react';
import { Column, FormTableProvider, EditableCell, SchemaFactory, FormSubmitHandlers, useSelectorContext } from '@dspackages/form-table';
import { CodeBlock } from './CodeBlock';

const buyColumns: Column[] = [
  { formId: 'buy', field: 'quantity', type: 'number', label: 'Qty', placeholder: '0' },
  { formId: 'buy', field: 'price', type: 'number', label: 'Price', placeholder: '0.00' },
];

const sellColumns: Column[] = [
  { formId: 'sell', field: 'price', type: 'number', label: 'Price', placeholder: '0.00' },
  { formId: 'sell', field: 'quantity', type: 'number', label: 'Qty', placeholder: '0' },
];

const schemas: SchemaFactory = (yup) => ({
  buy: yup.object().shape({
    quantity: yup.number().min(1, 'Min 1').required('Required'),
    price: yup.number().min(0.01, 'Min 0.01').required('Required'),
  }),
  sell: yup.object().shape({
    quantity: yup.number().min(1, 'Min 1').required('Required'),
    price: yup.number().min(0.01, 'Min 0.01').required('Required'),
  }),
});

interface VolumeCellProps {
  formId: 'buy' | 'sell';
}

const VolumeCell: React.FC<VolumeCellProps> = ({ formId }) => {
  const volume = useSelectorContext((state) => {
    const qty = state[formId]?.quantity?.value || 0;
    const price = state[formId]?.price?.value || 0;
    return qty * price;
  });

  return (
    <td className={`volume-cell volume-${formId}`}>
      {volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
    </td>
  );
};

interface StockRowProps {
  ticker: string;
  buyData: { quantity: number; price: number };
  sellData: { quantity: number; price: number };
  onUpdate: (ticker: string, formId: 'buy' | 'sell', values: { quantity: number; price: number }) => void;
}

const StockRow: React.FC<StockRowProps> = memo(({ ticker, buyData, sellData, onUpdate }) => {
  const onSubmit: FormSubmitHandlers = {
    buy: (values) => {
      alert(`BUY ${ticker}: ${values.quantity} @ $${values.price}`);
      onUpdate(ticker, 'buy', values);
    },
    sell: (values) => {
      alert(`SELL ${ticker}: ${values.quantity} @ $${values.price}`);
      onUpdate(ticker, 'sell', values);
    },
  };

  return (
    <FormTableProvider
      columns={[...buyColumns, ...sellColumns]}
      initialData={{ buy: buyData, sell: sellData }}
      schemas={schemas}
      onSubmit={onSubmit}
      debounceMs={300}
    >
      <tr>
        <td className="ticker-cell">{ticker}</td>
        <VolumeCell formId="buy" />
        {buyColumns.map((col) => (
          <EditableCell key={`buy-${col.field}`} formId="buy" field={col.field} type="number" placeholder={col.placeholder} />
        ))}
        {sellColumns.map((col) => (
          <EditableCell key={`sell-${col.field}`} formId="sell" field={col.field} type="number" placeholder={col.placeholder} />
        ))}
        <VolumeCell formId="sell" />
      </tr>
    </FormTableProvider>
  );
});

const codeExample = `// Multiple independent forms per row
const buyColumns: Column[] = [
  { formId: 'buy', field: 'quantity', type: 'number', label: 'Qty' },
  { formId: 'buy', field: 'price', type: 'number', label: 'Price' },
];

const sellColumns: Column[] = [
  { formId: 'sell', field: 'price', type: 'number', label: 'Price' },
  { formId: 'sell', field: 'quantity', type: 'number', label: 'Qty' },
];

// Separate validation for each form
const schemas: SchemaFactory = (yup) => ({
  buy: yup.object().shape({
    quantity: yup.number().min(1).required(),
    price: yup.number().min(0.01).required(),
  }),
  sell: yup.object().shape({
    quantity: yup.number().min(1).required(),
    price: yup.number().min(0.01).required(),
  }),
});

// Separate submit handlers
const onSubmit: FormSubmitHandlers = {
  buy: (values) => console.log('BUY order:', values),
  sell: (values) => console.log('SELL order:', values),
};

// Each row is its own FormTableProvider
<FormTableProvider
  columns={[...buyColumns, ...sellColumns]}
  initialData={{ buy: buyData, sell: sellData }}
  schemas={schemas}
  onSubmit={onSubmit}
>
  <tr>
    <EditableCell formId="buy" field="quantity" type="number" />
    <EditableCell formId="buy" field="price" type="number" />
    <EditableCell formId="sell" field="price" type="number" />
    <EditableCell formId="sell" field="quantity" type="number" />
  </tr>
</FormTableProvider>`;

const defaultStocks = [
  { ticker: 'AAPL', buyData: { quantity: 100, price: 178.50 }, sellData: { quantity: 50, price: 179.00 } },
  { ticker: 'GOOGL', buyData: { quantity: 25, price: 141.20 }, sellData: { quantity: 10, price: 142.00 } },
  { ticker: 'MSFT', buyData: { quantity: 75, price: 378.90 }, sellData: { quantity: 30, price: 380.00 } },
];

export const MultipleFormsExample: React.FC = () => {
  const [stocks, setStocks] = useState(defaultStocks);

  const handleUpdate = useCallback((ticker: string, formId: 'buy' | 'sell', values: { quantity: number; price: number }) => {
    setStocks(prev => prev.map(stock => {
      if (stock.ticker !== ticker) return stock;
      return {
        ...stock,
        [formId === 'buy' ? 'buyData' : 'sellData']: values,
      };
    }));
  }, []);

  return (
    <div className="example-section">
      <div className="example-header">
        <h2>Multiple Forms per Row</h2>
        <p className="example-description">
          Each row can have multiple independent forms. Tab navigates within each form group,
          and each form has its own validation and submit handler. Perfect for trading interfaces!
        </p>
      </div>

      <div className="example-demo">
        <h3>Live Demo</h3>
        <table className="demo-table trading-table">
          <thead>
            <tr>
              <th rowSpan={2}>Ticker</th>
              <th colSpan={3} className="buy-header">Buy</th>
              <th colSpan={3} className="sell-header">Sell</th>
            </tr>
            <tr>
              <th>Volume</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Price</th>
              <th>Qty</th>
              <th>Volume</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <StockRow key={stock.ticker} {...stock} onUpdate={handleUpdate} />
            ))}
          </tbody>
        </table>
        <p className="demo-hint">Tab stays within Buy or Sell form. Enter submits that form only.</p>
      </div>

      <div className="example-code">
        <h3>Code</h3>
        <CodeBlock code={codeExample} title="MultipleFormsExample.tsx" />
      </div>
    </div>
  );
};
