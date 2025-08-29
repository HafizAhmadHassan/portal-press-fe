// Types (separati nel tuo file ticket.types)
export type {
  TicketsQueryParams,
  CreateTicketRequest,
  UpdateTicketRequest,
  BulkActionRequest,
  TicketRead,
} from "./ticket.types";

// RTK Query hooks
export {
  ticketsApi,
  useGetTicketsQuery,
  useGetAllTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useBulkTicketsMutation,
  useGetTicketStatsQuery,
} from "./ticket.api";

// Thunks (factory + custom)
export {
  loadTickets,
  refreshTickets,
  deleteExistingTicket,
  createNewTicket,
  updateExistingTicket,
  loadAllTickets,
  performBulkTicketAction,
} from "./ticket.actions";

// Slice actions
export {
  setTickets,
  setAllTickets,
  setSelectedTicket,
  setPagination,
  setFilters,
  setLoading,
  setLoadingAll,
  setError,
  resetTicketsState,
} from "./ticket.slice";

// Selectors
export {
  selectTickets,
  selectAllTickets,
  selectSelectedTicket,
  selectTicketsLoading,
  selectAllTicketsLoading,
  selectTicketsError,
  selectTicketsPagination,
  selectTicketsFilters,
  selectTicketsPaginationApi,
} from "./ticket.selectors";

// Reducer
export { default as ticketsReducer } from "./ticket.slice";
