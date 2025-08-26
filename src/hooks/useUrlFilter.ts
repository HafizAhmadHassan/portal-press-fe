// @root/filters/useUrlFilters.ts
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/**
 * Hook generico per gestire i filtri pagina via URL.
 * Passa la lista di chiavi consentite per quella pagina.
 */
export function useUrlFilters<T extends Record<string, any>>(
  allowedKeys: Array<keyof T>
) {
  const [params, setParams] = useSearchParams();

  const filters = useMemo(() => {
    const out = {} as T;
    allowedKeys.forEach((k) => {
      const v = params.get(String(k));
      if (v !== null) (out as any)[k] = v;
    });
    return out;
  }, [params, allowedKeys]);

  const setFilter = (key: keyof T, value?: string | null) => {
    const p = new URLSearchParams(params);
    const ks = String(key);
    if (value === undefined || value === null || value === "") p.delete(ks);
    else p.set(ks, String(value));
    setParams(p, { replace: true });
  };

  const resetFilters = () => {
    const p = new URLSearchParams(params);
    allowedKeys.forEach((k) => p.delete(String(k)));
    setParams(p, { replace: true });
  };

  return { filters, setFilter, resetFilters };
}
