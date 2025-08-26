// @sections_admin/gpsList/Gps-list.sections.tsx
import React, { useCallback, useEffect, useMemo } from "react";
import { useGps } from "@store_admin/gps/hooks/useGps";
import { useListQueryParams } from "@hooks/useListQueryParams";
import { createGpsTableConfig } from "./config/gpsTableConfig";
import { createGpsFilterConfig, GpsFields } from "./config/gpsFilterConfig";
import type { GpsDevice } from "@store_admin/gps/gps.types";
import styles from "./styles/Gps-list.sections.module.scss";

import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";
import { Download, Plus, RefreshCw } from "lucide-react";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { usePagination } from "@hooks/usePagination";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";
import { Divider } from "@shared/divider/Divider.component";
import { ModalCreateGps } from "./_modals/ModalCreateGps.component";
import { useAppSelector } from "../../core/store/store.hooks";
import { selectScopedCustomer } from "../../core/store/scope/scope.selectors";

export const GpsListSections: React.FC = () => {
  // 🔗 customer globale (selezionato nell'header)
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
      [GpsFields.CODICE]: "",
      [GpsFields.MUNICIPILITY]: "",
      [GpsFields.CUSTOMER]: "",
      [GpsFields.WASTE]: "",
    },
  });

  const queryParams = {
    ...filters,
    sortBy,
    sortOrder,
    page,
    page_size: pageSize,
  };

  const { gps, isLoading, meta, deleteGps, refetch, createGps, updateGps } =
    useGps(queryParams);

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
  };

  const handleEdit = useCallback(
    async (payload: Partial<GpsDevice> & { id: string | number }) => {
      const { id, ...data } = payload;
      await updateGps({ id, data }).unwrap();
      refetch();
    },
    [updateGps, refetch]
  );

  const handleDelete = useCallback(
    async (d: GpsDevice) => {
      if (window.confirm(`Eliminare il dispositivo codice ${d.codice}?`)) {
        await deleteGps(d.id).unwrap();
      }
    },
    [deleteGps]
  );

  const handleCreate = useCallback(
    async (data: Partial<GpsDevice>) => {
      await createGps(data as any).unwrap();
      refetch();
    },
    [createGps, refetch]
  );

  const onExportClick = () => console.log("Esporta GPS");
  const onRefreshClick = () => refetch();

  const baseConfig = createGpsTableConfig({
    gps,
    onView: () => {},
    onEdit: handleEdit,
    onDelete: handleDelete,
    isLoading,
  });

  // 🔁 Quando cambia il cliente scelto in header:
  // - resetta paginazione
  // - rifai la fetch degli utenti
  useEffect(() => {
    setPage(1);
    refetch();
  }, [scopedCustomer]); // eslint-disable-line react-hooks/exhaustive-deps

  const tableConfig = {
    ...baseConfig,
    pagination: {
      enabled: true,
      currentPage: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: meta?.total_pages,
      totalItems: meta?.total ?? 0,
      onPageChange: pagination.setPage,
      onPageSizeChange: pagination.setPageSize,
      hasNext: meta?.has_next,
      hasPrev: meta?.has_prev,
      nextPage: meta?.next_page,
      prevPage: meta?.prev_page,
    },
    sorting: {
      ...baseConfig.sorting,
      currentSortKey: sortBy,
      currentSortDirection: sortOrder,
      onSort: setSort,
    },
  };

  const filtersConfig = useMemo(
    () => createGpsFilterConfig({ filters, setFilter }),
    [filters, setFilter]
  );

  return (
    <div className={styles["gps-list-page"]}>
      <SectionHeaderComponent
        title="GPS"
        subTitle={`Gestisci i dispositivi (${meta?.total ?? 0} totali)`}
        buttons={[
          {
            onClick: onRefreshClick,
            variant: "outline",
            color: "secondary",
            size: "sm",
            icon: RefreshCw,
            label: "Aggiorna",
            disabled: isLoading,
          },
          {
            component: (
              <ModalCreateGps
                onSave={handleCreate}
                triggerButton={
                  <SimpleButton
                    variant="outline"
                    color="primary"
                    size="sm"
                    icon={Plus}
                  >
                    Nuovo
                  </SimpleButton>
                }
              />
            ),
          },
          {
            onClick: onExportClick,
            variant: "outline",
            color: "success",
            size: "sm",
            icon: Download,
            label: "Esporta",
          },
        ]}
      />

      <div className={styles["gps-list-page__filters"]}>
        <SectionFilterComponent
          filters={filtersConfig}
          onResetFilters={handleResetAll}
          isLoading={isLoading}
        />
      </div>
      <Divider />

      <div className={styles["gps-list-page__table-wrapper"]}>
        <GenericTableWithLogic config={tableConfig} loading={isLoading} />
      </div>
    </div>
  );
};
