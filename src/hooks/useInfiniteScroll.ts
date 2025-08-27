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
  /** Cambia quando cambia qualcosa di “scopante” (es. customer_Name o filtri) */
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

  // blocca l’auto-advance del sentinel finché non arriva la nuova page=1 dopo un reset
  const justResetRef = useRef<boolean>(true);
  // evita race e risposte stale
  const requestKeyRef = useRef<number>(0);

  // reset quando cambia la key/filtri “scopanti”
  const prevKeyRef = useRef<string>("");
  useEffect(() => {
    const currentKey = key ?? JSON.stringify(filters);
    if (currentKey !== prevKeyRef.current) {
      prevKeyRef.current = currentKey;
      justResetRef.current = true;
      requestKeyRef.current += 1;
      setAllDevices([]);
      setPage(1);
    }
  }, [key, filters]);

  // query params per la pagina corrente
  const queryParams: any = useMemo(
    () => ({
      ...filters,
      sortBy,
      sortOrder,
      page,
      page_size: pageSize,
    }),
    [filters, sortBy, sortOrder, page, pageSize]
  );

  const {
    devices: pageDevices,
    isLoading,
    meta,
    refetch,
  } = useDevices(queryParams);

  // append/sostituisci risultati
  useEffect(() => {
    if (!pageDevices) return;

    const myReq = requestKeyRef.current;
    setAllDevices((prev) => {
      // drop risposte stale
      if (myReq !== requestKeyRef.current) return prev;

      if (page === 1) {
        justResetRef.current = false; // sblocca sentinel quando la nuova page=1 è arrivata
        return pageDevices;
      }
      if (pageDevices.length === 0) return prev;

      const existing = new Set(prev.map((d) => d.id));
      const newOnes = pageDevices.filter((d) => !existing.has(d.id));
      return [...prev, ...newOnes];
    });
  }, [pageDevices, page]);

  // calcolo hasNext robusto: usa meta.has_next se presente, altrimenti fallback su pageSize
  const hasNext = Boolean(
    (meta && (meta as any).has_next) ??
      (pageDevices && pageDevices.length === pageSize)
  );

  // IntersectionObserver (view-port o rootRef custom)
  const { ref: sentinelRef, inView } = useInView({
    threshold: 0.1,
    root: rootRef?.current ?? null,
    // piccolo prefetch
    rootMargin: "200px",
    triggerOnce: false,
  });

  // Avanza SOLO di +1 (ignora meta.next_page che può essere “sporcato” da altre viste)
  useEffect(() => {
    if (justResetRef.current) return;
    if (!inView) return;
    if (isLoading) return;
    if (!hasNext) return;

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
