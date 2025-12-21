import React, { createContext, useContext, useCallback, useReducer, useMemo, useRef } from 'react';
import * as yup from 'yup';
import { 
  TableData, 
  FormTableConfig, 
  FormTableContextType, 
  CellData, 
  RowData 
} from '../types';

// Action types
type FormTableAction =
  | { type: 'SET_CELL_VALUE'; payload: { rowId: string; cellKey: string; value: any } }
  | { type: 'SET_CELL_ERROR'; payload: { rowId: string; cellKey: string; error?: string } }
  | { type: 'SET_CELL_EDITING'; payload: { rowId: string; cellKey: string; isEditing: boolean } }
  | { type: 'SET_ACTIVE_CELL'; payload: { rowId: string; cellKey: string } | null }
  | { type: 'ADD_ROW'; payload: { rowId: string } }
  | { type: 'DELETE_ROW'; payload: { rowId: string } }
  | { type: 'RESET_ROW'; payload: { rowId: string } }
  | { type: 'INITIALIZE_DATA'; payload: { data: TableData } };

// State interface
interface FormTableState {
  data: TableData;
  activeCell: { rowId: string; cellKey: string } | null;
}

// Reducer
const formTableReducer = (state: FormTableState, action: FormTableAction): FormTableState => {
  switch (action.type) {
    case 'SET_CELL_VALUE':
      const { rowId, cellKey, value } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          [rowId]: {
            ...state.data[rowId],
            [cellKey]: {
              ...state.data[rowId]?.[cellKey],
              value,
              isDirty: true,
              error: undefined
            }
          }
        }
      };

    case 'SET_CELL_ERROR':
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.rowId]: {
            ...state.data[action.payload.rowId],
            [action.payload.cellKey]: {
              ...state.data[action.payload.rowId]?.[action.payload.cellKey],
              error: action.payload.error
            }
          }
        }
      };

    case 'SET_CELL_EDITING':
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.rowId]: {
            ...state.data[action.payload.rowId],
            [action.payload.cellKey]: {
              ...state.data[action.payload.rowId]?.[action.payload.cellKey],
              isEditing: action.payload.isEditing
            }
          }
        }
      };

    case 'SET_ACTIVE_CELL':
      return {
        ...state,
        activeCell: action.payload
      };

    case 'ADD_ROW':
      const newRowData: RowData = {};
      // Initialize cells for new row
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.rowId]: newRowData
        }
      };

    case 'DELETE_ROW':
      const { [action.payload.rowId]: deletedRow, ...restData } = state.data;
      return {
        ...state,
        data: restData,
        activeCell: state.activeCell?.rowId === action.payload.rowId ? null : state.activeCell
      };

    case 'RESET_ROW':
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.rowId]: Object.keys(state.data[action.payload.rowId] || {}).reduce((acc, cellKey) => {
            acc[cellKey] = {
              value: '',
              isEditing: false,
              isDirty: false,
              error: undefined
            };
            return acc;
          }, {} as RowData)
        }
      };

    case 'INITIALIZE_DATA':
      return {
        ...state,
        data: action.payload.data
      };

    default:
      return state;
  }
};

// Context
const FormTableContext = createContext<FormTableContextType | null>(null);

// Provider component
interface FormTableProviderProps {
  children: React.ReactNode;
  config: FormTableConfig;
  initialData?: Record<string, Record<string, any>>;
  onRowSubmit?: (rowId: string, data: Record<string, any>) => void;
  onDataChange?: (data: Record<string, Record<string, any>>) => void;
}

