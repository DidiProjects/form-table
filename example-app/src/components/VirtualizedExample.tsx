import React, { useCallback, useState, memo } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Column, FormTableProvider, EditableCell, SchemaFactory, FormSubmitHandlers, useSelectorContext } from '@dspackages/form-table';
import { CodeBlock } from './CodeBlock';

const TOTAL_ROWS = 2000;

interface RowData {
  id: number;
  ticker: string;
  buyData: { quantity: number; price: number };
  sellData: { quantity: number; price: number };
  isSelfBuy: boolean;
  isSelfSell: boolean;
}

interface SubmissionLog {
  id: string;
  timestamp: Date;
  type: 'buy' | 'sell';
  ticker: string;
  rowId: number;
  quantity: number;
  price: number;
  volume: number;
}

const tickers = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META', 'NVDA', 'TSLA', 'AMD', 'INTC', 'NFLX', 'CRM', 'ORCL', 'IBM', 'ADBE', 'PYPL'];

const generateRows = (count: number): RowData[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    ticker: tickers[i % tickers.length],
    buyData: { 
      quantity: Math.floor(Math.random() * 500) + 10, 
      price: +(Math.random() * 500 + 50).toFixed(2) 
    },
    sellData: { 
      quantity: Math.floor(Math.random() * 500) + 10, 
      price: +(Math.random() * 500 + 50).toFixed(2) 
    },
    isSelfBuy: Math.random() < 0.3,
    isSelfSell: Math.random() < 0.3,
  }));
};

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
    <div className={`virtual-volume-cell volume-${formId}`}>
      {volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
    </div>
  );
};

interface VirtualRowProps {
  data: RowData;
  style: React.CSSProperties;
  onSubmission: (log: SubmissionLog) => void;
  onUpdate: (id: number, formId: 'buy' | 'sell', values: { quantity: number; price: number }) => void;
}

const VirtualRow: React.FC<VirtualRowProps> = memo(({ data, style, onSubmission, onUpdate }) => {
  const onSubmit: FormSubmitHandlers = {
    buy: (values) => {
      onSubmission({
        id: `${data.id}-buy-${Date.now()}`,
        timestamp: new Date(),
        type: 'buy',
        ticker: data.ticker,
        rowId: data.id + 1,
        quantity: values.quantity,
        price: values.price,
        volume: values.quantity * values.price,
      });
      onUpdate(data.id, 'buy', values);
    },
    sell: (values) => {
      onSubmission({
        id: `${data.id}-sell-${Date.now()}`,
        timestamp: new Date(),
        type: 'sell',
        ticker: data.ticker,
        rowId: data.id + 1,
        quantity: values.quantity,
        price: values.price,
        volume: values.quantity * values.price,
      });
      onUpdate(data.id, 'sell', values);
    },
  };

  return (
    <div className="virtual-row" style={style}>
      <FormTableProvider
        columns={[...buyColumns, ...sellColumns]}
        initialData={{ buy: data.buyData, sell: data.sellData }}
        schemas={schemas}
        onSubmit={onSubmit}
        debounceMs={300}
      >
        <div className="virtual-row-inner">
          <div className="virtual-cell virtual-id">{data.id + 1}</div>
          <div className="virtual-cell virtual-ticker">{data.ticker}</div>
          <div className={`virtual-cell-group buy-group ${data.isSelfBuy ? 'is-self' : ''}`}>
            <VolumeCell formId="buy" />
            <div className="virtual-cell virtual-input">
              <EditableCell formId="buy" field="quantity" type="number" placeholder="0" submitOnEnter={data.isSelfBuy} />
            </div>
            <div className="virtual-cell virtual-input">
              <EditableCell formId="buy" field="price" type="number" placeholder="0.00" submitOnEnter={data.isSelfBuy} />
            </div>
          </div>
          <div className={`virtual-cell-group sell-group ${data.isSelfSell ? 'is-self' : ''}`}>
            <div className="virtual-cell virtual-input">
              <EditableCell formId="sell" field="price" type="number" placeholder="0.00" submitOnEnter={data.isSelfSell} />
            </div>
            <div className="virtual-cell virtual-input">
              <EditableCell formId="sell" field="quantity" type="number" placeholder="0" submitOnEnter={data.isSelfSell} />
            </div>
            <VolumeCell formId="sell" />
          </div>
        </div>
      </FormTableProvider>
    </div>
  );
});

