import React, {
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from "react";
// Debug flag type augmentation
declare global {
  interface Window {
    __DEV_SHOW_DEVICE_COUNTS?: boolean;
  }
}
import { RefreshCw } from "lucide-react";
import { useCrud } from "@root/hooks/useCrud";
import { Divider } from "@shared/divider/Divider.component";
import { createDevicesTableConfig } from "./_config/devicesTableConfig";
import styles from "./Devices-list.sections.module.scss";

// import { useListController } from "@root/hooks/useListController"; // Deprecated for devices domain
// import { createDevicesFilterConfig } from "./_config/deviceFilterConfig"; // filters UI currently disabled
import type {
  CreateDeviceRequest,
  Device,
} from "@store_admin/devices/devices.types";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
// import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component"; // Not used currently
import {
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
  useCreateDeviceMutation,
} from "@store_admin/devices/devices.api"; // RTK Query still used for mutations
import { useInfiniteDevices } from "@hooks/useInfiniteScroll.ts";
import { useMapDevices } from "./_hooks/useMapDevices";
import { useDevicesListView } from "./_hooks/useDevicesListView";

import { DevicesSummaryBar } from "@root/pages/admin/sections/devicesList/_components/DevicesSummaryBar/DevicesSummaryBar.component";
import { DevicesBox } from "@sections_admin/devicesList/_components/DevicesBox/DevicesBox.component";
import { DevicesMapStats } from "@root/pages/admin/sections/devicesList/_components/DevicesMapStats/DevicesMapStats.component";
import {
  useAppSelector,
  useAppDispatch,
} from "@root/pages/admin/core/store/store.hooks";
import { selectScopedCustomer } from "@store_admin/scope/scope.selectors";
// import { DeviceFields } from "@root/utils/constants/deviceFields.constants"; // Filters now driven by slice
import devicesListHeaderBtns from "./_config/deviceHeaderBtnsConfig";
import {
  loadDevices,
  loadAllDevices,
} from "@store_admin/devices/devices.thunks";
import DevicesMap from "./_components/DevicesMap/DevicesMap";
import { selectDevicesAnyLoading } from "@store_admin/devices/devices.selectors";
import {
  setStatusFilter,
  setBlockedFilter,
  setReadyFilter,
  resetFilters,
} from "@store_admin/devices/devices.slice";
import { setWasteFilter } from "@store_admin/devices/devices.slice";

export const DevicesListSections: React.FC = () => {
  const { isCards, isTable, isMap, toggleCardsTable, toggleMap } =
    useDevicesListView("cards");

  const scopedCustomer = useAppSelector(selectScopedCustomer);

  const dispatch = useAppDispatch();
  const devices = useAppSelector((s) => s.devices.devices);
  // const allDevices = useAppSelector((s) => s.devices.allDevices); // Not directly used (map uses hook)
  const pagination = useAppSelector((s) => s.devices.pagination);
  const isLoading = useAppSelector((s) => s.devices.isLoading);
  const filters = useAppSelector((s) => s.devices.filters);
  // Deriva quale filtro è attivo per evidenziare la card e mantenere i numeri originali delle altre
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
  const globalSearch = useAppSelector((s) => s.globalSearch.query);
  const unifiedLoading = useAppSelector(selectDevicesAnyLoading);

  // Effetto: quando cambia customer o globalSearch -> reload pagina 1
  useEffect(() => {
    dispatch(
      loadDevices({
        page: 1,
        search: globalSearch,
        customer: scopedCustomer || undefined,
      })
    );
    dispatch(
      loadAllDevices({
        search: globalSearch,
        customer: scopedCustomer || undefined,
      })
    );
  }, [dispatch, globalSearch, scopedCustomer]);

  // setFilter kept for future filter panel reactivation (currently unused)
  // const setFilter = useCallback((key: string, value: unknown) => {
  //   dispatch(setFilters({ [key]: value } as Record<string, unknown>));
  //   dispatch(loadDevices({ page: 1 }));
  //   dispatch(loadAllDevices({}));
  // }, [dispatch]);

  // resetAll placeholder removed (filters panel disabled)

  const refetch = useCallback(() => {
    dispatch(loadDevices({ page: pagination.page }));
  }, [dispatch, pagination.page]);

  const { execUpdate, execDelete, execCreate } = useCrud();
  const [updateDeviceTrigger] = useUpdateDeviceMutation();
  const [deleteDeviceTrigger] = useDeleteDeviceMutation();
  const [createDeviceTrigger] = useCreateDeviceMutation();

  // GRID INFINITA - con key e filtri migliorati
  const infiniteFilters = useMemo(
    () => ({
      ...filters,
      customer_Name: scopedCustomer || undefined,
    }),
    [filters, scopedCustomer]
  );

  const infiniteKey = useMemo(
    () => `${scopedCustomer ?? "all"}|${JSON.stringify(filters)}`,
    [filters, scopedCustomer]
  );

  const gridScrollRef = useRef<HTMLDivElement | null>(null);
  // Baseline counts (non filtrati) catturati al primo click su un filtro summary
  const baselineCountsRef = useRef<{
    active: number;
    inactive: number;
    blocked: number;
    ready: number;
  } | null>(null);
  // Totale baseline fisso: viene fissato quando non c'è filtro summary attivo
  const baselineTotalRef = useRef<number | null>(null);

  const {
    devices: deviceGrid,
    isLoading: isLoadingGrid,
    hasNext: hasNextGrid,
    reload: reloadGrid,
    sentinelRef,
  } = useInfiniteDevices({
    filters: infiniteFilters,
    pageSize: pagination.limit || 20,
    key: infiniteKey,
  });

  // MAPPA
  const mapFilters = useMemo(
    () => ({
      wasteType: (filters as unknown as { waste?: string }).waste || undefined,
      // IMPORTANT: usare controllo esplicito così lo status=0 (inattivo) non viene scartato
      status:
        filters.status !== null &&
        filters.status !== undefined &&
        filters.status !== ""
          ? Number(filters.status)
          : undefined,
      isBlocked: filters.status_Machine_Blocked === true || undefined,
      city: (filters as unknown as { city?: string }).city || undefined,
      customer_Name: scopedCustomer || undefined,
    }),
    [filters, scopedCustomer]
  );

  // (debug spostato sotto dove summaryDevices è definito)

  const {
    allDevices: summaryDevices,
    filteredDevices: mapDevices,
    mapStats,
    isLoading: isLoadingMap,
    error: mapError,
    refetch: refetchMap,
    wasteColors,
    totalDevicesCount,
    allWasteByType,
  } = useMapDevices(mapFilters);

  // Waste distribution freeze (anche per customer scope):
  // - Baseline catturata (per scope corrente) quando applico per la prima volta un filtro waste
  // - Se rimuovo il filtro waste, baseline aggiornata ai dati correnti dello scope
  // - Se cambia scopedCustomer, reset baseline e waste filter (nuovo contesto)
  const [wasteBaseline, setWasteBaseline] = useState<{
    scopeKey: string | null;
    data: Record<string, number> | null;
  }>({ scopeKey: null, data: null });

  // Reset baseline e filtro waste quando cambia il customer (nuovo contesto)
  useEffect(() => {
    setWasteBaseline({ scopeKey: scopedCustomer || null, data: null });
    // Non forziamo subito setWasteFilter(null) perché potresti voler mantenere l'intento UI,
    // ma se il waste selezionato non esiste nel nuovo scope semplicemente non apparirà evidenziato.
  }, [scopedCustomer]);

  useEffect(() => {
    const scopeKey = scopedCustomer || null; // null rappresenta la vista globale
    const baselineMatchesScope = wasteBaseline.scopeKey === scopeKey;

    if (!filters.waste) {
      // Filtro waste rimosso -> aggiorna baseline ai dati attuali dello scope
      setWasteBaseline({ scopeKey, data: allWasteByType || null });
      return;
    }
    // Filtro waste attivo: se non abbiamo baseline per questo scope la catturiamo
    if ((!baselineMatchesScope || !wasteBaseline.data) && allWasteByType) {
      setWasteBaseline({ scopeKey, data: allWasteByType });
    }
  }, [
    filters.waste,
    allWasteByType,
    scopedCustomer,
    wasteBaseline.scopeKey,
    wasteBaseline.data,
  ]);

  const displayedWasteDistribution = useMemo(() => {
    // Usa baseline.data se presente per lo scope corrente, altrimenti live distribution
    if (wasteBaseline.data) return wasteBaseline.data;
    return allWasteByType || {};
  }, [wasteBaseline.data, allWasteByType]);
  const totalWasteBaseline = useMemo(() => {
    return Object.values(displayedWasteDistribution).reduce((a, b) => a + b, 0);
  }, [displayedWasteDistribution]);

  // DEBUG opzionale: riconcilia conteggi (attivare da console: window.__DEV_SHOW_DEVICE_COUNTS = true)
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.__DEV_SHOW_DEVICE_COUNTS &&
      summaryDevices
    ) {
      const total = summaryDevices.length;
      const activeC = summaryDevices.filter((d) => d.status === 1).length;
      const inactiveC = summaryDevices.filter((d) => d.status === 0).length;
      const blockedC = summaryDevices.filter(
        (d) => d.status_Machine_Blocked === true
      ).length;
      const readyC = summaryDevices.filter(
        (d) => d.status_READY_D75_3_7 === true
      ).length;
      const blockedReadyOverlap = summaryDevices.filter(
        (d) =>
          d.status_Machine_Blocked === true && d.status_READY_D75_3_7 === true
      ).length;
      console.table({
        total,
        activeC,
        inactiveC,
        blockedC,
        readyC,
        blockedReadyOverlap,
        activePlusInactive: activeC + inactiveC,
        blockedPlusReady: blockedC + readyC,
      });
    }
  }, [summaryDevices]);

  const handleCreateDevice = useCallback(
    async (deviceData: CreateDeviceRequest) => {
      const res = await execCreate(createDeviceTrigger, deviceData);
      if (!res.success) throw new Error(res.error);
      refetch();
      refetchMap();
      reloadGrid();
    },
    [execCreate, createDeviceTrigger, refetch, refetchMap, reloadGrid]
  );

  const handleEditDevice = useCallback(
    async (deviceId: number, updatedData: Partial<Device>) => {
      const res = await execUpdate(updateDeviceTrigger, {
        id: deviceId,
        data: updatedData,
      });
      if (!res.success) throw new Error(res.error);
      refetch();
      refetchMap();
      reloadGrid();
    },
    [execUpdate, updateDeviceTrigger, refetch, refetchMap, reloadGrid]
  );

  const handleDeleteDevice = useCallback(
    async (device: Device) => {
      const name = device.machine_Name || device.id;
      if (
        window.confirm(`Sei sicuro di voler eliminare il dispositivo ${name}?`)
      ) {
        const res = await execDelete(deleteDeviceTrigger, device.id);
        if (!res.success) throw new Error(res.error);
        refetch();
        refetchMap();
        reloadGrid();
      }
    },
    [execDelete, deleteDeviceTrigger, refetch, refetchMap, reloadGrid]
  );

  const handleToggleStatus = useCallback(async () => {
    refetch();
    refetchMap();
    reloadGrid();
  }, [refetch, refetchMap, reloadGrid]);

  // FIXED: Reset migliorato con force reload
  // const handleResetAll = useCallback(() => {
  //   resetAll();
  //   setTimeout(() => {
  //     reloadGrid();
  //     refetch();
  //     refetchMap();
  //   }, 50);
  // }, [resetAll, reloadGrid, refetch, refetchMap]);

  const onExportClick = () => console.log("Esporta devices");

  const onRefreshClick = useCallback(() => {
    refetch();
    refetchMap();
    reloadGrid();
  }, [refetch, refetchMap, reloadGrid]);

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

  // Memorizza il totale baseline quando non c'è filtro attivo
  useEffect(() => {
    if (activeSummaryFilter === null && summaryDevices) {
      baselineTotalRef.current = summaryDevices.length;
    }
  }, [activeSummaryFilter, summaryDevices]);

  const columns = useMemo(
    () =>
      createDevicesTableConfig({
        devices,
        onEdit: handleEditDevice,
        onDelete: handleDeleteDevice,
        onToggleStatus: handleToggleStatus,
        isLoading,
      }),
    [
      devices,
      handleEditDevice,
      handleDeleteDevice,
      handleToggleStatus,
      isLoading,
    ]
  );

  const tableConfig = useMemo(() => {
    // buildTableConfig non più disponibile; assumo GenericTableWithLogic accetta direttamente config generato
    return columns; // columns contiene già la definizione
  }, [columns]);

  // const filtersConfig = useMemo(() => createDevicesFilterConfig({
  //   filters: filters as Record<string, unknown>,
  //   setFilter: (key: string, value: unknown) => setFilter(key, value),
  // }), [filters, setFilter]);

  // unifiedLoading from selector replaces previous getLoadingState

  // 🔁 quando cambia il cliente: reset ricerca e refetch
  useEffect(() => {
    refetchMap();
  }, [scopedCustomer, refetchMap]);

  return (
    <div className={styles["devices-list-page"]}>
      <SectionHeaderComponent
        title="Macchine"
        subTitle={`Gestisci le macchine (${pagination.total ?? 0} totali)`}
        buttons={devicesListHeaderBtns(
          onRefreshClick,
          RefreshCw,
          unifiedLoading,
          onExportClick,
          toggleCardsTable,
          toggleMap,
          isCards,
          isMap,
          handleCreateDevice
        )}
      />
      {displayedWasteDistribution &&
        Object.keys(displayedWasteDistribution).length > 0 && (
          <div className={styles.totalWasteBar}>
            <div className={styles.totalWasteLabel}>
              Distribuzione totale rifiuti:
            </div>
            <div className={styles.totalWasteChips}>
              {Object.entries(displayedWasteDistribution).map(
                ([waste, count]) => {
                  const isActive = filters.waste === waste;
                  const perc =
                    totalWasteBaseline > 0
                      ? Math.round((count / totalWasteBaseline) * 100)
                      : 0;
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        const next = isActive ? null : waste.toLowerCase();
                        dispatch(setWasteFilter(next));
                        // reload data when waste changes
                        dispatch(loadDevices({ page: 1 }));
                        dispatch(loadAllDevices({}));
                        refetchMap();
                      }}
                      key={`global-waste-${waste}`}
                      className={
                        styles.totalWasteChip +
                        (isActive ? " " + styles.activeWasteChip : "")
                      }
                      style={{
                        borderColor:
                          wasteColors[waste] || "var(--border-color)",
                        background: isActive
                          ? wasteColors[waste] || "var(--accent-color)"
                          : "color-mix(in srgb, var(--bg-secondary) 85%, var(--bg-primary))",
                        color: isActive
                          ? "#fff"
                          : wasteColors[waste] || "var(--text-secondary)",
                      }}
                      title={`Filtra per ${waste} – totale baseline: ${count} (${perc}%)`}
                    >
                      <strong>{waste}</strong>{" "}
                      <span className={styles.count}>{count}</span>
                      <span style={{ fontSize: 9, opacity: 0.7 }}>
                        {" "}
                        {perc}%
                      </span>
                    </button>
                  );
                }
              )}
            </div>
          </div>
        )}

      {/* <div className={styles["devices-list-page__filters"]}>
        <SectionFilterComponent
          filters={filtersConfig}
          onResetFilters={handleResetAll}
          isLoading={getLoadingState()}
        />
      </div> */}
      <Divider />

      {isMap ? (
        isLoadingMap ? (
          <div className={styles.loadingState}>
            <div className={styles.spinner} />
            <span>
              Caricamento mappa con {totalDevicesCount.total} dispositivi...
            </span>
          </div>
        ) : mapError ? (
          <div className={styles.errorState}>
            <span>Errore nel caricamento della mappa: {String(mapError)}</span>
            <button onClick={refetchMap}>Riprova</button>
          </div>
        ) : (
          <>
            {/*   <DevicesMapStats
              mapStats={mapStats}
              wasteColors={wasteColors}
              allWasteByType={allWasteByType}
            /> */}
            <DevicesSummaryBar
              devices={summaryDevices || []}
              onMetricClick={handleSummaryFilter}
              onResetFilters={handleSummaryReset}
              activeFilter={activeSummaryFilter}
              baselineCounts={baselineCountsRef.current || undefined}
              fixedTotalNumber={
                baselineTotalRef.current ?? (summaryDevices?.length || 0)
              }
            />
            <DevicesMap mapData={mapDevices} isCollapsed={false} showActions />
          </>
        )
      ) : (
        <>
          <DevicesSummaryBar
            devices={summaryDevices || []}
            onMetricClick={handleSummaryFilter}
            onResetFilters={handleSummaryReset}
            activeFilter={activeSummaryFilter}
            baselineCounts={baselineCountsRef.current || undefined}
            fixedTotalNumber={
              baselineTotalRef.current ?? (summaryDevices?.length || 0)
            }
          />
          <div className={styles.devicesListSection} ref={gridScrollRef}>
            <div className={styles.viewContainer}>
              {isTable ? (
                <div className={styles["devices-list-page__table-wrapper"]}>
                  <GenericTableWithLogic config={tableConfig} />
                </div>
              ) : (
                <div className={styles.devicesGrid}>
                  {deviceGrid.length === 0 && !isLoadingGrid ? (
                    <div className={styles.emptyState}>
                      <span>Nessun dispositivo trovato</span>
                    </div>
                  ) : (
                    deviceGrid.map((device, idx) => (
                      <DevicesBox
                        key={`${device.id}-${idx}`}
                        device={device}
                        onAction={() => {}}
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      />
                    ))
                  )}

                  {hasNextGrid && !isLoadingGrid && (
                    <div ref={sentinelRef} style={{ height: 1 }} />
                  )}

                  {isLoadingGrid && (
                    <div className={styles.spinner}>Caricamento…</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
