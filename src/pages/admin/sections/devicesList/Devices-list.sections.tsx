import React, { useCallback, useEffect, useMemo, useRef } from "react";
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

import { useAppSelector } from "@root/pages/admin/core/store/store.hooks";
import { selectScopedCustomer } from "@store_admin/scope/scope.selectors";

export const DevicesListSections: React.FC = () => {
  const { isCards, isTable, isMap, toggleCardsTable, toggleMap } =
    useDevicesListView("cards");

  const scopedCustomer = useAppSelector(selectScopedCustomer);

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
      [DeviceFields.STATUS_MACHINE_BLOCKED]: "",
    },
  });

  // ⬇️ TABELLAAAA (usa la sua paginazione condivisa)
  const queryParamsTable = {
    ...filters,
    customer_Name: scopedCustomer || undefined,
    sortBy,
    sortOrder,
    page,
    page_size: pageSize,
  };
  const {
    devices,
    isLoading,
    meta,
    deleteDevice,
    createDevice,
    updateDevice,
    refetch,
  } = useDevices(queryParamsTable);

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

  // ⬇️ GRID INFINITA (pagina interna separata)
  const infiniteFilters = useMemo(
    () => ({
      ...filters,
      customer_Name: scopedCustomer || undefined,
    }),
    [filters, scopedCustomer]
  );

  // opzionale: se la lista scorre in un container, passa il ref come root
  const gridScrollRef = useRef<HTMLDivElement | null>(null);

  const {
    devices: deviceGrid,
    isLoading: isLoadingGrid,
    hasNext: hasNextGrid,
    reload: reloadGrid,
    sentinelRef,
  } = useInfiniteDevices({
    filters: infiniteFilters,
    sortBy,
    sortOrder,
    pageSize,
    key: `${scopedCustomer ?? "all"}|${JSON.stringify(filters)}`,
    // rootRef: gridScrollRef, // <- decommenta se hai un contenitore scrollabile
  });

  // 🌍 MAPPA
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

  const handleResetAll = () => {
    resetAll();
    pagination.resetPagination(); // tabella → torna a 1
    reloadGrid(); // grid → torna a 1 internamente
    refetch(); // tabella
    refetchMap(); // mappa
  };

  const refetchAll = useCallback(() => {
    refetch();
    refetchMap();
    reloadGrid();
  }, [refetch, refetchMap, reloadGrid]);

  const handleDeleteDevice = useCallback(
    async (device: Device) => {
      const name = (device as any).machineName || device.id;
      if (
        window.confirm(`Sei sicuro di voler eliminare il dispositivo ${name}?`)
      ) {
        try {
          await deleteDevice(device.id).unwrap();
          refetchAll();
        } catch (e: any) {
          alert(`Errore: ${e.message || "sconosciuto"}`);
        }
      }
    },
    [deleteDevice, refetchAll]
  );

  const onToggleDeviceStatus = useCallback(
    async (_device: Device) => refetchAll(),
    [refetchAll]
  );
  const onExportClick = () => console.log("Esporta devices");
  const onRefreshClick = () =>
    useCallback(async (_device: Device) => refetchAll(), [refetchAll]);

  const updateExistingDevice = useCallback(
    async (deviceId: string, deviceData: any) => {
      try {
        if (!deviceData) throw new Error("Device data is required");
        const result = await updateDevice({
          id: deviceId,
          data: deviceData,
        }).unwrap();
        setTimeout(() => refetchAll(), 100);
        return result;
      } catch (error: any) {
        throw new Error(
          error?.data?.detail || error?.message || "Errore durante la modifica"
        );
      }
    },
    [updateDevice, refetchAll]
  );

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

  const getLoadingState = () => {
    if (isMap) return isLoadingMap;
    if (isTable) return isLoading;
    return isLoadingGrid;
  };

  // al cambio customer: tabella torna a pagina 1; la grid si resetta via key
  useEffect(() => {
    if (pagination.page !== 1) pagination.setPage(1);
  }, [scopedCustomer]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles["devices-list-page"]}>
      <SectionHeaderComponent
        title="Dispositivi"
        subTitle={`Gestisci i dispositivi`}
        buttons={createHeaderBtnConfig({
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
          createNewDevice: async () => {}, // se ti serve, puoi rimettere la tua create
        })}
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
          <div
            className={styles.devicesListSection}
            ref={gridScrollRef} // ← decommenta rootRef nel hook se questo è lo scroll container
          >
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
                      onAction={() => {}}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    />
                  ))}

                  {/* sentinel mostrato solo se ha senso */}
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

export default DevicesListSections;
