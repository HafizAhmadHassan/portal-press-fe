import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TicketRead } from "./ticket.types";

interface TicketsState {
  tickets: TicketRead[];
  allTickets: TicketRead[];
  selectedTicket: TicketRead | null;
  isLoading: boolean;
  isLoadingAll: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: Record<string, any>;
}

const initialState: TicketsState = {
  tickets: [],
  allTickets: [],
  selectedTicket: null,
  isLoading: false,
  isLoadingAll: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  filters: {},
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setTickets(state, action: PayloadAction<TicketRead[]>) {
      state.tickets = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setAllTickets(state, action: PayloadAction<TicketRead[]>) {
      state.allTickets = action.payload;
      state.isLoadingAll = false;
      state.error = null;
    },
    setSelectedTicket(state, action: PayloadAction<TicketRead | null>) {
      state.selectedTicket = action.payload;
    },
    setPagination(
      state,
      action: PayloadAction<{
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
      }>
    ) {
      const { page, page_size, total, total_pages } = action.payload;
      state.pagination = {
        page,
        limit: page_size,
        total,
        totalPages: total_pages,
      };
    },
    setFilters(state, action: PayloadAction<Partial<TicketsState["filters"]>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },
    setLoadingAll(state, action: PayloadAction<boolean>) {
      state.isLoadingAll = action.payload;
      if (action.payload) state.error = null;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.isLoading = false;
      state.isLoadingAll = false;
    },
    resetTicketsState: () => initialState,
  },
});

export const {
  setTickets,
  setAllTickets,
  setSelectedTicket,
  setPagination,
  setFilters,
  setLoading,
  setLoadingAll,
  setError,
  resetTicketsState,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
