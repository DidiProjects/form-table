import React from 'react';
export { FormTable } from './components/FormTable';
export { EditableCell } from './components/EditableCell';
export { FormTableProvider, useFormTable, } from './context/FormTableContext';
export * from './types';
import './index.css';

// Re-export the main component as default
export { FormTable as default } from './components/FormTable';