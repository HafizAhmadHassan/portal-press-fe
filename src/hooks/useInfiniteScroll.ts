// hooks/useInfiniteDevices.ts - Aggiornato per supportare reload sui filtri
import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import type { Device } from '@store_admin/devices/devices.types';
import { useDevices } from '@store_admin/devices/hooks/useDevices.ts';

interface InfiniteDevicesParams {
  filters: Record<string, any>;
  sortBy?: string;
  sortOrder?: string;
  page: number;
  pageSize: number;
  setPage: (p: number) => void;
  key?: string; // 🔹 NUOVO: chiave per triggare reload
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
  page,
  pageSize,
  setPage,
  key, // 🔹 NUOVO parametro
}: InfiniteDevicesParams): InfiniteDevicesResult {
  const queryParams: any = {
    ...filters,
    sortBy,
    sortOrder,
    page,
    page_size: pageSize,
  };

  const { devices: pageDevices, isLoading, meta, refetch } = useDevices(queryParams);
  const [allDevices, setAllDevices] = useState<Device[]>([]);

  // 🔹 NUOVO: Tieni traccia della chiave precedente per detectare cambi
  const previousKeyRef = useRef<string>('');
  const previousFiltersRef = useRef<string>('');

  // 🔹 NUOVO: Reset quando cambiano i filtri
  useEffect(() => {
    const filtersKey = JSON.stringify(filters);
    const currentKey = key || filtersKey;

    // Se è cambiata la chiave o i filtri, resetta tutto
    if (currentKey !== previousKeyRef.current || filtersKey !== previousFiltersRef.current) {
      previousKeyRef.current = currentKey;
      previousFiltersRef.current = filtersKey;

      // Reset stato
      setAllDevices([]);
      if (page !== 1) {
        setPage(1); // Torna alla prima pagina
      }
    }
  }, [filters, key, page, setPage]);

  // Gestione accumulo devices per infinite scroll
  useEffect(() => {
    if (pageDevices && pageDevices.length > 0) {
      if (page === 1) {
        // Prima pagina: sostituisci tutto

        setAllDevices(pageDevices);
      } else {
        // Pagine successive: aggiungi senza duplicati

        setAllDevices((prev) => {
          // Evita duplicati controllando gli ID
          const existingIds = new Set(prev.map((d) => d.id));
          const newDevices = pageDevices.filter((d: Device) => !existingIds.has(d.id));
          return [...prev, ...newDevices];
        });
      }
    }
  }, [pageDevices, page]);

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false, // 🔹 Permetti multiple trigger
  });

  // Intersection observer per caricare pagina successiva
  useEffect(() => {
    if (inView && meta?.has_next && !isLoading) {
      setPage(meta.next_page!);
    }
  }, [inView, meta, setPage, isLoading]);

  // 🔹 MIGLIORATO: Reload completo
  const reload = useCallback(() => {
    setAllDevices([]); // Svuota lista
    setPage(1); // Torna alla prima pagina
    // Opzionale: forza refetch dopo un breve delay
    setTimeout(() => {
      refetch();
    }, 100);
  }, [setPage, refetch]);

  // 🔹 DEBUG: Log stato corrente

  return {
    devices: allDevices,
    isLoading,
    hasNext: !!meta?.has_next,
    reload,
    refetch,
    sentinelRef,
  };
}
