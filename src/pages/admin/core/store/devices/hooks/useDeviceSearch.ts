import { useState, useEffect } from "react";
import { useSearchDevicesQuery } from "@store_admin/devices/devices.api";

/**
 * Hook per ricerca dispositivi con debounce lato FE che interroga il filtro `search` del BE.
 * Effettua la query solo se la lunghezza del testo >= 2 (configurabile) oppure viene forzata.
 */
export const useDeviceSearch = (
  term: string,
  opts?: { minLength?: number; debounceMs?: number; page_size?: number }
) => {
  const { minLength = 2, debounceMs = 350, page_size = 10 } = opts || {};
  const [debounced, setDebounced] = useState(term);

  useEffect(() => {
    const h = setTimeout(() => setDebounced(term), debounceMs);
    return () => clearTimeout(h);
  }, [term, debounceMs]);

  const skip = debounced.trim().length < minLength;

  const {
    data: results = [],
    isFetching,
    isLoading,
    error,
  } = useSearchDevicesQuery({ query: debounced.trim(), page_size }, { skip });

  return {
    results,
    isLoading: isLoading || isFetching,
    error,
    active: !skip,
    raw: term,
  };
};
