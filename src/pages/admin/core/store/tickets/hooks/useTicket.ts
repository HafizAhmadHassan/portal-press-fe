// src/hooks/useTickets.ts
import {
  useGetTicketsQuery,
  type TicketWithDevice,
} from "@store_admin/tickets/ticket.api";
import {
  createNewTicket,
  updateExistingTicket,
  deleteExistingTicket,
  performBulkTicketAction,
} from "@root/pages/admin/core/store/tickets/ticket.actions";
import type { TicketsQueryParams } from "@store_admin/tickets/ticket.types";

export const useTickets = (params: TicketsQueryParams) => {
  const {
    data: paginated,
    isLoading,
    error,
    refetch,
  } = useGetTicketsQuery(params);

  return {
    tickets: paginated?.data ?? ([] as TicketWithDevice[]),
    meta: paginated?.meta,
    isLoading,
    error,
    refetch,
    createNewTicket,
    updateExistingTicket,
    deleteExistingTicket,
    performBulkTicketAction,
  };
};
