import React from 'react';
import { FormTableProvider, useFormTable } from '../context/FormTableContext';
import { EditableCell } from './EditableCell';
import { FormTableProps } from '../types';

const FormTableInner: React.FC<Omit<FormTableProps, 'config' | 'initialData'>> = ({ 
  className = '' 
}) => {
  const { 
    data, 
    config, 
    addRow, 
    deleteRow, 
    validateAll, 
    getAllData,
    resetRow 
  } = useFormTable();

  const rowIds = Object.keys(data);

  const handleAddRow = () => {
    if (config.allowAddRows !== false) {
      addRow();
    }
  };

  const handleDeleteRow = (rowId: string) => {
    if (config.allowDeleteRows !== false) {
      deleteRow(rowId);
    }
  };

  const handleValidateAll = async () => {
    const isValid = await validateAll();
    console.log('Validação completa:', isValid ? 'Sucesso' : 'Erro');
    return isValid;
  };

  const handleGetAllData = () => {
    const allData = getAllData();
    console.log('Dados completos:', allData);
    return allData;
  };

  const handleResetRow = (rowId: string) => {
    resetRow(rowId);
  };

  const tableClasses = [
    'form-table',
    className,
    'table-responsive'
  ].filter(Boolean).join(' ');

  return (
    <div className={tableClasses}>
      {/* Table Controls */}
      <div className="form-table-controls">
        {config.allowAddRows !== false && (
          <button 
            type="button" 
            className="btn btn-add-row" 
            onClick={handleAddRow}
            title="Adicionar linha"
          >
            + Adicionar Linha
          </button>
        )}
        
        <div className="table-actions">
          <button 
            type="button" 
            className="btn btn-validate" 
            onClick={handleValidateAll}
            title="Validar todos os dados"
          >
            Validar Tudo
          </button>
          
          <button 
            type="button" 
            className="btn btn-export" 
            onClick={handleGetAllData}
            title="Exportar dados (console)"
          >
            Ver Dados
          </button>
        </div>
      </div>

      {/* Main Table */}
      <table className="table" role="grid">
        <thead>
          <tr role="row">
            {config.columns.map((column) => (
              <th 
                key={column.key} 
                className="form-table-header"
                role="columnheader"
              >
                <div className="header-content">
                  <span className="header-label">
                    {column.label || column.key}
                  </span>
                  {column.required && (
                    <span className="required-indicator" title="Campo obrigatório">
                      *
                    </span>
                  )}
                </div>
              </th>
            ))}
            
            {config.allowDeleteRows !== false && (
              <th className="form-table-header actions-header" role="columnheader">
                Ações
              </th>
            )}
          </tr>
        </thead>
        
        <tbody>
          {rowIds.length === 0 ? (
            <tr>
              <td 
                colSpan={config.columns.length + (config.allowDeleteRows !== false ? 1 : 0)}
                className="empty-table"
              >
                Nenhum dado disponível. 
                {config.allowAddRows !== false && (
                  <button 
                    type="button" 
                    className="btn btn-link" 
                    onClick={handleAddRow}
                  >
                    Clique aqui para adicionar uma linha
                  </button>
                )}
              </td>
            </tr>
          ) : (
            rowIds.map((rowId, rowIndex) => (
              <tr key={rowId} className="form-table-row" role="row">
                {config.columns.map((column) => (
                  <EditableCell
                    key={`${rowId}-${column.key}`}
                    rowId={rowId}
                    cellKey={column.key}
                    config={column}
                    tabIndex={0}
                  />
                ))}
                
                {config.allowDeleteRows !== false && (
                  <td className="actions-cell" role="gridcell">
                    <div className="cell-actions">
                      <button
                        type="button"
                        className="btn btn-reset"
                        onClick={() => handleResetRow(rowId)}
                        title="Resetar linha"
                      >
                        ↺
                      </button>
                      
                      <button
                        type="button"
                        className="btn btn-delete"
                        onClick={() => handleDeleteRow(rowId)}
                        title="Deletar linha"
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Table Footer */}
      <div className="form-table-footer">
        <div className="footer-info">
          <span className="row-count">
            {rowIds.length} linha{rowIds.length !== 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="footer-legend">
          <div className="legend-item">
            <span className="legend-symbol dirty">●</span>
            <span className="legend-text">Modificado</span>
          </div>
          <div className="legend-item">
            <span className="legend-symbol error">⚠</span>
            <span className="legend-text">Erro de validação</span>
          </div>
          <div className="legend-item">
            <span className="legend-symbol required">*</span>
            <span className="legend-text">Campo obrigatório</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FormTable: React.FC<FormTableProps> = (props) => {
  return (
    <FormTableProvider 
      config={props.config}
      initialData={props.initialData}
      onRowSubmit={props.onRowSubmit}
      onDataChange={props.onDataChange}
    >
      <FormTableInner className={props.className} />
    </FormTableProvider>
  );
};