export const FormTableProvider: React.FC<FormTableProviderProps> = ({
  children,
  config,
  initialData = {},
  onRowSubmit,
  onDataChange
}) => {
  // Initialize state
  const initialState: FormTableState = {
    data: {},
    activeCell: null
  };

  const [state, dispatch] = useReducer(formTableReducer, initialState);
  
  // Refs para evitar loops de dependência
  const initializedRef = useRef(false);
  const onDataChangeRef = useRef(onDataChange);
  onDataChangeRef.current = onDataChange;

  // Initialize data from props - apenas uma vez no mount
  React.useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    
    const tableData: TableData = {};
    
    // Convert initial data to internal format
    Object.entries(initialData).forEach(([rowId, rowData]: [string, any]) => {
      tableData[rowId] = {};
      config.columns.forEach(col => {
        tableData[rowId][col.key] = {
          value: rowData[col.key] || '',
          isEditing: false,
          isDirty: false,
          error: undefined
        };
      });
    });

    // Add initial empty rows if specified
    if (config.initialRows && Object.keys(tableData).length === 0) {
      for (let i = 0; i < config.initialRows; i++) {
        const rowId = `row-${i}`;
        tableData[rowId] = {};
        config.columns.forEach(col => {
          tableData[rowId][col.key] = {
            value: '',
            isEditing: false,
            isDirty: false,
            error: undefined
          };
        });
      }
    }

    dispatch({ type: 'INITIALIZE_DATA', payload: { data: tableData } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Notificar mudanças de dados para o parent (usando ref para evitar loop)
  const prevDataRef = useRef<string>('');
  React.useEffect(() => {
    // Só notifica se há dados e se realmente mudou
    if (Object.keys(state.data).length === 0) return;
    
    const currentDataJson = JSON.stringify(state.data);
    if (currentDataJson === prevDataRef.current) return;
    
    prevDataRef.current = currentDataJson;
    
    if (onDataChangeRef.current) {
      // Extrair valores limpos
      const cleanData: Record<string, Record<string, any>> = {};
      Object.keys(state.data).forEach(rowId => {
        cleanData[rowId] = {};
        Object.entries(state.data[rowId] || {}).forEach(([cellKey, cellData]: [string, any]) => {
          cleanData[rowId][cellKey] = cellData?.value;
        });
      });
      onDataChangeRef.current(cleanData);
    }
  }, [state.data]);

  // Actions
  const updateCellValue = useCallback((rowId: string, cellKey: string, value: any) => {
    dispatch({ type: 'SET_CELL_VALUE', payload: { rowId, cellKey, value } });
    
    // Auto-validate if configured
    if (config.validateOnChange) {
      setTimeout(() => validateCell(rowId, cellKey), 0);
    }
  }, [config.validateOnChange]);

  const validateCell = useCallback(async (rowId: string, cellKey: string): Promise<boolean> => {
    const cellConfig = config.columns.find(col => col.key === cellKey);
    const cellData = state.data[rowId]?.[cellKey];
    
    if (!cellConfig || !cellData) return true;

    try {
      let schema = cellConfig.validation;
      
      // Create default schema if none provided
      if (!schema) {
        switch (cellConfig.type) {
          case 'email':
            schema = yup.string().email('Email inválido');
            break;
          case 'number':
            schema = yup.number().typeError('Deve ser um número');
            break;
          default:
            schema = yup.string();
        }
        
        if (cellConfig.required) {
          schema = schema.required('Campo obrigatório');
        }
      }

      await schema.validate(cellData.value);
      dispatch({ type: 'SET_CELL_ERROR', payload: { rowId, cellKey, error: undefined } });
      return true;
    } catch (error) {
      const message = error instanceof yup.ValidationError ? error.message : 'Erro de validação';
      dispatch({ type: 'SET_CELL_ERROR', payload: { rowId, cellKey, error: message } });
      return false;
    }
  }, [config.columns, state.data]);

  const validateRow = useCallback(async (rowId: string): Promise<boolean> => {
    const promises = config.columns.map(col => validateCell(rowId, col.key));
    const results = await Promise.all(promises);
    return results.every(result => result);
  }, [config.columns, validateCell]);

  const validateAll = useCallback(async (): Promise<boolean> => {
    const rowIds = Object.keys(state.data);
    const promises = rowIds.map(rowId => validateRow(rowId));
    const results = await Promise.all(promises);
    return results.every(result => result);
  }, [state.data, validateRow]);

  const setActiveCell = useCallback((rowId: string, cellKey: string) => {
    dispatch({ type: 'SET_ACTIVE_CELL', payload: { rowId, cellKey } });
  }, []);

  const clearActiveCell = useCallback(() => {
    dispatch({ type: 'SET_ACTIVE_CELL', payload: null });
  }, []);

  const addRow = useCallback((rowId?: string) => {
    const newRowId = rowId || `row-${Date.now()}`;
    dispatch({ type: 'ADD_ROW', payload: { rowId: newRowId } });
    
    // Initialize cells
    config.columns.forEach(col => {
      dispatch({ 
        type: 'SET_CELL_VALUE', 
        payload: { rowId: newRowId, cellKey: col.key, value: '' } 
      });
    });
  }, [config.columns]);

  const deleteRow = useCallback((rowId: string) => {
    dispatch({ type: 'DELETE_ROW', payload: { rowId } });
  }, []);

  const startCellEdit = useCallback((rowId: string, cellKey: string) => {
    dispatch({ type: 'SET_CELL_EDITING', payload: { rowId, cellKey, isEditing: true } });
    setActiveCell(rowId, cellKey);
  }, [setActiveCell]);

  const endCellEdit = useCallback((rowId: string, cellKey: string) => {
    dispatch({ type: 'SET_CELL_EDITING', payload: { rowId, cellKey, isEditing: false } });
    
    // Validate on blur if configured
    if (config.validateOnBlur) {
      validateCell(rowId, cellKey);
    }
  }, [config.validateOnBlur, validateCell]);

  const navigateCell = useCallback((direction: 'up' | 'down' | 'left' | 'right' | 'tab' | 'shift-tab') => {
    if (!state.activeCell) return;

    const { rowId, cellKey } = state.activeCell;
    const rowIds = Object.keys(state.data);
    const columnKeys = config.columns.map(col => col.key);
    
    const currentRowIndex = rowIds.indexOf(rowId);
    const currentColIndex = columnKeys.indexOf(cellKey);
    
    let newRowIndex = currentRowIndex;
    let newColIndex = currentColIndex;

    switch (direction) {
      case 'up':
        newRowIndex = Math.max(0, currentRowIndex - 1);
        break;
      case 'down':
        newRowIndex = Math.min(rowIds.length - 1, currentRowIndex + 1);
        break;
      case 'left':
        newColIndex = Math.max(0, currentColIndex - 1);
        break;
      case 'right':
      case 'tab':
        newColIndex = currentColIndex + 1;
        if (newColIndex >= columnKeys.length) {
          newColIndex = 0;
          newRowIndex = Math.min(rowIds.length - 1, currentRowIndex + 1);
        }
        break;
      case 'shift-tab':
        newColIndex = currentColIndex - 1;
        if (newColIndex < 0) {
          newColIndex = columnKeys.length - 1;
          newRowIndex = Math.max(0, currentRowIndex - 1);
        }
        break;
    }

    if (newRowIndex < rowIds.length && newColIndex < columnKeys.length) {
      const newRowId = rowIds[newRowIndex];
      const newCellKey = columnKeys[newColIndex];
      setActiveCell(newRowId, newCellKey);
    }
  }, [state.activeCell, state.data, config.columns, setActiveCell]);

  const submitRow = useCallback(async (rowId: string) => {
    const isValid = await validateRow(rowId);
    if (isValid && onRowSubmit) {
      const rowData = getRowData(rowId);
      onRowSubmit(rowId, rowData);
    }
  }, [validateRow, onRowSubmit]);

  const resetRow = useCallback((rowId: string) => {
    dispatch({ type: 'RESET_ROW', payload: { rowId } });
  }, []);

  const getRowData = useCallback((rowId: string): Record<string, any> => {
    const rowData = state.data[rowId] || {};
    const result: Record<string, any> = {};
    
    Object.entries(rowData).forEach(([cellKey, cellData]: [string, any]) => {
      result[cellKey] = cellData.value;
    });
    
    return result;
  }, [state.data]);

  const getAllData = useCallback((): Record<string, Record<string, any>> => {
    const result: Record<string, Record<string, any>> = {};
    
    Object.keys(state.data).forEach(rowId => {
      result[rowId] = getRowData(rowId);
    });
    
    return result;
  }, [state.data, getRowData]);

  const contextValue = useMemo((): FormTableContextType => ({
    data: state.data,
    config,
    activeCell: state.activeCell,
    updateCellValue,
    validateCell,
    validateRow,
    validateAll,
    setActiveCell,
    clearActiveCell,
    addRow,
    deleteRow,
    startCellEdit,
    endCellEdit,
    navigateCell,
    submitRow,
    resetRow,
    getRowData,
    getAllData
  }), [
    state.data,
    state.activeCell,
    config,
    updateCellValue,
    validateCell,
    validateRow,
    validateAll,
    setActiveCell,
    clearActiveCell,
    addRow,
    deleteRow,
    startCellEdit,
    endCellEdit,
    navigateCell,
    submitRow,
    resetRow,
    getRowData,
    getAllData
  ]);

  return (
    <FormTableContext.Provider value={contextValue}>
      {children}
    </FormTableContext.Provider>
  );
};

// Hook to use the context
export const useFormTable = (): FormTableContextType => {
  const context = useContext(FormTableContext);
  if (!context) {
    throw new Error('useFormTable must be used within a FormTableProvider');
  }
  return context;
};

// Hook to use specific cell data (optimized to avoid unnecessary re-renders)
export const useFormTableCell = (rowId: string, cellKey: string) => {
  const context = useContext(FormTableContext);
  if (!context) {
    throw new Error('useFormTableCell must be used within a FormTableProvider');
  }

  return useMemo(() => ({
    cellData: context.data[rowId]?.[cellKey],
    isActive: context.activeCell?.rowId === rowId && context.activeCell?.cellKey === cellKey,
    updateValue: (value: any) => context.updateCellValue(rowId, cellKey, value),
    startEdit: () => context.startCellEdit(rowId, cellKey),
    endEdit: () => context.endCellEdit(rowId, cellKey),
    validate: () => context.validateCell(rowId, cellKey)
  }), [
    context.data[rowId]?.[cellKey],
    context.activeCell,
    context.updateCellValue,
    context.startCellEdit,
    context.endCellEdit,
    context.validateCell,
    rowId,
    cellKey
  ]);
};