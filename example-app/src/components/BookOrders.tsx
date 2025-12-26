import React, { useState, useCallback, memo } from 'react';
import { Column, FormSubmitHandlers, FormTableProvider, useSelectorContext, SchemaFactory } from '@dspackages/form-table';
import { EditableCell } from './EditableCell';

type TOrderData = {
  quantity: number;
  price: number;
}

interface Stock {
  ticker: string;
  buyData: TOrderData;
  sellData: TOrderData;
}

const defaultStocks: Stock[] = [
  { ticker: 'PETR4', buyData: { quantity: 100, price: 38.50 }, sellData: { quantity: 50, price: 39.00 } },
  { ticker: 'VALE3', buyData: { quantity: 200, price: 62.30 }, sellData: { quantity: 100, price: 63.50 } },
  { ticker: 'ITUB4', buyData: { quantity: 150, price: 25.80 }, sellData: { quantity: 75, price: 26.20 } },
  { ticker: 'BBDC4', buyData: { quantity: 300, price: 12.45 }, sellData: { quantity: 200, price: 12.80 } },
  { ticker: 'ABEV3', buyData: { quantity: 500, price: 11.20 }, sellData: { quantity: 250, price: 11.50 } },
];

const buyColumns: Column[] = [
  { formId: 'buy', field: 'quantity', type: 'number', label: 'Quantity', placeholder: '0' },
  { formId: 'buy', field: 'price', type: 'number', label: 'Price', placeholder: '0.00' },
];

const sellColumns: Column[] = [
  { formId: 'sell', field: 'price', type: 'number', label: 'Price', placeholder: '0.00' },
  { formId: 'sell', field: 'quantity', type: 'number', label: 'Quantity', placeholder: '0' },
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
  const volume = useSelectorContext(state => {
    const quantity = state[formId]?.quantity?.value || 0;
    const price = state[formId]?.price?.value || 0;
    return quantity * price;
  });

  return (
    <div className={`demo-cell volume-cell volume-${formId}`}>
      {volume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    </div>
  );
};

interface StockRowProps {
  stock: Stock;
  onUpdate: (ticker: string, formId: 'buy' | 'sell', values: TOrderData) => void;
}

const StockRow: React.FC<StockRowProps> = memo(({ stock, onUpdate }) => {
  const initialData = {
    buy: stock.buyData,
    sell: stock.sellData,
  };

  const onSubmit: FormSubmitHandlers = {
    buy: (values: TOrderData) => {
      console.log(`BUY order for ${stock.ticker}:`, values);
      alert(`BUY Order - ${stock.ticker}\n\nQuantity: ${values.quantity}\nPrice: R$ ${values.price.toFixed(2)}\nTotal: R$ ${(values.quantity * values.price).toFixed(2)}`);
      onUpdate(stock.ticker, 'buy', values);
    },
    sell: (values: TOrderData) => {
      console.log(`SELL order for ${stock.ticker}:`, values);
      alert(`SELL Order - ${stock.ticker}\n\nQuantity: ${values.quantity}\nPrice: R$ ${values.price.toFixed(2)}\nTotal: R$ ${(values.quantity * values.price).toFixed(2)}`);
      onUpdate(stock.ticker, 'sell', values);
    },
  };

  return (
    <FormTableProvider
      columns={[...buyColumns, ...sellColumns]}
      initialData={initialData}
      schemas={schemas}
      onSubmit={onSubmit}
      debounceMs={300}
    >
      <div className="demo-row">
        <div className="demo-cell ticker-cell">{stock.ticker}</div>
        <VolumeCell formId="buy" />
        {buyColumns.map(col => (
          <EditableCell
            key={`buy-${col.field}`}
            formId={col.formId}
            field={col.field}
            type={col.type}
            placeholder={col.placeholder}
          />
        ))}
        {sellColumns.map(col => (
          <EditableCell
            key={`sell-${col.field}`}
            formId={col.formId}
            field={col.field}
            type={col.type}
            placeholder={col.placeholder}
          />
        ))}
        <VolumeCell formId="sell" />
      </div>
    </FormTableProvider>
  );
});

export const BookOrders: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>(defaultStocks);

  const handleUpdate = useCallback((ticker: string, formId: 'buy' | 'sell', values: TOrderData) => {
    setStocks(prev => prev.map(stock => {
      if (stock.ticker !== ticker) return stock;
      return {
        ...stock,
        [formId === 'buy' ? 'buyData' : 'sellData']: values,
      };
    }));
  }, []);

  return (
    <div className="bookorders-container">
      <h2>Book Orders</h2>
      <p className="bookorders-instructions">
        Tab navigates within each form (Buy/Sell). Press Enter on the last field to submit the order.
      </p>
      <div className="demo-table bookorders-table">
        <div className="demo-header">
          <div className="demo-cell ticker-header">Ticker</div>
          <div className="demo-cell volume-header buy-header">Volume</div>
          {buyColumns.map(col => (
            <div key={`buy-${col.field}`} className="demo-cell buy-header">{col.label}</div>
          ))}
          {sellColumns.map(col => (
            <div key={`sell-${col.field}`} className="demo-cell sell-header">{col.label}</div>
          ))}
          <div className="demo-cell volume-header sell-header">Volume</div>
        </div>
        <div className="demo-body">
          {stocks.map(stock => (
            <StockRow key={stock.ticker} stock={stock} onUpdate={handleUpdate} />
          ))}
        </div>
      </div>
    </div>
  );
};
