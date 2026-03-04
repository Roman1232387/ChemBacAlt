import { useState, useCallback } from 'react';

type Setter<T> = (value: T | ((prev: T) => T)) => void;

/**
 * useLocalStorage — Custom hook that syncs state with localStorage.
 * Returns [value, setValue, removeValue].
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, Setter<T>, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue: Setter<T> = useCallback(
    (value) => {
      try {
        const next = value instanceof Function ? value(storedValue) : value;
        setStoredValue(next);
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        console.warn(`[useLocalStorage] Could not set key "${key}"`);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch {
      console.warn(`[useLocalStorage] Could not remove key "${key}"`);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