const codeExample = `import { FixedSizeList as List } from 'react-window';
import { FormTableProvider, EditableCell, useSelectorContext } from '@dspackages/form-table';

const TOTAL_ROWS = 1000;

// Generate 1000 rows of data
const rows = Array.from({ length: TOTAL_ROWS }, (_, i) => ({
  id: i,
  ticker: tickers[i % tickers.length],
  buyData: { quantity: Math.random() * 500, price: Math.random() * 500 },
  sellData: { quantity: Math.random() * 500, price: Math.random() * 500 },
}));

// Each virtualized row is its own FormTableProvider
const VirtualRow = ({ data, style }) => (
  <div style={style}>
    <FormTableProvider
      columns={columns}
      initialData={{ buy: data.buyData, sell: data.sellData }}
      schemas={schemas}
      onSubmit={onSubmit}
    >
      <div className="virtual-row">
        <span>{data.ticker}</span>
        <VolumeCell formId="buy" />
        <EditableCell formId="buy" field="quantity" type="number" />
        <EditableCell formId="buy" field="price" type="number" />
        <EditableCell formId="sell" field="price" type="number" />
        <EditableCell formId="sell" field="quantity" type="number" />
        <VolumeCell formId="sell" />
      </div>
    </FormTableProvider>
  </div>
);

// Virtualized list - only renders visible rows!
<List
  height={500}
  itemCount={TOTAL_ROWS}
  itemSize={56}
  width="100%"
  itemData={rows}
>
  {({ index, style, data }) => (
    <VirtualRow data={data[index]} style={style} />
  )}
</List>`;

export const VirtualizedExample: React.FC = () => {
  const [rows, setRows] = useState<RowData[]>(() => generateRows(TOTAL_ROWS));
  const [submissions, setSubmissions] = useState<SubmissionLog[]>([]);

  const handleSubmission = useCallback((log: SubmissionLog) => {
    setSubmissions((prev) => [log, ...prev].slice(0, 10));
  }, []);

  const handleUpdate = useCallback((id: number, formId: 'buy' | 'sell', values: { quantity: number; price: number }) => {
    setRows((prev) => prev.map((row) => {
      if (row.id !== id) return row;
      return {
        ...row,
        [formId === 'buy' ? 'buyData' : 'sellData']: values,
        [formId === 'buy' ? 'isSelfBuy' : 'isSelfSell']: true,
      };
    }));
  }, []);

  const Row = useCallback(({ index, style, data }: ListChildComponentProps<RowData[]>) => {
    return <VirtualRow data={data[index]} style={style} onSubmission={handleSubmission} onUpdate={handleUpdate} />;
  }, [handleSubmission, handleUpdate]);

  return (
    <div className="example-section">
      <div className="example-header">
        <h2>Virtualized Table (2,000 Rows)</h2>
        <p className="example-description">
          Using <code>react-window</code> for virtualization. Only visible rows are rendered,
          enabling smooth performance with thousands of rows. Each row maintains its own form state.
          Highlighted cells are your orders (30% each side). Editing makes that side yours.
        </p>
      </div>

      <div className="example-demo">
        <h3>Live Demo - {TOTAL_ROWS.toLocaleString()} Rows</h3>
        
        {submissions.length > 0 && (
          <div className="submissions-log">
            <div className="submissions-header">
              <span>Recent Submissions</span>
              <button onClick={() => setSubmissions([])}>Clear</button>
            </div>
            <div className="submissions-list">
              {submissions.map((log) => (
                <div key={log.id} className={`submission-item ${log.type}`}>
                  <span className="submission-type">{log.type.toUpperCase()}</span>
                  <span className="submission-ticker">{log.ticker}</span>
                  <span className="submission-details">
                    Row #{log.rowId} | {log.quantity} @ ${log.price.toFixed(2)} = ${log.volume.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="submission-time">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="virtual-table-container">
          <div className="virtual-header">
            <div className="virtual-cell virtual-id">#</div>
            <div className="virtual-cell virtual-ticker">Ticker</div>
            <div className="virtual-cell virtual-volume buy-header">Buy Vol</div>
            <div className="virtual-cell virtual-input buy-header">Qty</div>
            <div className="virtual-cell virtual-input buy-header">Price</div>
            <div className="virtual-cell virtual-input sell-header">Price</div>
            <div className="virtual-cell virtual-input sell-header">Qty</div>
            <div className="virtual-cell virtual-volume sell-header">Sell Vol</div>
          </div>
          <FixedSizeList
            height={500}
            itemCount={rows.length}
            itemSize={56}
            width="100%"
            itemData={rows}
          >
            {Row}
          </FixedSizeList>
        </div>
        <p className="demo-hint">Tab through fields and press Enter to submit. Last 10 submissions shown above.</p>
      </div>

      <div className="example-code">
        <h3>Code</h3>
        <CodeBlock code={codeExample} title="VirtualizedExample.tsx" />
      </div>
    </div>
  );
};
