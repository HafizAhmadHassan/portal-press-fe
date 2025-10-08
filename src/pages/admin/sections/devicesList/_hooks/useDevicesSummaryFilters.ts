import { useCallback, useMemo, useRef, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "@root/pages/admin/core/store/store.hooks";
import {
  setStatusFilter,
  setBlockedFilter,
  setReadyFilter,
  resetFilters,
} from "@store_admin/devices/devices.slice";
import {
  loadDevices,
  loadAllDevices,
} from "@store_admin/devices/devices.thunks";
import type { Device } from "@store_admin/devices/devices.types";

/**
 * Hook personalizzato per gestire i filtri summary (active/inactive/blocked/ready)
 * Include la gestione della baseline e del totale fisso
 */
export function useDevicesSummaryFilters(summaryDevices: Device[] | null) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.devices.filters);

  // Baseline counts (non filtrati) catturati al primo click su un filtro summary
  const baselineCountsRef = useRef<{
    active: number;
    inactive: number;
    blocked: number;
    ready: number;
  } | null>(null);

  // Totale baseline fisso: viene fissato quando non c'è filtro summary attivo
  const baselineTotalRef = useRef<number | null>(null);

  // Deriva quale filtro è attivo per evidenziare la card
  const activeSummaryFilter = useMemo<
    "active" | "inactive" | "blocked" | "ready" | null
  >(() => {
    if (filters.status === 1) return "active";
    if (filters.status === 0) return "inactive";
    if (filters.status_Machine_Blocked === true) return "blocked";
    if (filters.status_READY_D75_3_7 === true) return "ready";
    return null;
  }, [
    filters.status,
    filters.status_Machine_Blocked,
    filters.status_READY_D75_3_7,
  ]);

  // Memorizza il totale baseline quando non c'è filtro attivo
  useEffect(() => {
    if (activeSummaryFilter === null && summaryDevices) {
      baselineTotalRef.current = summaryDevices.length;
    }
  }, [activeSummaryFilter, summaryDevices]);

  const handleSummaryFilter = useCallback(
    (key: "active" | "inactive" | "blocked" | "ready") => {
      const isSame =
        (key === "active" && filters.status === 1) ||
        (key === "inactive" && filters.status === 0) ||
        (key === "blocked" && filters.status_Machine_Blocked === true) ||
        (key === "ready" && filters.status_READY_D75_3_7 === true);

      if (isSame) {
        // toggle off
        dispatch(setStatusFilter(null));
        dispatch(setBlockedFilter(null));
        dispatch(setReadyFilter(null));
        baselineCountsRef.current = null; // reset baseline
      } else {
        // se non ho baseline la catturo ora
        if (!baselineCountsRef.current) {
          const list = summaryDevices || [];
          baselineCountsRef.current = {
            active: list.filter((d) => d.status === 1).length,
            inactive: list.filter((d) => d.status === 0).length,
            blocked: list.filter((d) => d.status_Machine_Blocked === true)
              .length,
            ready: list.filter((d) => d.status_READY_D75_3_7 === true).length,
          };
        }
        if (key === "active") {
          dispatch(setStatusFilter(1));
          dispatch(setBlockedFilter(null));
          dispatch(setReadyFilter(null));
        } else if (key === "inactive") {
          dispatch(setStatusFilter(0));
          dispatch(setBlockedFilter(null));
          dispatch(setReadyFilter(null));
        } else if (key === "blocked") {
          dispatch(setBlockedFilter(true));
          dispatch(setStatusFilter(null));
          dispatch(setReadyFilter(null));
        } else if (key === "ready") {
          dispatch(setReadyFilter(true));
          dispatch(setStatusFilter(null));
          dispatch(setBlockedFilter(null));
        }
      }
      dispatch(loadDevices({ page: 1 }));
      dispatch(loadAllDevices({}));
    },
    [
      dispatch,
      filters.status,
      filters.status_Machine_Blocked,
      filters.status_READY_D75_3_7,
      summaryDevices,
    ]
  );

  const handleSummaryReset = useCallback(() => {
    dispatch(resetFilters());
    dispatch(loadDevices({ page: 1 }));
    dispatch(loadAllDevices({}));
    baselineCountsRef.current = null;
  }, [dispatch]);

  return {
    activeSummaryFilter,
    baselineCounts: baselineCountsRef.current || undefined,
    fixedTotalNumber: baselineTotalRef.current ?? (summaryDevices?.length || 0),
    handleSummaryFilter,
    handleSummaryReset,
  };
}
