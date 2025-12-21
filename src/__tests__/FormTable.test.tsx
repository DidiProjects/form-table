import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FormTable from '../index';
import { FormTableConfig } from '../types';
import * as yup from 'yup';

const mockConfig: FormTableConfig = {
  columns: [
    {
      key: 'nome',
      type: 'text',
      label: 'Nome',
      required: true,
      validation: yup.string().required('Name is required')
    },
    {
      key: 'email',
      type: 'email',
      label: 'E-mail',
      validation: yup.string().email('E-mail inválido')
    }
  ],
  initialRows: 2,
  validateOnBlur: true
};

describe('FormTable', () => {
  it('should render table with correct columns', () => {
    render(<FormTable config={mockConfig} />);
    
    expect(screen.getByText('Nome')).toBeInTheDocument();
    expect(screen.getByText('E-mail')).toBeInTheDocument();
  });

  it('should render initial rows', () => {
    render(<FormTable config={mockConfig} />);
    
    // Should have 2 rows + header
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3); // header + 2 data rows
  });

  it('should show add row button when allowed', () => {
    const config = { ...mockConfig, allowAddRows: true };
    render(<FormTable config={config} />);
    
    expect(screen.getByText('+ Adicionar Linha')).toBeInTheDocument();
  });

  it('should call onDataChange when data changes', () => {
    const onDataChange = vi.fn();
    render(<FormTable config={mockConfig} onDataChange={onDataChange} />);
    
    expect(onDataChange).toHaveBeenCalled();
  });

  it('should render required indicator for required fields', () => {
    render(<FormTable config={mockConfig} />);
    
    // Nome is required, should show *
    const requiredIndicators = screen.getAllByText('*');
    expect(requiredIndicators.length).toBeGreaterThan(0);
  });
});