import React, { useCallback, useEffect, useMemo } from "react";
import { useListQueryParams } from "@hooks/useListQueryParams";
import { createTicketsTableConfig } from "./_config/ticketsTableConfig";
import {
  createTicketsFilterConfig,
  TicketFields,
} from "./_config/ticketsFilterConfig";
import styles from "./_styles/TicketsListSection.module.scss";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { usePagination } from "@hooks/usePagination.ts";
import { useTicketsWithDevices } from "@store_admin/tickets/hooks/useTicketWithDevices";
import { Divider } from "@shared/divider/Divider.component.tsx";
import { useUpdateTicketMutation } from "@store_admin/tickets/ticket.api";
import type { TicketRead } from "@store_admin/tickets/ticket.types";
import { useAppSelector } from "../../core/store/store.hooks";
import { selectScopedCustomer } from "../../core/store/scope/scope.selectors";

export const TicketsListSections: React.FC = () => {
  const scopedCustomer = useAppSelector(selectScopedCustomer);
  // ✅ Query params management
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
      [TicketFields.TITLE]: "",
      [TicketFields.STATUS]: "",
      [TicketFields.PRIORITY]: "",
      [TicketFields.CATEGORY]: "",
      [TicketFields.ASSIGNED_TO]: "",
    },
  });

  // ✅ Build query params for API call
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

  // ✅ API calls con device join
  const {
    tickets,
    meta,
    isLoading,
    error,
    refetch,
    createNewTicket,
    updateExistingTicket,
    deleteExistingTicket,
  } = useTicketsWithDevices(queryParams);

  // ✅ Mutation diretta per UPDATE
  const [updateTicket] = useUpdateTicketMutation();

  // ✅ Pagination management (unica istanza)
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

  // ✅ Reset handler unificato
  const handleResetAll = () => {
    resetAll();
    pagination.resetPagination();
    refetch();
  };

  // ✅ CRUD operations base
  const handleCreate = useCallback(
    async (data) => {
      const created =
        (await (createNewTicket as any)(data).unwrap?.()) ??
        (await (createNewTicket as any)(data));
      refetch();
      return created;
    },
    [createNewTicket, refetch]
  );

  const handleEdit = useCallback(
    async ({ id, ...rest }) => {
      const updated =
        (await (updateExistingTicket as any)({ id, data: rest }).unwrap?.()) ??
        (await (updateExistingTicket as any)({ id, data: rest }));
      refetch();
      return updated;
    },
    [updateExistingTicket, refetch]
  );

  const handleDelete = useCallback(
    async (ticket: TicketRead) => {
      if (window.confirm(`Confermi eliminazione ticket #${ticket.id}?`)) {
        await ((deleteExistingTicket as any)(ticket.id).unwrap?.() ??
          (deleteExistingTicket as any)(ticket.id));
        refetch();
      }
    },
    [deleteExistingTicket, refetch]
  );

  // ✅ CLOSE ticket con il body richiesto per la chiusura
  const handleClose = useCallback(
    async (data: {
      ticketId: number | string;
      note?: string;
      inGaranzia?: boolean;
      fuoriGaranzia?: boolean;
      machine_retrival?: boolean;
      machine_not_repairable?: boolean;
    }) => {
      // 1) Recupero il ticket corrente per ottenere machine & customer
      const t = tickets?.find((x) => String(x.id) === String(data.ticketId)) as
        | (TicketRead & { device?: any })
        | undefined;
      if (!t) {
        alert("Ticket non trovato per la chiusura.");
        throw new Error("Ticket not found");
      }

      const machineId = (t as any).machine ?? (t as any).device_id;
      const customer =
        t?.device?.customer ??
        t?.device?.customer_Name ??
        (t as any).customer ??
        "";

      if (!machineId) {
        alert("ID macchina non disponibile per la chiusura.");
        throw new Error("Machine id missing");
      }
      if (!customer) {
        alert("Customer non disponibile per la chiusura.");
        throw new Error("Customer missing");
      }

      // 2) Mappo guanratee_status
      const guanratee_status: string[] = [];
      if (data.inGaranzia) guanratee_status.push("in_garanzia");
      if (data.fuoriGaranzia) guanratee_status.push("fuori_garanzia");

      // 3) Compongo la close_Description
      const extra: string[] = [];
      if (data.machine_retrival) extra.push("Ripristino macchina");
      if (data.machine_not_repairable)
        extra.push("Macchina non riparabile in loco");
      const close_Description = [data.note?.trim() || "", ...extra]
        .filter(Boolean)
        .join("\n• ");

      // 4) Payload finale richiesto
      const payload = {
        guanratee_status,
        status: 2, // numerico, obbligatorio per chiusura
        close_Description,
        machine: Number(machineId),
        customer,
      };

      // 5) Invio con la mutation esistente (PUT tickets/:id/) — se il tuo backend usa endpoint diverso, cambia qui.
      const updated = await updateTicket({
        id: String(data.ticketId),
        data: payload as any,
      }).unwrap();

      await refetch();
      return updated;
    },
    [tickets, updateTicket, refetch]
  );

  // ✅ Table configuration
  const tableConfig = useMemo(
    () =>
      createTicketsTableConfig({
        tickets,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onClose: handleClose, // ← handler per chiusura (quando status ≠ 2)
        isLoading,
        sortBy,
        sortOrder,
        onSort: setSort,
        pagination: {
          enabled: true,
          currentPage: meta?.page ?? page,
          pageSize,
          totalPages: meta?.total_pages ?? 1,
          totalItems: meta?.total ?? 0,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          hasNext: meta?.has_next,
          hasPrev: meta?.has_prev,
        },
      }),
    [
      tickets,
      handleEdit,
      handleDelete,
      handleClose,
      isLoading,
      sortBy,
      sortOrder,
      setSort,
      meta,
      page,
      pageSize,
      setPage,
      setPageSize,
    ]
  );

  // 🔁 Quando cambia il cliente scelto in header:
  // - resetta paginazione
  // - rifai la fetch degli utenti
  useEffect(() => {
    setPage(1);
    refetch();
  }, [scopedCustomer]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles["tickets-list-page"]}>
      <SectionHeaderComponent
        title="Tickets"
        subTitle={`Gestisci i tickets (${meta?.total ?? 0} totali)`}
      />

      <div className={styles["tickets-list-page__filters"]}>
        <SectionFilterComponent
          filters={createTicketsFilterConfig({ filters, setFilter })}
          onResetFilters={handleResetAll}
          // isLoading={isLoading}
        />
      </div>

      <Divider />

      <div className={styles["tickets-list-page__table-wrapper"]}>
        <GenericTableWithLogic
          config={tableConfig}
          // loading={isLoading}
          pagination={{
            page: meta?.page ?? page,
            pageSize,
            total: meta?.total ?? 0,
            totalPages: meta?.total_pages ?? 1,
          }}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
};
