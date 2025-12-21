import { describe, it, expect, vi } from 'vitest';
import { formatString, isValidElement, generateId, debounce } from '../helpers';

describe('helpers', () => {
  describe('formatString', () => {
    it('deve remover espaços e converter para minúsculo', () => {
      expect(formatString('  Teste STRING  ')).toBe('teste string');
    });

    it('deve lidar com strings vazias', () => {
      expect(formatString('')).toBe('');
    });
  });

  describe('isValidElement', () => {
    it('deve retornar true para objetos válidos', () => {
      expect(isValidElement({ prop: 'value' })).toBe(true);
    });

    it('deve retornar false para null', () => {
      expect(isValidElement(null)).toBe(false);
    });

    it('deve retornar false para undefined', () => {
      expect(isValidElement(undefined)).toBe(false);
    });

    it('deve retornar false para strings', () => {
      expect(isValidElement('string')).toBe(false);
    });
  });

  describe('generateId', () => {
    it('deve gerar um ID único', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1.length).toBeGreaterThan(0);
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should delay function execution', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      expect(mockFn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('deve cancelar execuções anteriores', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });
});