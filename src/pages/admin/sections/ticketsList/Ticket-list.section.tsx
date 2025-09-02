// TicketsListSections.tsx - VERSIONE COMPLETA con creazione ticket
import { RefreshCw, Plus } from "lucide-react";
import { useCrud } from "@hooks/useCrud";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toAppError } from "@root/utils/errorHandling";
import { Divider } from "@shared/divider/Divider.component";
import { useListController } from "@hooks/useListController";
import styles from "./TicketsListSection.module.scss";
import ticketListHeaderBtns from "./_config/ticketListHeaderBtns";
import { getTicketsColumns } from "./_config/ticketsTableConfig";
import type {
  TicketRead,
  MessageCreate,
} from "@store_admin/tickets/ticket.types";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";
import type { Device } from "@store_admin/devices/devices.types";

import {
  createTicketsFilterConfig,
  TicketFields,
} from "./_config/ticketsFilterConfig";
import {
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useGetTicketsQuery,
  useCreateTicketMutation, // ← AGGIUNTO!
} from "@store_admin/tickets/ticket.api";
import { resolver } from "@root/utils/severityResolver";
import { TicketsSummaryBar } from "./_components/TicketsSummaryBar";
import type { CloseTicketData } from "./_types/TicketWithDevice.types";
import ModalOpenTicket from "./_modals/ModalsOpenTicket/ModalOpenTicket.component";
import { useAppSelector } from "../../core/store/store.hooks";
import { selectScopedCustomer } from "../../core/store/scope/scope.selectors";

export const TicketsListSections: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

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
    listHook: useGetTicketsQuery,
    initialFilters: {
      [TicketFields.TITLE]: "",
      [TicketFields.STATUS]: "",
      [TicketFields.PRIORITY]: "",
      [TicketFields.CATEGORY]: "",
      [TicketFields.ASSIGNED_TO]: "",
    },
    initialSort: { sortBy: "date_Time", sortOrder: "desc" },
  });

  const { execUpdate, execDelete, execCreate } = useCrud(); // ← AGGIUNTO execCreate
  const [updateTicketTrigger] = useUpdateTicketMutation();
  const [deleteTicketTrigger] = useDeleteTicketMutation();
  const [createTicketTrigger] = useCreateTicketMutation(); // ← AGGIUNTO!

  // ← NUOVO HANDLER per la creazione
  const handleCreateTicket = useCallback(
    async (ticketData: MessageCreate) => {
      console.log("🚀 Creazione ticket - Dati inviati:", ticketData);

      try {
        const res = await execCreate(createTicketTrigger, ticketData);

        if (!res.success) {
          const appErr = toAppError(
            res.error,
            "Errore durante la creazione del ticket"
          );
          console.error("❌ Errore creazione:", appErr.message);
          throw new Error(appErr.message);
        }

        console.log("✅ Ticket creato con successo:", res.data);
        refetch(); // Ricarica la lista

        return res;
      } catch (error) {
        console.error("❌ Errore nella creazione del ticket:", error);
        throw error;
      }
    },
    [execCreate, createTicketTrigger, refetch]
  );

  // Handlers esistenti
  const handleEdit = useCallback(
    async (ticketData: {
      [key: string]: string | number;
      id: string | number;
    }) => {
      const { id, ...data } = ticketData;
      const res = await execUpdate(updateTicketTrigger, {
        id: typeof id === "string" ? Number(id) : id,
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
      console.log("Chiusura ticket - Dati ricevuti:", data);
      console.log("ID ticket da chiudere:", data.id);

      // Trova il ticket completo per avere tutte le info necessarie
      const ticket = tickets.find((t) => t.id === data.id);
      console.log("Ticket trovato nella lista:", ticket);

      if (!ticket) {
        console.error("Ticket non trovato nella lista locale");
        throw new Error("Ticket non trovato");
      }

      // Costruisci il payload per l'API secondo il formato richiesto
      const apiPayload = {
        guanratee_status: [
          ...(data.inGaranzia ? ["in_garanzia"] : []),
          ...(data.fuoriGaranzia ? ["fuori_garanzia"] : []),
        ],
        status: 2,
        close_Description: data.close_Description || data.note || "",
        machine: ticket.machine || ticket.device?.id || Number(ticket.id),
        customer_Name: ticket?.customer_Name || "",
      };

      console.log("Payload per API PUT:", apiPayload);
      console.log("URL che sarà usato: PUT messages/" + ticket.id + "/");

      try {
        const res = await execUpdate(updateTicketTrigger, {
          id: ticket.id, // USA L'ID DEL TICKET nell'URL
          data: apiPayload,
        });

        if (!res.success) {
          const appErr = toAppError(res.error, "Errore durante la chiusura");
          console.error("Errore chiusura:", appErr.message);
          throw new Error(appErr.message);
        }

        console.log("Ticket chiuso con successo");
        refetch();
      } catch (error) {
        console.error("Errore nella chiusura del ticket:", error);
        console.error(
          "Dettagli errore:",
          error.response?.data || error.message
        );
        throw error;
      }
    },
    [execUpdate, updateTicketTrigger, refetch, tickets]
  );

  const onRefreshClick = useCallback(() => refetch(), [refetch]);

  // ← NUOVO: Handler per aprire il modal di creazione
  const handleOpenCreateModal = useCallback(() => {
    // Per ora usiamo un device fittizio, in un caso reale dovresti
    // selezionare il device da una lista o da un altro componente
    const mockDevice: Device = {
      id: 1,
      machine_Name: "Macchina Test",
      city: "Roma",
      province: "RM",
      customer_Name: "Nome Cliente Test",
      // ... altre proprietà necessarie
    } as Device;

    setSelectedDevice(mockDevice);
  }, []);

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

  // ← AGGIUNTO: Bottoni header con "Nuovo Ticket"
  const headerButtons = useMemo(
    () => [
      ...ticketListHeaderBtns(onRefreshClick, RefreshCw, isLoading),
      {
        label: "Nuovo Ticket",
        icon: Plus,
        onClick: handleOpenCreateModal,
        variant: "primary",
        size: "md",
      },
    ],
    [onRefreshClick, isLoading, handleOpenCreateModal]
  );

  // 🔗 cliente scelto in header
  const scopedCustomer = useAppSelector(selectScopedCustomer);
  // 🔁 quando cambia il cliente: reset ricerca e refetch
  useEffect(() => {
    refetch();
  }, [scopedCustomer, refetch]);

  return (
    <div className={styles["tickets-list-page"]}>
      <SectionHeaderComponent
        title="Tickets"
        subTitle={`Gestisci i tickets (${meta?.total ?? 0} totali)`}
        buttons={headerButtons} // ← USATO headerButtons invece di ticketListHeaderBtns
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

      {/* ← AGGIUNTO: Modal per creare nuovo ticket */}
      {selectedDevice && (
        <ModalOpenTicket
          device={selectedDevice}
          onSave={handleCreateTicket}
          onClose={() => setSelectedDevice(null)} // ← Chiudi il modal
        />
      )}
    </div>
  );
};
