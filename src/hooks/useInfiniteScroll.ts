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
  useEffect(() => {
    const currentKey = key ?? JSON.stringify(filters);
    console.log("🔑 Key change check:", {
      current: currentKey,
      prev: prevKeyRef.current,
    });

    if (currentKey !== prevKeyRef.current) {
      console.log("📊 Resetting infinite devices due to key change");
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

  console.log("🎯 Query params:", queryParams);

  const {
    devices: pageDevices,
    isLoading,
    meta,
    refetch,
  } = useDevices(queryParams);

  console.log("📦 Page devices received:", {
    pageDevices: pageDevices?.length || 0,
    page,
    isLoading,
    meta,
  });

  // append/sostituisci risultati
  useEffect(() => {
    console.log("🔄 Processing page devices:", {
      hasPageDevices: !!pageDevices,
      pageDevicesLength: pageDevices?.length || 0,
      page,
      requestKey: requestKeyRef.current,
    });

    const myReq = requestKeyRef.current;
    setAllDevices((prev) => {
      // drop risposte stale
      if (myReq !== requestKeyRef.current) {
        console.log("❌ Dropping stale response");
        return prev;
      }

      if (page === 1) {
        // evita reset inutile se i dati non sono cambiati
        if (
          prev.length === (pageDevices?.length || 0) &&
          prev.every((d, i) => d.id === pageDevices?.[i]?.id)
        ) {
          console.log("⏭️ No changes for page 1, skipping reset");
          return prev;
        }

        console.log(
          "🆕 Setting new devices for page 1:",
          pageDevices?.length || 0
        );
        justResetRef.current = false;
        return pageDevices || [];
      }

      // Per pagine > 1, appendi solo se ci sono nuovi device
      if (!pageDevices || pageDevices.length === 0) {
        console.log("⚠️ No page devices to append for page", page);
        return prev;
      }

      const existing = new Set(prev.map((d) => d.id));
      const newOnes = pageDevices.filter((d) => !existing.has(d.id));
      if (newOnes.length === 0) {
        console.log("⏭️ No new devices to append");
        return prev;
      }

      console.log(
        "➕ Appending",
        newOnes.length,
        "new devices to existing",
        prev.length
      );
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

  console.log("🔮 Has next:", hasNext, "Meta:", meta);

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
      console.log("🚫 Sentinel blocked by justReset");
      return;
    }
    if (!inView) return;
    if (isLoading) {
      console.log("⏳ Sentinel blocked by loading");
      return;
    }
    if (!hasNext) {
      console.log("🏁 No more pages available");
      return;
    }

    console.log("📈 Advancing to next page:", page + 1);
    setPage((p) => p + 1);
  }, [inView, isLoading, hasNext]);

  // Reload manuale (riparti da 1)
  const reload = useCallback(() => {
    console.log("🔄 Manual reload triggered");
    justResetRef.current = true;
    requestKeyRef.current += 1;
    setAllDevices([]);
    setPage(1);
    refetch();
  }, [refetch]);

  console.log("📊 Final state:", {
    devicesCount: allDevices.length,
    currentPage: page,
    isLoading,
    hasNext,
    justReset: justResetRef.current,
  });

  return {
    devices: allDevices,
    isLoading,
    hasNext,
    reload,
    refetch,
    sentinelRef,
  };
}
