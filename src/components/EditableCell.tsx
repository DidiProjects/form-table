import React from 'react';
import { useField } from '../context/FormTableContext';

interface EditableCellProps {
  field: string;
  type?: 'text' | 'number' | 'email' | 'select';
  placeholder?: string;
  options?: { value: string | number; label: string }[];
}

export const EditableCell: React.FC<EditableCellProps> = ({
  field,
  type = 'text',
  placeholder,
  options
}) => {
  const { value, error, setValue } = useField(field);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = type === 'number' 
      ? (e.target.value === '' ? null : Number(e.target.value)) 
      : e.target.value;
    setValue(newValue);
  };

  if (type === 'select' && options) {
    return (
      <td className={`editable-cell ${error ? 'has-error' : ''}`}>
        <select
          value={value ?? ''}
          onChange={handleChange}
          className="cell-input"
        >
          <option value="">{placeholder || 'Select...'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        {error && <span className="cell-error">{error}</span>}
      </td>
    );
  }

  return (
    <td className={`editable-cell ${error ? 'has-error' : ''}`}>
      <input
        type={type}
        value={value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="cell-input"
      />
      {error && <span className="cell-error">{error}</span>}
    </td>
  );
};
