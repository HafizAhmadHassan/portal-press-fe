import React, { useCallback, useMemo, useEffect } from "react";
// Debug flag type augmentation
declare global {
  interface Window {
    __DEV_SHOW_DEVICE_COUNTS?: boolean;
  }
}
import { RefreshCw } from "lucide-react";
import { Divider } from "@shared/divider/Divider.component";
import styles from "./Devices-list.sections.module.scss";

import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { useInfiniteDevices } from "@hooks/useInfiniteScroll.ts";
import { useMapDevices } from "./_hooks/useMapDevices";
import { useDevicesListView } from "./_hooks/useDevicesListView";
import { useDevicesSummaryFilters } from "./_hooks/useDevicesSummaryFilters";
import { useDevicesWasteFilter } from "./_hooks/useDevicesWasteFilter";
import { useDevicesCRUD } from "./_hooks/useDevicesCRUD";

import { DevicesSummaryBar } from "@root/pages/admin/sections/devicesList/_components/DevicesSummaryBar/DevicesSummaryBar.component";
import { WasteDistributionBar } from "./_components/WasteDistributionBar/WasteDistributionBar.component";
import { DevicesGridView } from "./_components/DevicesGridView/DevicesGridView.component";
import { DevicesTableView } from "./_components/DevicesTableView/DevicesTableView.component";
import {
  useAppSelector,
  useAppDispatch,
} from "@root/pages/admin/core/store/store.hooks";
import { selectScopedCustomer } from "@store_admin/scope/scope.selectors";
import devicesListHeaderBtns from "./_config/deviceHeaderBtnsConfig";
import {
  loadDevices,
  loadAllDevices,
} from "@store_admin/devices/devices.thunks";
import DevicesMap from "./_components/DevicesMap/DevicesMap";
import { selectDevicesAnyLoading } from "@store_admin/devices/devices.selectors";

export const DevicesListSections: React.FC = () => {
  const { isCards, isTable, isMap, toggleCardsTable, toggleMap } =
    useDevicesListView("cards");

  const scopedCustomer = useAppSelector(selectScopedCustomer);
  const dispatch = useAppDispatch();

  const devices = useAppSelector((s) => s.devices.devices);
  const pagination = useAppSelector((s) => s.devices.pagination);
  const isLoading = useAppSelector((s) => s.devices.isLoading);
  const filters = useAppSelector((s) => s.devices.filters);
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

  const refetch = useCallback(() => {
    dispatch(loadDevices({ page: pagination.page }));
  }, [dispatch, pagination.page]);

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

  // Hook personalizzati per gestione filtri
  const {
    activeSummaryFilter,
    baselineCounts,
    fixedTotalNumber,
    handleSummaryFilter,
    handleSummaryReset,
  } = useDevicesSummaryFilters(summaryDevices);

  const {
    displayedWasteDistribution,
    totalWasteBaseline,
    activeWasteFilter,
    handleWasteFilterToggle,
  } = useDevicesWasteFilter(allWasteByType, scopedCustomer, refetchMap);

  // Hook per operazioni CRUD
  const refetchAll = useCallback(() => {
    refetch();
    refetchMap();
    reloadGrid();
  }, [refetch, refetchMap, reloadGrid]);

  const {
    handleCreateDevice,
    handleEditDevice,
    handleDeleteDevice,
    handleToggleStatus,
  } = useDevicesCRUD(refetchAll);

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

  const onExportClick = () => console.log("Esporta devices");

  const onRefreshClick = useCallback(() => {
    refetchAll();
  }, [refetchAll]);

  // 🔁 quando cambia il cliente: refetch mappa
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

      <WasteDistributionBar
        wasteDistribution={displayedWasteDistribution}
        totalBaseline={totalWasteBaseline}
        activeWasteFilter={activeWasteFilter}
        wasteColors={wasteColors}
        onWasteClick={handleWasteFilterToggle}
      />

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
            <DevicesSummaryBar
              devices={summaryDevices || []}
              onMetricClick={handleSummaryFilter}
              onResetFilters={handleSummaryReset}
              activeFilter={activeSummaryFilter}
              baselineCounts={baselineCounts}
              fixedTotalNumber={fixedTotalNumber}
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
            baselineCounts={baselineCounts}
            fixedTotalNumber={fixedTotalNumber}
          />

          {isTable ? (
            <DevicesTableView
              devices={devices}
              isLoading={isLoading}
              onEdit={handleEditDevice}
              onDelete={handleDeleteDevice}
              onToggleStatus={handleToggleStatus}
            />
          ) : (
            <DevicesGridView
              devices={deviceGrid}
              isLoading={isLoadingGrid}
              hasNext={hasNextGrid}
              sentinelRef={sentinelRef}
            />
          )}
        </>
      )}
    </div>
  );
};
