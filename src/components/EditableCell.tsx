import React from 'react';
import * as yup from 'yup';
import { useField } from '../context/FieldContext';

interface EditableCellProps {
  field: string;
  type?: 'text' | 'number' | 'email';
  validation?: yup.AnySchema;
  placeholder?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  field,
  type = 'text',
  validation,
  placeholder
}) => {
  const { value, error, setValue, validate } = useField(field);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value;
    setValue(newValue);
  };

  const handleBlur = () => {
    if (validation) {
      validate(validation);
    }
  };

  return (
    <td className={`editable-cell ${error ? 'has-error' : ''}`}>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="cell-input"
      />
      {error && <span className="cell-error">{error}</span>}
    </td>
  );
};
