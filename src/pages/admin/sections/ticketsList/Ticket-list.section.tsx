// TicketsListSections.tsx - VERSIONE SNELLITA come UsersListSections
import { RefreshCw } from "lucide-react";
import { useCrud } from "@hooks/useCrud";
import React, { useCallback, useMemo } from "react";
import { toAppError } from "@root/utils/errorHandling";
import { Divider } from "@shared/divider/Divider.component";
import { useListController } from "@hooks/useListController";
import styles from "./TicketsListSection.module.scss";
import ticketListHeaderBtns from "./_config/ticketListHeaderBtns";
import { getTicketsColumns } from "./_config/ticketsTableConfig";
import type { TicketRead } from "@store_admin/tickets/ticket.types";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";

import {
  createTicketsFilterConfig,
  TicketFields,
} from "./_config/ticketsFilterConfig";
import {
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetTicketsQuery,
} from "@store_admin/tickets/ticket.api";
import { resolver } from "@root/utils/severityResolver";
import { TicketsSummaryBar } from "./_components/TicketsSummaryBar";
import type { CloseTicketData } from "./_types/TicketWithDevice.types";

// Tipi extra

export const TicketsListSections: React.FC = () => {
  // Usa useListController come per Users
  const {
    items: tickets = [],
    meta,
    isLoading,
    refetch,
    filters,
    setFilter,
    resetAll,
    buildTableConfig,
    page,
    setPage,
    pageSize,
    setPageSize,
    sortBy,
    sortOrder,
    setSort,
  } = useListController<any, TicketRead>({
    listHook: useGetTicketsQuery, // ✅ hook di lista
    initialFilters: {
      [TicketFields.TITLE]: "",
      [TicketFields.STATUS]: "",
      [TicketFields.PRIORITY]: "",
      [TicketFields.CATEGORY]: "",
      [TicketFields.ASSIGNED_TO]: "",
    },
    initialSort: { sortBy: "date_Time", sortOrder: "desc" },
  });

  const { execUpdate, execDelete } = useCrud();
  const [updateTicketTrigger] = useUpdateTicketMutation();
  const [deleteTicketTrigger] = useDeleteTicketMutation();

  // Handlers
  const handleEdit = useCallback(
    async (ticketData: Partial<TicketRead> & { id: number | string }) => {
      const { id, ...data } = ticketData;
      const res = await execUpdate(updateTicketTrigger, {
        id,
        data: data as Partial<TicketRead>,
      });
      if (!res.success) {
        const appErr = toAppError(res.error, "Errore durante la modifica");
        console.error(appErr.message);
        throw new Error(appErr.message);
      }
      refetch();
    },
    [execUpdate, updateTicketTrigger, refetch]
  );

  const handleDelete = useCallback(
    async (ticket: TicketRead) => {
      const res = await execDelete(deleteTicketTrigger, ticket.id);
      if (!res.success) {
        const appErr = toAppError(res.error, "Errore durante l'eliminazione");
        console.error(appErr.message);
        throw new Error(appErr.message);
      }
      refetch();
    },
    [execDelete, deleteTicketTrigger, refetch]
  );

  const handleClose = useCallback(
    async (data: CloseTicketData) => {
      const res = await execUpdate(updateTicketTrigger, {
        id: data.id,
        data: {
          status: 2,
          close_Description: data.close_Description || "",
          guarantee_status: [
            ...(data.guanratee_status ? ["in_garanzia"] : []),
            ...(data.guanratee_status ? ["fuori_garanzia"] : []),
          ],
          /*  extra: [
            ...(data.machine_retrival ? ["Ripristino macchina"] : []),
            ...(data.machine_not_repairable
              ? ["Macchina non riparabile in loco"]
              : []),
          ], */
        },
      });

      if (!res.success) {
        const appErr = toAppError(res.error, "Errore durante la chiusura");
        console.error(appErr.message);
        throw new Error(appErr.message);
      }
      refetch();
    },
    [execUpdate, updateTicketTrigger, refetch]
  );

  const onRefreshClick = useCallback(() => refetch(), [refetch]);

  // Columns + Table config
  const columns = useMemo(
    () =>
      getTicketsColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onClose: handleClose,
      }),
    [handleEdit, handleDelete, handleClose]
  );

  const tableConfig = useMemo(
    () =>
      buildTableConfig(columns, {
        page,
        setPage,
        pageSize,
        setPageSize,
        sortBy,
        sortOrder,
        setSort,
      }),
    [
      buildTableConfig,
      columns,
      page,
      setPage,
      pageSize,
      setPageSize,
      sortBy,
      sortOrder,
      setSort,
    ]
  );

  const filtersConfig = useMemo(
    () => createTicketsFilterConfig({ filters, setFilter }),
    [filters, setFilter]
  );

  return (
    <div className={styles["tickets-list-page"]}>
      <SectionHeaderComponent
        title="Tickets"
        subTitle={`Gestisci i tickets (${meta?.total ?? 0} totali)`}
        buttons={ticketListHeaderBtns(onRefreshClick, RefreshCw, isLoading)}
      />

      <div className={styles["tickets-list-page__filters"]}>
        <SectionFilterComponent
          isLoading={isLoading}
          filters={filtersConfig}
          onResetFilters={resetAll}
        />
      </div>

      <TicketsSummaryBar tickets={tickets} severityResolver={resolver} />

      <Divider />

      <div className={styles["tickets-list-page__table-wrapper"]}>
        <GenericTableWithLogic config={tableConfig} />
      </div>
    </div>
  );
};
