/**
 * Generic utility functions for your component
 */

export function formatString(str: string): string {
  return str.trim().toLowerCase();
}

export function isValidElement(element: any): boolean {
  return element != null && typeof element === 'object';
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait) as any;
  };
}