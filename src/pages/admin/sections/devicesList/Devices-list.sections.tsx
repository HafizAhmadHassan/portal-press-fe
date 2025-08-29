import React, { useCallback, useMemo, useRef, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useCrud } from "@root/hooks/useCrud";
import { Divider } from "@shared/divider/Divider.component";
import { createDevicesTableConfig } from "./_config/devicesTableConfig";
import styles from "./Devices-list.sections.module.scss";

import { useListController } from "@root/hooks/useListController";
import { createDevicesFilterConfig } from "./_config/deviceFilterConfig";
import type {
  Device,
  DevicesQueryParams,
} from "@store_admin/devices/devices.types";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";
import {
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
  useCreateDeviceMutation,
  useGetDevicesQuery,
} from "@store_admin/devices/devices.api";
import { useInfiniteDevices } from "@hooks/useInfiniteScroll.ts";
import { useMapDevices } from "./_hooks/useMapDevices";
import { useDevicesListView } from "./_hooks/useDevicesListView";

import { DevicesSummaryBar } from "@root/pages/admin/sections/devicesList/_components/DevicesSummaryBar/DevicesSummaryBar.component";
import { DevicesBox } from "@sections_admin/devicesList/_components/DevicesBox/DevicesBox.component";
import { DevicesMapStats } from "@root/pages/admin/sections/devicesList/_components/DevicesMapStats/DevicesMapStats.component";
import { useAppSelector } from "@root/pages/admin/core/store/store.hooks";
import { selectScopedCustomer } from "@store_admin/scope/scope.selectors";
import { DeviceFields } from "@root/utils/constants/deviceFields.constants";
import devicesListHeaderBtns from "./_config/deviceHeaderBtnsConfig";
import DevicesMap from "./_components/DevicesMap/DevicesMap";

export const DevicesListSections: React.FC = () => {
  const { isCards, isTable, isMap, toggleCardsTable, toggleMap } =
    useDevicesListView("cards");

  const scopedCustomer = useAppSelector(selectScopedCustomer);

  const {
    items: devices,
    meta,
    isLoading,
    refetch,
    filters,
    setFilter,
    resetAll,
    buildTableConfig,
    queryParams,
  } = useListController<DevicesQueryParams, Device>({
    listHook: useGetDevicesQuery,
    initialFilters: {
      [DeviceFields.SEARCH]: "",
      [DeviceFields.WASTE]: "",
      [DeviceFields.STATUS]: "",
      [DeviceFields.CITY]: "",
      [DeviceFields.PROVINCE]: "",
      [DeviceFields.STATUS_MACHINE_BLOCKED]: "",
    },
    additionalParams: {
      customer_Name: scopedCustomer || undefined,
    },
  });

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

  const infiniteKey = useMemo(() => {
    const keyString = `${scopedCustomer ?? "all"}|${JSON.stringify(filters)}`;
    console.log("Key per infinite scroll:", keyString);
    return keyString;
  }, [filters, scopedCustomer]);

  const gridScrollRef = useRef<HTMLDivElement | null>(null);

  const {
    devices: deviceGrid,
    isLoading: isLoadingGrid,
    hasNext: hasNextGrid,
    reload: reloadGrid,
    sentinelRef,
  } = useInfiniteDevices({
    filters: infiniteFilters,
    pageSize: queryParams?.page_size || 20,
    key: infiniteKey,
  });

  // Debug per tracciare i cambiamenti
  useEffect(() => {
    console.log("Filtri cambiati:", infiniteFilters);
    console.log("Device grid aggiornati:", deviceGrid.length, "devices");
    console.log("Loading state:", isLoadingGrid);
  }, [infiniteFilters, deviceGrid, isLoadingGrid]);

  // MAPPA
  const mapFilters = useMemo(
    () => ({
      wasteType: filters[DeviceFields.WASTE] || undefined,
      status: filters[DeviceFields.STATUS]
        ? parseInt(filters[DeviceFields.STATUS])
        : undefined,
      isBlocked:
        filters[DeviceFields.STATUS_MACHINE_BLOCKED] === "true" || undefined,
      city: filters[DeviceFields.CITY] || undefined,
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
  } = useMapDevices(mapFilters);

  const handleCreateDevice = useCallback(
    async (deviceData: Partial<Device>) => {
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
  const handleResetAll = useCallback(() => {
    console.log("Reset completo iniziato");
    resetAll();

    // Force reload dell'infinite scroll
    setTimeout(() => {
      reloadGrid();
      refetch();
      refetchMap();
    }, 100); // Piccolo delay per permettere il reset dei filtri
  }, [resetAll, reloadGrid, refetch, refetchMap]);

  const onExportClick = () => console.log("Esporta devices");

  const onRefreshClick = useCallback(() => {
    console.log("Refresh manuale iniziato");
    refetch();
    refetchMap();
    reloadGrid();
  }, [refetch, refetchMap, reloadGrid]);

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

  const tableConfig = useMemo(
    () => buildTableConfig(columns.columns, columns),
    [buildTableConfig, columns]
  );

  const filtersConfig = useMemo(
    () =>
      createDevicesFilterConfig({
        filters,
        setFilter: (key: string, value: any) => {
          console.log("Filter change:", key, "=", value);
          setFilter(key, value);
        },
      }),
    [filters, setFilter]
  );

  const getLoadingState = () => {
    if (isMap) return isLoadingMap;
    if (isTable) return isLoading;
    return isLoadingGrid;
  };

  return (
    <div className={styles["devices-list-page"]}>
      <SectionHeaderComponent
        title="Dispositivi"
        subTitle={`Gestisci i dispositivi (${meta?.total ?? 0} totali)`}
        buttons={devicesListHeaderBtns(
          onRefreshClick,
          RefreshCw,
          getLoadingState(),
          onExportClick,
          toggleCardsTable,
          toggleMap,
          isCards,
          isMap,
          handleCreateDevice
        )}
      />

      <div className={styles["devices-list-page__filters"]}>
        <SectionFilterComponent
          filters={filtersConfig}
          onResetFilters={handleResetAll}
          isLoading={getLoadingState()}
        />
      </div>
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
            <DevicesMapStats mapStats={mapStats} wasteColors={wasteColors} />
            <DevicesMap mapData={mapDevices} isCollapsed={false} showActions />
          </>
        )
      ) : (
        <>
          <DevicesSummaryBar devices={summaryDevices || []} />
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
                    <div ref={sentinelRef as any} style={{ height: 1 }} />
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
