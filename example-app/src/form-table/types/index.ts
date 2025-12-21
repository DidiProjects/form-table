export interface CellData {
  value: any;
  error?: string;
  isEditing: boolean;
  isDirty: boolean;
}

export interface RowData {
  [cellKey: string]: CellData;
}

export interface TableData {
  [rowId: string]: RowData;
}

export interface CellConfig {
  key: string;
  type: 'text' | 'number' | 'email' | 'select';
  label?: string;
  required?: boolean;
  options?: { value: any; label: string }[];
  validation?: any; // Yup schema
}

export interface FormTableConfig {
  columns: CellConfig[];
  initialRows?: number;
  allowAddRows?: boolean;
  allowDeleteRows?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  submitOnEnter?: boolean;
}

export interface FormTableContextType {
  data: TableData;
  config: FormTableConfig;
  activeCell: { rowId: string; cellKey: string } | null;
  
  // Actions
  updateCellValue: (rowId: string, cellKey: string, value: any) => void;
  validateCell: (rowId: string, cellKey: string) => Promise<boolean>;
  validateRow: (rowId: string) => Promise<boolean>;
  validateAll: () => Promise<boolean>;
  setActiveCell: (rowId: string, cellKey: string) => void;
  clearActiveCell: () => void;
  addRow: (rowId?: string) => void;
  deleteRow: (rowId: string) => void;
  startCellEdit: (rowId: string, cellKey: string) => void;
  endCellEdit: (rowId: string, cellKey: string) => void;
  navigateCell: (direction: 'up' | 'down' | 'left' | 'right' | 'tab' | 'shift-tab') => void;
  submitRow: (rowId: string) => Promise<void>;
  resetRow: (rowId: string) => void;
  getRowData: (rowId: string) => Record<string, any>;
  getAllData: () => Record<string, Record<string, any>>;
}

export interface EditableCellProps {
  rowId: string;
  cellKey: string;
  config: CellConfig;
  className?: string;
  tabIndex?: number;
}

export interface FormTableProps {
  config: FormTableConfig;
  initialData?: Record<string, Record<string, any>>;
  onRowSubmit?: (rowId: string, data: Record<string, any>) => void;
  onDataChange?: (data: Record<string, Record<string, any>>) => void;
  className?: string;
}