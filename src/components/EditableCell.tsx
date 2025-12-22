import React from 'react';
import { useFormTable } from '../context/FormTableContext';

interface EditableCellProps {
  field: string;
  type?: 'text' | 'number' | 'email';
  placeholder?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  field,
  type = 'text',
  placeholder
}) => {
  const { data, update } = useFormTable();
  const fieldData = data[field];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value;
    update(field, newValue);
  };

  return (
    <td className="editable-cell">
      <input
        type={type}
        value={fieldData?.value ?? ''}
        onChange={handleChange}
        placeholder={placeholder}
        className="cell-input"
      />
    </td>
  );
};
