import React from 'react';
import { Column, FormSubmitHandlers, FormTableProvider, EditableCell, useSelectorContext, SchemaFactory } from '@dspackages/form-table';

type TOrderData = {
  quantity: number;
  price: number;
}

interface Stock {
  ticker: string;
  buyData: TOrderData;
  sellData: TOrderData;
}

const initialStocks: Stock[] = [
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
    <td className={`volume-cell volume-${formId}`}>
      {volume.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
    </td>
  );
};

interface StockRowProps {
  stock: Stock;
}

const StockRow: React.FC<StockRowProps> = ({ stock }) => {
  const initialData = {
    buy: stock.buyData,
    sell: stock.sellData,
  };

  const onSubmit: FormSubmitHandlers = {
    buy: (values: TOrderData) => {
      console.log(`BUY order for ${stock.ticker}:`, values);
      alert(`BUY Order - ${stock.ticker}\n\nQuantity: ${values.quantity}\nPrice: R$ ${values.price.toFixed(2)}\nTotal: R$ ${(values.quantity * values.price).toFixed(2)}`);
    },
    sell: (values: TOrderData) => {
      console.log(`SELL order for ${stock.ticker}:`, values);
      alert(`SELL Order - ${stock.ticker}\n\nQuantity: ${values.quantity}\nPrice: R$ ${values.price.toFixed(2)}\nTotal: R$ ${(values.quantity * values.price).toFixed(2)}`);
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
      <tr>
        <td className="ticker-cell">{stock.ticker}</td>
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
      </tr>
    </FormTableProvider>
  );
};

export const BookOrders: React.FC = () => {
  return (
    <div className="bookorders-container">
      <h2>Book Orders</h2>
      <p className="bookorders-instructions">
        Tab navigates within each form (Buy/Sell). Press Enter on the last field to submit the order.
      </p>
      <table className="form-table bookorders-table">
        <thead>
          <tr>
            <th rowSpan={2} className="ticker-header">Ticker</th>
            <th colSpan={buyColumns.length + 1} className="group-header buy-header">Buy</th>
            <th colSpan={sellColumns.length + 1} className="group-header sell-header">Sell</th>
          </tr>
          <tr>
            <th className="volume-header">Volume</th>
            {buyColumns.map(col => (
              <th key={`buy-${col.field}`}>{col.label}</th>
            ))}
            {sellColumns.map(col => (
              <th key={`sell-${col.field}`}>{col.label}</th>
            ))}
            <th className="volume-header">Volume</th>
          </tr>
        </thead>
        <tbody>
          {initialStocks.map(stock => (
            <StockRow key={stock.ticker} stock={stock} />
          ))}
        </tbody>
      </table>
    </div>
  );
};
