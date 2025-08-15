import { useEffect, useState } from 'react';

/**
 * Hook personalizzato per il debounce
 * @param value - Il valore da debounce
 * @param delay - Il delay in millisecondi
 * @returns Array con [debouncedValue]
 */
export function useDebounce<T>(value: T, delay: number): [T] {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue];
}

/**
 * Hook alternativo che restituisce solo il valore (per compatibilità con use-debounce)
 */
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue] = useDebounce(value, delay);
  return debouncedValue;
}

/**
 * Hook per debounce di callback
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(callback);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);

  return debouncedCallback;
}