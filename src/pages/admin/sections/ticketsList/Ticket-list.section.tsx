// TicketsListSections.tsx - VERSIONE COMPLETAMENTE CORRETTA
import React, { useCallback, useMemo, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { toAppError } from "@root/utils/errorHandling";
import { Divider } from "@shared/divider/Divider.component";
import styles from "./_styles/TicketsListSection.module.scss";
import {
  createTicketsFilterConfig,
  TicketFields,
} from "./_config/ticketsFilterConfig";
import { getTicketsColumns } from "./_config/ticketsTableConfig";
import type { TicketRead } from "@store_admin/tickets/ticket.types";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";

// CAMBIA QUESTO: usa il tuo hook personalizzato invece di useGetTicketsQuery
import { useTicketsWithDevices } from "@store_admin/tickets/hooks/useTicketWithDevices";
import {
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} from "@store_admin/tickets/ticket.api";

import { useCrud } from "@hooks/useCrud";
import { useAppSelector } from "../../core/store/store.hooks";
import { selectScopedCustomer } from "../../core/store/scope/scope.selectors";

// RIMUOVI useListController - usa il tuo hook existente
// import { useListController } from "@hooks/useListController";

// Tipo per i dati di chiusura ticket
export type CloseTicketData = {
  ticketId: number;
  date?: Date;
  note?: string;
  info?: string;
  address?: string;
  inGaranzia?: boolean;
  fuoriGaranzia?: boolean;
  machine_retrival?: boolean;
  machine_not_repairable?: boolean;
};

export const TicketsListSections: React.FC = () => {
  const scopedCustomer = useAppSelector(selectScopedCustomer);

  // USA IL TUO HOOK ESISTENTE che già funziona
  const [filters, setFilters] = React.useState({
    [TicketFields.TITLE]: "",
    [TicketFields.STATUS]: "",
    [TicketFields.PRIORITY]: "",
    [TicketFields.CATEGORY]: "",
    [TicketFields.ASSIGNED_TO]: "",
  });

  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [sortBy, setSortBy] = React.useState("date_Time");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");

  // Query params per l'API
  const queryParams = useMemo(
    () => ({
      ...filters,
      sortBy,
      sortOrder,
      page,
      page_size: pageSize,
    }),
    [filters, sortBy, sortOrder, page, pageSize]
  );

  // USA IL TUO HOOK CHE GIÀ FUNZIONA
  const { tickets, meta, isLoading, refetch } =
    useTicketsWithDevices(queryParams);

  // Mutation hooks
  const [updateTicketTrigger] = useUpdateTicketMutation();
  const [deleteTicketTrigger] = useDeleteTicketMutation();
  const { execUpdate, execDelete } = useCrud();

  // Handlers stabili
  const handleEdit = useCallback(
    async (ticketData: { id: number; [key: string]: any }) => {
      const { id, ...data } = ticketData;
      const res = await execUpdate(updateTicketTrigger, {
        id: id,
        data: data as Partial<TicketRead>,
      });
      if (!res.success) {
        const appErr = toAppError(
          res.error,
          "Errore durante la modifica del ticket"
        );
        console.error(appErr.message);
        throw new Error(appErr.message);
      }
      refetch();
    },
    [execUpdate, updateTicketTrigger, refetch]
  );

  const handleDelete = useCallback(
    async (ticket: TicketRead) => {
      if (window.confirm(`Confermi eliminazione ticket #${ticket.id}?`)) {
        const res = await execDelete(deleteTicketTrigger, ticket.id);
        if (!res.success) {
          const appErr = toAppError(
            res.error,
            "Errore durante l'eliminazione del ticket"
          );
          console.error(appErr.message);
          throw new Error(appErr.message);
        }
        refetch();
      }
    },
    [execDelete, deleteTicketTrigger, refetch]
  );

  const handleClose = useCallback(
    async (data: CloseTicketData) => {
      const ticket = tickets?.find(
        (x) => String(x.id) === String(data.ticketId)
      ) as (TicketRead & { device?: any }) | undefined;

      if (!ticket) {
        throw new Error("Ticket non trovato per la chiusura.");
      }

      const machineId = (ticket as any).machine ?? (ticket as any).device_id;
      const customer =
        ticket?.device?.customer ??
        ticket?.device?.customer_Name ??
        (ticket as any).customer ??
        "";

      if (!machineId) {
        throw new Error("ID macchina non disponibile per la chiusura.");
      }
      if (!customer) {
        throw new Error("Customer non disponibile per la chiusura.");
      }

      const guanratee_status: string[] = [];
      if (data.inGaranzia) guanratee_status.push("in_garanzia");
      if (data.fuoriGaranzia) guanratee_status.push("fuori_garanzia");

      const extra: string[] = [];
      if (data.machine_retrival) extra.push("Ripristino macchina");
      if (data.machine_not_repairable)
        extra.push("Macchina non riparabile in loco");
      const close_Description = [data.note?.trim() || "", ...extra]
        .filter(Boolean)
        .join("\n• ");

      const payload = {
        guanratee_status,
        status: 2,
        close_Description,
        machine: Number(machineId),
        customer,
      };

      const res = await execUpdate(updateTicketTrigger, {
        id: data.ticketId,
        data: payload as any,
      });

      if (!res.success) {
        const appErr = toAppError(
          res.error,
          "Errore durante la chiusura del ticket"
        );
        console.error(appErr.message);
        throw new Error(appErr.message);
      }

      refetch();
      return res.data;
    },
    [tickets, execUpdate, updateTicketTrigger, refetch]
  );

  // Funzione setFilter stabile
  const setFilter = useCallback(
    (key: string, value: string | number | boolean | null | undefined) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1); // Reset a pagina 1 quando cambiano i filtri
    },
    []
  );

  // Reset all stabile
  const resetAll = useCallback(() => {
    setFilters({
      [TicketFields.TITLE]: "",
      [TicketFields.STATUS]: "",
      [TicketFields.PRIORITY]: "",
      [TicketFields.CATEGORY]: "",
      [TicketFields.ASSIGNED_TO]: "",
    });
    setSortBy("date_Time");
    setSortOrder("desc");
    setPage(1);
    setPageSize(10);
  }, []);

  const onRefreshClick = useCallback(() => refetch(), [refetch]);

  // Configurazioni memoizzate
  const columns = useMemo(
    () =>
      getTicketsColumns({
        onEdit: handleEdit,
        onDelete: handleDelete,
        onClose: handleClose,
      }),
    [handleEdit, handleDelete, handleClose]
  );

  // Table config manuale (evita buildTableConfig che può causare problemi)
  const tableConfig = useMemo(
    () => ({
      columns,
      data: tickets || [],
      loading: isLoading,
      pagination: {
        enabled: true,
        currentPage: page,
        pageSize,
        totalPages: meta?.total_pages ?? 1,
        totalItems: meta?.total ?? 0,
        onPageChange: setPage,
        onPageSizeChange: setPageSize,
        hasNext: meta?.has_next,
        hasPrev: meta?.has_prev,
        nextPage: meta?.next_page,
        prevPage: meta?.prev_page,
      },
      sorting: {
        enabled: true,
        onSort: (key: string, direction: "asc" | "desc") => {
          setSortBy(key);
          setSortOrder(direction);
        },
      },
      emptyMessage: "Nessun ticket trovato.",
    }),
    [columns, tickets, isLoading, page, pageSize, meta]
  );

  const filtersConfig = useMemo(
    () => createTicketsFilterConfig({ filters, setFilter }),
    [filters, setFilter]
  );

  // Effect per scoped customer - MA SENZA DIPENDENZE CHE CAMBIANO
  useEffect(() => {
    if (scopedCustomer) {
      resetAll();
      // refetch verrà chiamato automaticamente quando cambiano i queryParams
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopedCustomer]);

  return (
    <div className={styles["tickets-list-page"]}>
      <SectionHeaderComponent
        title="Tickets"
        subTitle={`Gestisci i tickets (${meta?.total ?? 0} totali)`}
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
        ]}
      />

      <div className={styles["tickets-list-page__filters"]}>
        <SectionFilterComponent
          isLoading={isLoading}
          filters={filtersConfig}
          onResetFilters={resetAll}
        />
      </div>

      <Divider />

      <div className={styles["tickets-list-page__table-wrapper"]}>
        <GenericTableWithLogic config={tableConfig} />
      </div>
    </div>
  );
};
