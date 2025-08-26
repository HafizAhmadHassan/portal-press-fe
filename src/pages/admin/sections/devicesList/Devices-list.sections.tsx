// File: admin/sections_admin/devicesList/DevicesList.sections.tsx
import React, { useCallback, useEffect, useMemo } from "react";
import { useListQueryParams } from "@hooks/useListQueryParams";
import { createDevicesTableConfig } from "@sections_admin/devicesList/_config/devicesTableConfig";
import { useInfiniteDevices } from "@hooks/useInfiniteScroll.ts";
import { useMapDevices } from "./_hooks/useMapDevices";
import {
  createDevicesFilterConfig,
  DeviceFields,
} from "@sections_admin/devicesList/_config/deviceFilterConfig";
import type { Device } from "@store_admin/devices/devices.types";
import styles from "./_styles/Devices-list.sections.module.scss";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { usePagination } from "@hooks/usePagination.ts";
import DevicesMap from "@sections_admin/devicesList/_components/DevicesMap";
import { DevicesSummaryBar } from "@sections_admin/devicesList/_components/DevicesSummaryBar";
import { DeviceCard } from "@sections_admin/devicesList/_components/DeviceCard";
import { useDevices } from "@store_admin/devices/hooks/useDevices.ts";
import { useDevicesListView } from "./_hooks/useDevicesListView";
import { createHeaderBtnConfig } from "@sections_admin/devicesList/_config/deviceHeaderBtnsConfig";
import { DevicesMapStats } from "@sections_admin/devicesList/_components/DevicesMapStats";
import { Divider } from "@shared/divider/Divider.component.tsx";

// 👇 NEW: customer globale scelto in header
import { useAppSelector } from "@root/pages/admin/core/store/store.hooks";
import { selectScopedCustomer } from "@store_admin/scope/scope.selectors";

