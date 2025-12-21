import React from 'react';
import './index.css';
export { FormTable } from './components/FormTable';
export { EditableCell } from './components/EditableCell';
export { FormTableProvider, useFormTable, useFormTableCell } from './context/FormTableContext';
export * from './types';

// Re-export the main component as default
export { FormTable as default } from './components/FormTable';