import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";

const selectTicketsState = (state: RootState) => state.tickets;

export const selectTickets = createSelector(
  [selectTicketsState],
  (s) => s.tickets
);
export const selectAllTickets = createSelector(
  [selectTicketsState],
  (s) => s.allTickets
);
export const selectSelectedTicket = createSelector(
  [selectTicketsState],
  (s) => s.selectedTicket
);
export const selectTicketsLoading = createSelector(
  [selectTicketsState],
  (s) => s.isLoading
);
export const selectAllTicketsLoading = createSelector(
  [selectTicketsState],
  (s) => s.isLoadingAll
);
export const selectTicketsError = createSelector(
  [selectTicketsState],
  (s) => s.error
);

/** Pagina per UI (page + limit) */
export const selectTicketsPagination = createSelector(
  [selectTicketsState],
  (s) => s.pagination
);

/** 🔹 Filtri (per factory) */
export const selectTicketsFilters = createSelector(
  [selectTicketsState],
  (s) => s.filters
);

/** 🔹 Paginazione in forma { page, page_size } (per factory) */
export const selectTicketsPaginationApi = createSelector(
  [selectTicketsState],
  (s) => ({ page: s.pagination.page, page_size: s.pagination.limit })
);
