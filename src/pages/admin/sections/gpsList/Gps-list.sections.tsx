import { RefreshCw } from "lucide-react";
import React, { useCallback, useEffect, useMemo } from "react";
import { useCrud } from "@root/hooks/useCrud";

import styles from "./Gps-list.module.scss";
import { toAppError } from "@root/utils/errorHandling";
import { getGpsColumns } from "./_config/gpsTableConfig";
import gpsListHeaderBtns from "./_config/gpsListHeaderBtns";
import { Divider } from "@shared/divider/Divider.component";
import { useListController } from "@root/hooks/useListController";
import type { GpsDevice, GpsQueryParams } from "@store_admin/gps/gps.types";
import { createGpsFilterConfig, GpsFields } from "./_config/gpsFilterConfig";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";
import {
  useGetGpsQuery,
  useCreateGpsMutation,
  useUpdateGpsMutation,
  useDeleteGpsMutation,
} from "@store_admin/gps/gps.api";
import { useAppSelector } from "../../core/store/store.hooks";
import { selectScopedCustomer } from "../../core/store/scope/scope.selectors";

export const GpsListSections: React.FC = () => {
  const {
    meta,
    isLoading,
    refetch,
    filters,
    setFilter,
    resetAll,
    buildTableConfig,
  } = useListController<GpsQueryParams, GpsDevice>({
    listHook: useGetGpsQuery, // <-- come gli Users
    initialFilters: {
      [GpsFields.CODICE]: "",
      [GpsFields.MUNICIPILITY]: "",
      [GpsFields.CUSTOMER]: "",
      [GpsFields.WASTE]: "",
    },
    // se il tuo endpoint supporta sort: imposta qui le chiavi corrette
    initialSort: { sortBy: "codice", sortOrder: "asc" },
  });

  const { execCreate, execUpdate, execDelete } = useCrud();
  const [createGpsTrigger] = useCreateGpsMutation();
  const [updateGpsTrigger] = useUpdateGpsMutation();
  const [deleteGpsTrigger] = useDeleteGpsMutation();

  const handleCreate = useCallback(
    async (payload: Partial<GpsDevice>) => {
      const res = await execCreate(createGpsTrigger, payload as any);
      if (!res.success) {
        const appErr = toAppError(
          res.error,
          "Errore durante la creazione del GPS"
        );
        console.error(appErr.message);
        throw new Error(appErr.message);
      }
      refetch();
    },
    [execCreate, createGpsTrigger, refetch]
  );

  const handleEdit = useCallback(
    async (payload: Partial<GpsDevice> & { id: number | string }) => {
      const { id, ...data } = payload;
      const res = await execUpdate(updateGpsTrigger, { id, data } as any);
      if (!res.success) {
        const appErr = toAppError(
          res.error,
          "Errore durante la modifica del GPS"
        );
        console.error(appErr.message);
        throw new Error(appErr.message);
      }
      refetch();
    },
    [execUpdate, updateGpsTrigger, refetch]
  );

  const handleDelete = useCallback(
    async (row: GpsDevice) => {
      if (!window.confirm(`Eliminare il dispositivo codice ${row.codice}?`))
        return;
      const res = await execDelete(deleteGpsTrigger, Number(row.id));
      if (!res.success) {
        const appErr = toAppError(
          res.error,
          "Errore durante l'eliminazione del GPS"
        );
        console.error(appErr.message);
        throw new Error(appErr.message);
      }
      refetch();
    },
    [execDelete, deleteGpsTrigger, refetch]
  );

  const onExportClick = () => console.log("Esporta GPS");
  const onRefreshClick = () => refetch();

  const columns = useMemo(
    () =>
      getGpsColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
      }),
    [handleEdit, handleDelete]
  );

  const tableConfig = useMemo(
    () => buildTableConfig(columns),
    [buildTableConfig, columns]
  );

  const filtersConfig = useMemo(
    () =>
      createGpsFilterConfig({
        filters,
        setFilter,
      }),
    [filters, setFilter]
  );

  // 🔗 cliente scelto in header
  const scopedCustomer = useAppSelector(selectScopedCustomer);
  // 🔁 quando cambia il cliente: reset ricerca e refetch
  useEffect(() => {
    refetch();
  }, [scopedCustomer, refetch]);

  return (
    <div className={styles["gps-list-page"]}>
      <SectionHeaderComponent
        title="GPS"
        subTitle={`Gestisci i dispositivi (${meta?.total ?? 0} totali)`}
        buttons={gpsListHeaderBtns(
          onRefreshClick,
          RefreshCw,
          isLoading,
          onExportClick,
          handleCreate
        )}
      />

      <div className={styles["gps-list-page__filters"]}>
        <SectionFilterComponent
          isLoading={isLoading}
          filters={filtersConfig}
          onResetFilters={resetAll}
        />
      </div>

      <Divider />

      <div className={styles["gps-list-page__table-wrapper"]}>
        <GenericTableWithLogic config={tableConfig} />
      </div>
    </div>
  );
};

export default GpsListSections;
