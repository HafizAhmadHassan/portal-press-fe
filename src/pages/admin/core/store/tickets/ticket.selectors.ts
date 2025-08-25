import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store';


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
export const selectTicketsPagination = createSelector(
  [selectTicketsState],
  (s) => s.pagination
);
