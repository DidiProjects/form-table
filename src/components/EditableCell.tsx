import React, { useRef, useEffect } from 'react';
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
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
  const { value, error, setValue, isActive, setActive, nextField, previousField, submit, isLastField } = useField(field);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = type === 'number' 
      ? (e.target.value === '' ? null : Number(e.target.value)) 
      : e.target.value;
    setValue(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        previousField();
      } else {
        nextField();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isLastField) {
        submit();
      } else {
        nextField();
      }
    }
  };

  const handleFocus = () => {
    setActive();
  };

  if (type === 'select' && options) {
    return (
      <td className={`editable-cell ${error ? 'has-error' : ''} ${isActive ? 'is-active' : ''}`}>
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          value={value ?? ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
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
    <td className={`editable-cell ${error ? 'has-error' : ''} ${isActive ? 'is-active' : ''}`}>
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type={type}
        value={value ?? ''}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        className="cell-input"
      />
      {error && <span className="cell-error">{error}</span>}
    </td>
  );
};
