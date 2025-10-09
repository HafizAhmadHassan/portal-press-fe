import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import type { Device } from "@store_admin/devices/devices.types";
import { useDevices } from "@store_admin/devices/hooks/useDevices.ts";

type RootRef = React.RefObject<Element> | null;

interface InfiniteDevicesParams {
  filters: Record<string, any>;
  sortBy?: string;
  sortOrder?: string;
  pageSize: number;
  /** Cambia quando cambia qualcosa di "scopante" (es. customer_Name o filtri) */
  key?: string;
  /** (opzionale) scroll container diverso dalla finestra */
  rootRef?: RootRef;
}

interface InfiniteDevicesResult {
  devices: Device[];
  isLoading: boolean;
  hasNext: boolean;
  reload: () => void;
  refetch: () => void;
  sentinelRef: (node?: Element | null) => void;
}

export function useInfiniteDevices({
  filters,
  sortBy,
  sortOrder,
  pageSize,
  key,
  rootRef = null,
}: InfiniteDevicesParams): InfiniteDevicesResult {
  // Pagina interna, separata da quella della tabella
  const [page, setPage] = useState<number>(1);
  const [allDevices, setAllDevices] = useState<Device[]>([]);

  // blocca l'auto-advance del sentinel finché non arriva la nuova page=1 dopo un reset
  const justResetRef = useRef<boolean>(true);
  // evita race e risposte stale
  const requestKeyRef = useRef<number>(0);

  // reset quando cambia la key/filtri "scopanti"
  const prevKeyRef = useRef<string>("");
  // Memoize filters to ensure stability
  const stringifiedFilters = useMemo(() => JSON.stringify(filters), [filters]);
  const memoizedFilters = useMemo(() => filters, [stringifiedFilters]);

  useEffect(() => {
    const currentKey = key ?? stringifiedFilters;

    if (currentKey !== prevKeyRef.current) {
      prevKeyRef.current = currentKey;
      justResetRef.current = true;
      requestKeyRef.current += 1;
      setAllDevices([]);
      setPage(1);
    }
  }, [key, stringifiedFilters]);

  // query params per la pagina corrente
  const queryParams: Partial<any> = useMemo(
    () => ({
      ...memoizedFilters,
      sortBy,
      sortOrder,
      page,
      page_size: pageSize,
    }),
    [memoizedFilters, sortBy, sortOrder, page, pageSize]
  );

  const {
    devices: pageDevices,
    isLoading,
    meta,
    refetch,
  } = useDevices(queryParams);

  // append/sostituisci risultati
  useEffect(() => {
    const myReq = requestKeyRef.current;
    setAllDevices((prev) => {
      // drop risposte stale
      if (myReq !== requestKeyRef.current) {
        return prev;
      }

      if (page === 1) {
        // evita reset inutile se i dati non sono cambiati
        if (
          prev.length === (pageDevices?.length || 0) &&
          prev.every((d, i) => d.id === pageDevices?.[i]?.id)
        ) {
          return prev;
        }

        justResetRef.current = false;
        return pageDevices || [];
      }

      // Per pagine > 1, appendi solo se ci sono nuovi device
      if (!pageDevices || pageDevices.length === 0) {
        return prev;
      }

      const existing = new Set(prev.map((d) => d.id));
      const newOnes = pageDevices.filter((d) => !existing.has(d.id));
      if (newOnes.length === 0) {
        return prev;
      }

      return [...prev, ...newOnes];
    });
  }, [pageDevices, page]);

  // calcolo hasNext robusto
  const hasNext = useMemo(() => {
    if (meta && typeof (meta as any).has_next !== "undefined") {
      return Boolean((meta as any).has_next);
    }
    if (meta && (meta as any).total_pages) {
      return page < (meta as any).total_pages;
    }
    return Boolean(pageDevices && pageDevices.length === pageSize);
  }, [meta, page, pageDevices, pageSize]);

  // IntersectionObserver (view-port o rootRef custom)
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0.1,
    root: rootRef?.current ?? null,
    rootMargin: "200px",
    triggerOnce: false,
  });

  // Avanza SOLO di +1
  useEffect(() => {
    if (justResetRef.current) {
      return;
    }
    if (!inView) return;
    if (isLoading) {
      return;
    }
    if (!hasNext) {
      return;
    }

    setPage((p) => p + 1);
  }, [inView, isLoading, hasNext]);

  // Reload manuale (riparti da 1)
  const reload = useCallback(() => {
    justResetRef.current = true;
    requestKeyRef.current += 1;
    setAllDevices([]);
    setPage(1);
    refetch();
  }, [refetch]);

  return {
    devices: allDevices,
    isLoading,
    hasNext,
    reload,
    refetch,
    sentinelRef,
  };
}
