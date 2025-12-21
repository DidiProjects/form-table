import React, { useRef, useEffect, useCallback } from 'react';
import { useFormTableCell, useFormTable } from '../context/FormTableContext';
import { CellConfig } from '../types';

interface EditableCellProps {
  rowId: string;
  cellKey: string;
  config: CellConfig;
  className?: string;
  tabIndex?: number;
}

export const EditableCell: React.FC<EditableCellProps> = ({
  rowId,
  cellKey,
  config,
  className = '',
  tabIndex
}) => {
  const { cellData, isActive, updateValue, startEdit, endEdit, validate } = useFormTableCell(rowId, cellKey);
  const { navigateCell, submitRow, config: tableConfig } = useFormTable();
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  // Focus input when cell becomes active and is editing
  useEffect(() => {
    if (isActive && cellData?.isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      }
    }
  }, [isActive, cellData?.isEditing]);

  const handleClick = useCallback(() => {
    if (!cellData?.isEditing) {
      startEdit();
    }
  }, [cellData?.isEditing, startEdit]);

  const handleDoubleClick = useCallback(() => {
    if (!cellData?.isEditing) {
      startEdit();
    }
  }, [cellData?.isEditing, startEdit]);

  const handleFocus = useCallback(() => {
    if (!cellData?.isEditing) {
      startEdit();
    }
  }, [cellData?.isEditing, startEdit]);

  const handleBlur = useCallback(() => {
    if (cellData?.isEditing) {
      endEdit();
    }
  }, [cellData?.isEditing, endEdit]);

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = config.type === 'number' ? 
      (event.target.value === '' ? '' : Number(event.target.value)) : 
      event.target.value;
    updateValue(value);
  }, [updateValue, config.type]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (tableConfig.submitOnEnter) {
          submitRow(rowId);
        }
        navigateCell('down');
        break;
        
      case 'Tab':
        event.preventDefault();
        if (event.shiftKey) {
          navigateCell('shift-tab');
        } else {
          navigateCell('tab');
        }
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        navigateCell('up');
        break;
        
      case 'ArrowDown':
        event.preventDefault();
        navigateCell('down');
        break;
        
      case 'ArrowLeft':
        // Allow normal cursor movement within text input
        if (config.type === 'select' || (inputRef.current instanceof HTMLInputElement && inputRef.current.selectionStart === 0)) {
          event.preventDefault();
          navigateCell('left');
        }
        break;
        
      case 'ArrowRight':
        // Allow normal cursor movement within text input
        if (config.type === 'select' || (inputRef.current instanceof HTMLInputElement && inputRef.current.selectionEnd === inputRef.current.value.length)) {
          event.preventDefault();
          navigateCell('right');
        }
        break;
        
      case 'Escape':
        event.preventDefault();
        endEdit();
        // Could restore original value here if needed
        break;
        
      default:
        // Allow normal typing
        break;
    }
  }, [navigateCell, submitRow, rowId, endEdit, config.type, tableConfig.submitOnEnter]);

  // If cell data doesn't exist yet, return empty cell
  if (!cellData) {
    return (
      <td 
        className={`form-table-cell ${className}`}
        onClick={handleClick}
        tabIndex={tabIndex}
        onFocus={handleFocus}
      >
        <div className="cell-content">
          <span className="cell-value"></span>
        </div>
      </td>
    );
  }

  const cellClasses = [
    'form-table-cell',
    className,
    cellData.isEditing ? 'editing' : '',
    isActive ? 'active' : '',
    cellData.error ? 'error' : '',
    cellData.isDirty ? 'dirty' : ''
  ].filter(Boolean).join(' ');

  // Render different input types
  const renderInput = () => {
    const commonProps = {
      ref: inputRef as any,
      value: cellData.value || '',
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onBlur: handleBlur,
      className: 'cell-input'
    };

    switch (config.type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Selecione...</option>
            {config.options?.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            step="any"
          />
        );
        
      case 'email':
        return (
          <input
            {...commonProps}
            type="email"
          />
        );
        
      default:
        return (
          <input
            {...commonProps}
            type="text"
          />
        );
    }
  };

  return (
    <td
      className={cellClasses}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      tabIndex={tabIndex}
      onFocus={handleFocus}
      role="gridcell"
      aria-selected={isActive}
    >
      <div className="cell-content">
        {cellData.isEditing ? (
          renderInput()
        ) : (
          <span className="cell-value" title={cellData.value?.toString()}>
            {config.type === 'select' 
              ? config.options?.find(opt => opt.value === cellData.value)?.label || cellData.value
              : cellData.value?.toString() || ''}
          </span>
        )}
        
        {cellData.error && (
          <div className="cell-error" title={cellData.error}>
            <span className="error-icon">⚠</span>
            <span className="error-message">{cellData.error}</span>
          </div>
        )}
      </div>
    </td>
  );
};