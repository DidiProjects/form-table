import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import YourComponent from '../index';

describe('YourComponent', () => {
  describe('Funcionalidade Básica', () => {
    it('should render children correctly', () => {
      render(
        <YourComponent>
          <p>Conteúdo de teste</p>
        </YourComponent>
      );
      
      expect(screen.getByText('Conteúdo de teste')).toBeInTheDocument();
    });

    it('should display title when provided', () => {
      render(
        <YourComponent title="Título de Teste">
          <p>Conteúdo</p>
        </YourComponent>
      );
      
      expect(screen.getByText('Título de Teste')).toBeInTheDocument();
      expect(screen.getByText('Título de Teste').tagName).toBe('H2');
    });

    it('should apply default className', () => {
      render(
        <YourComponent>
          <p>Conteúdo</p>
        </YourComponent>
      );
      
      const container = screen.getByText('Conteúdo').parentElement;
      expect(container).toHaveClass('your-component-container');
    });

    it('deve chamar onClick quando clicado', () => {
      const mockClick = vi.fn();
      
      render(
        <YourComponent onClick={mockClick}>
          <p>Clique em mim</p>
        </YourComponent>
      );
      
      const container = screen.getByText('Clique em mim').parentElement;
      fireEvent.click(container!);
      
      expect(mockClick).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onClick quando desabilitado', () => {
      const mockClick = vi.fn();
      
      render(
        <YourComponent onClick={mockClick} disabled={true}>
          <p>Clique em mim</p>
        </YourComponent>
      );
      
      const container = screen.getByText('Clique em mim').parentElement;
      fireEvent.click(container!);
      
      expect(mockClick).not.toHaveBeenCalled();
    });
  });

  describe('Estado Desabilitado', () => {
    it('deve aplicar classe disabled quando desabilitado', () => {
      render(
        <YourComponent disabled={true}>
          <p>Conteúdo</p>
        </YourComponent>
      );
      
      const container = screen.getByText('Conteúdo').parentElement;
      expect(container).toHaveClass('disabled');
    });
  });

  describe('Customização', () => {
    it('deve aplicar className customizada', () => {
      render(
        <YourComponent className="minha-classe-custom">
          <p>Conteúdo</p>
        </YourComponent>
      );
      
      const container = screen.getByText('Conteúdo').parentElement;
      expect(container).toHaveClass('minha-classe-custom');
    });
  });
});