export const DevicesListSections: React.FC = () => {
  const { isCards, isTable, isMap, toggleCardsTable, toggleMap } =
    useDevicesListView("cards");

  // 🔗 customer globale (selezionato nell'header)
  const scopedCustomer = useAppSelector(selectScopedCustomer);

  // ❌ RIMOSSO il filtro "customer" locale: vive nello scope globale
  const {
    filters,
    sortBy,
    sortOrder,
    page,
    pageSize,
    setFilter,
    setSort,
    setPage,
    setPageSize,
    resetAll,
  } = useListQueryParams({
    initialFilters: {
      [DeviceFields.SEARCH]: "",
      [DeviceFields.WASTE]: "",
      [DeviceFields.STATUS]: "",
      [DeviceFields.CITY]: "",
      [DeviceFields.PROVINCE]: "",
      // [DeviceFields.CUSTOMER]: "",  // <— rimosso
      [DeviceFields.STATUS_MACHINE_BLOCKED]: "",
    },
  });

  const queryParamsTable = {
    ...filters,
    sortBy,
    sortOrder,
    page,
    page_size: pageSize,
  };

  const {
    devices: deviceGrid,
    isLoading: isLoadingGrid,
    hasNext: hasNextGrid,
    reload: reloadGrid,
    sentinelRef,
  } = useInfiniteDevices({
    filters,
    sortBy,
    sortOrder,
    page,
    pageSize,
    setPage,
    key: JSON.stringify(filters), // il customer è globale, ricarichiamo via effect sotto
  });

  const {
    devices,
    isLoading,
    meta,
    deleteDevice,
    createDevice,
    updateDevice,
    refetch,
  } = useDevices(queryParamsTable);

  // 🌍 Filtri per la mappa — usa il customer globale (se serve per filtraggio client-side)
  const mapFilters = useMemo(
    () => ({
      wasteType: filters[DeviceFields.WASTE] || undefined,
      status: filters[DeviceFields.STATUS]
        ? parseInt(filters[DeviceFields.STATUS])
        : undefined,
      isBlocked:
        filters[DeviceFields.STATUS_MACHINE_BLOCKED] === "true" || undefined,
      city: filters[DeviceFields.CITY] || undefined,
      customer: scopedCustomer || undefined, // <— da scope globale
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

  const pagination = usePagination({
    initialPage: page,
    initialPageSize: pageSize,
    totalItems: meta?.total,
    totalPages: meta?.total_pages,
    onChange: (newPage, newSize) => {
      setPage(newPage);
      setPageSize(newSize);
    },
  });

  const handleResetAll = () => {
    resetAll();
    pagination.resetPagination();
    setTimeout(() => reloadGrid(), 100);
  };

  const handleDeleteDevice = useCallback(
    async (device: Device) => {
      const name = (device as any).machineName || device.id;
      if (
        window.confirm(`Sei sicuro di voler eliminare il dispositivo ${name}?`)
      ) {
        try {
          await deleteDevice(device.id).unwrap();
          refetch();
          refetchMap();
          reloadGrid();
        } catch (e: any) {
          alert(`Errore: ${e.message || "sconosciuto"}`);
        }
      }
    },
    [deleteDevice, refetch, refetchMap, reloadGrid]
  );

  const refetchAll = useCallback(() => {
    refetch();
    refetchMap();
    reloadGrid();
  }, [refetch, refetchMap, reloadGrid]);

  const onToggleDeviceStatus = useCallback(
    async (_device: Device) => refetchAll(),
    [refetchAll]
  );
  const onExportClick = () => console.log("Esporta devices");
  const onRefreshClick = () =>
    useCallback(async (_device: Device) => refetchAll(), [refetchAll]);

  const getLoadingState = () => {
    if (isMap) return isLoadingMap;
    if (isTable) return isLoading;
    return isLoadingGrid;
  };

  const updateExistingDevice = useCallback(
    async (deviceId: string, deviceData: any) => {
      try {
        if (!deviceData) throw new Error("Device data is required");
        const updatePayload = { id: deviceId, data: deviceData };
        const result = await updateDevice(updatePayload).unwrap();
        setTimeout(() => {
          refetch();
          refetchMap();
          reloadGrid();
        }, 100);
        return result;
      } catch (error: any) {
        throw new Error(
          error?.data?.detail || error?.message || "Errore durante la modifica"
        );
      }
    },
    [updateDevice, refetch, refetchMap, reloadGrid]
  );

  const handleDeviceAction = () => console.log("handleDeviceAction");

  const tableConfig = useMemo(
    () =>
      createDevicesTableConfig({
        devices,
        onEdit: updateExistingDevice,
        onDelete: handleDeleteDevice,
        onToggleStatus: onToggleDeviceStatus,
        isLoading,
        sortBy,
        sortOrder,
        onSort: setSort,
        pagination: {
          enabled: true,
          currentPage: pagination.page,
          pageSize: pagination.pageSize,
          totalPages: pagination.totalPages,
          totalItems: meta?.total ?? 0,
          onPageChange: pagination.setPage,
          onPageSizeChange: pagination.setPageSize,
          hasNext: meta?.has_next,
          hasPrev: meta?.has_prev,
          nextPage: meta?.next_page,
          prevPage: meta?.prev_page,
        },
      }),
    [
      devices,
      handleDeleteDevice,
      onToggleDeviceStatus,
      isLoading,
      sortBy,
      sortOrder,
      setSort,
      pagination,
      meta,
    ]
  );

  const filtersConfig = useMemo(
    () => createDevicesFilterConfig({ filters, setFilter }),
    [filters, setFilter]
  );

  const createNewDevice = useCallback(
    async (deviceData: any) => {
      try {
        if (!deviceData?.machine_name)
          throw new Error("machine_name is required");
        const result = await createDevice(deviceData).unwrap();
        setFilter("search", "");
        setFilter("waste", "");
        setFilter("status", "");
        setFilter("city", "");
        setFilter("province", "");
        // setFilter("customer", ""); // <— rimosso
        setFilter("statusMachineBlocked", "");
        setPage(1);
        setPageSize(10);
        setTimeout(() => {
          refetch();
          refetchMap();
          reloadGrid();
        }, 200);
        return result;
      } catch (error: any) {
        throw new Error(
          error?.data?.detail ||
            error?.message ||
            "Errore creazione dispositivo"
        );
      }
    },
    [
      createDevice,
      refetch,
      refetchMap,
      reloadGrid,
      setFilter,
      setPage,
      setPageSize,
    ]
  );

  const sectionHeaderButtons = useMemo(() => {
    return createHeaderBtnConfig({
      onRefreshClick,
      getLoadingState,
      refetch,
      refetchMap,
      reloadGrid,
      toggleCardsTable,
      toggleMap,
      isCards,
      isMap,
      onExportClick,
      createNewDevice,
    });
  }, [
    onRefreshClick,
    getLoadingState,
    refetch,
    refetchMap,
    reloadGrid,
    toggleCardsTable,
    toggleMap,
    isCards,
    isMap,
    onExportClick,
    createNewDevice,
  ]);

  // 🔁 Quando cambia il customer scelto in header:
  // - resetto paginazione
  // - ricarico tabella, mappa e griglia
  useEffect(() => {
    setPage(1);
    refetchAll();
  }, [scopedCustomer]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles["devices-list-page"]}>
      <SectionHeaderComponent
        title="Dispositivi"
        subTitle={`Gestisci i dispositivi`}
        buttons={sectionHeaderButtons}
        // ❌ NIENTE customerSelect qui: sta nell'header globale
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
            <span>
              Errore nel caricamento della mappa: {mapError.toString()}
            </span>
            <button onClick={refetchMap}>Riprova</button>
          </div>
        ) : (
          <>
            <DevicesMapStats mapStats={mapStats} wasteColors={wasteColors} />
            <DevicesMap
              mapData={mapDevices}
              isCollapsed={false}
              showActions={true}
            />
          </>
        )
      ) : (
        <>
          <DevicesSummaryBar devices={summaryDevices || []} />
          <div className={styles.devicesListSection}>
            <div className={styles.viewContainer}>
              {isTable ? (
                <GenericTableWithLogic
                  config={tableConfig}
                  loading={isLoading}
                />
              ) : (
                <div className={styles.devicesGrid}>
                  {deviceGrid.map((device, idx) => (
                    <DeviceCard
                      key={`${device.id}-${idx}`}
                      device={device}
                      onAction={handleDeviceAction}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    />
                  ))}
                  {hasNextGrid && (
                    <div ref={sentinelRef} style={{ height: 1 }} />
                  )}
                  {isLoadingGrid && (
                    <div className={styles.spinner}>Caricamento...</div>
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

export default DevicesListSections;
