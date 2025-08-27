import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";
import type {
  TicketsQueryParams,
  CreateTicketRequest, // alias a MessageCreate
  UpdateTicketRequest,
  BulkActionRequest,
} from "./ticket.types";
import { ticketsApi } from "./ticket.api";
import {
  setTickets,
  setAllTickets,
  setPagination,
  setLoading,
  setLoadingAll,
  setError,
} from "./ticket.slice";

export const loadTickets = createAsyncThunk(
  "tickets/load",
  async (
    params: Partial<TicketsQueryParams> = {},
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const { filters: currentFilters, pagination: currentPagination } =
        state.tickets;
      const query: TicketsQueryParams = {
        page: params.page ?? currentPagination.page,
        page_size: params.page_size ?? currentPagination.limit,
        ...currentFilters,
        ...params,
      };

      dispatch(setLoading(true));
      const response = await dispatch(
        ticketsApi.endpoints.getTickets.initiate(query)
      ).unwrap();

      dispatch(setTickets(response.data));
      if (response.meta) dispatch(setPagination(response.meta));
      return response;
    } catch (error: any) {
      dispatch(setError(error.data?.message || error.message));
      return rejectWithValue(error.data?.message);
    }
  }
);

export const loadAllTickets = createAsyncThunk(
  "tickets/loadAll",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoadingAll(true));
      const all = await dispatch(
        ticketsApi.endpoints.getAllTickets.initiate()
      ).unwrap();
      dispatch(setAllTickets(all));
      return all;
    } catch (error: any) {
      dispatch(setError(error.data?.message || error.message));
      return rejectWithValue(error.data?.message);
    }
  }
);

export const createNewTicket = createAsyncThunk(
  "tickets/create",
  async (ticketData: CreateTicketRequest, { dispatch, rejectWithValue }) => {
    try {
      const created = await dispatch(
        ticketsApi.endpoints.createTicket.initiate(ticketData)
      ).unwrap();
      await dispatch(loadTickets());
      await dispatch(loadAllTickets());
      return created;
    } catch (error: any) {
      const msg =
        error.data?.message || error.message || "Errore nella creazione ticket";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

export const updateExistingTicket = createAsyncThunk(
  "tickets/update",
  async (
    updateData: UpdateTicketRequest & { id: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const updated = await dispatch(
        ticketsApi.endpoints.updateTicket.initiate(updateData)
      ).unwrap();
      await dispatch(loadTickets());
      await dispatch(loadAllTickets());
      return updated;
    } catch (error: any) {
      const msg =
        error.data?.message ||
        error.message ||
        "Errore nell'aggiornamento ticket";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

export const deleteExistingTicket = createAsyncThunk(
  "tickets/delete",
  async (ticketId: string, { dispatch, rejectWithValue }) => {
    try {
      await dispatch(
        ticketsApi.endpoints.deleteTicket.initiate(ticketId)
      ).unwrap();
      await dispatch(loadTickets());
      await dispatch(loadAllTickets());
      return ticketId;
    } catch (error: any) {
      const msg =
        error.data?.message ||
        error.message ||
        "Errore nell'eliminazione ticket";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

export const performBulkTicketAction = createAsyncThunk(
  "tickets/bulkAction",
  async (request: BulkActionRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        ticketsApi.endpoints.bulkTickets.initiate(request)
      ).unwrap();
      await dispatch(loadTickets());
      await dispatch(loadAllTickets());
      return {
        ...response,
        action: request.action,
        affectedTicketIds: request.ticketIds,
      };
    } catch (error: any) {
      const msg =
        error.data?.message || error.message || "Errore nell'operazione bulk";
      dispatch(setError(msg));
      return rejectWithValue(msg);
    }
  }
);

export const changeTicketPage = createAsyncThunk(
  "tickets/changePage",
  async (page: number, { dispatch, rejectWithValue }) => {
    try {
      const resp = await dispatch(loadTickets({ page })).unwrap();
      return resp;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore cambio pagina tickets"
      );
    }
  }
);

export const changeTicketPageSize = createAsyncThunk(
  "tickets/changePageSize",
  async (pageSize: number, { dispatch, rejectWithValue }) => {
    try {
      const resp = await dispatch(
        loadTickets({ page_size: pageSize, page: 1 })
      ).unwrap();
      return resp;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore cambio dimensione pagina tickets"
      );
    }
  }
);

export const applyTicketFilters = createAsyncThunk(
  "tickets/applyFilters",
  async (
    filters: Partial<TicketsQueryParams>,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const resp = await dispatch(
        loadTickets({ ...filters, page: 1 })
      ).unwrap();
      return resp;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore applicazione filtri tickets"
      );
    }
  }
);

export const resetTicketFilters = createAsyncThunk(
  "tickets/resetFilters",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const resp = await dispatch(loadTickets({ page: 1 })).unwrap();
      return resp;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore reset filtri tickets"
      );
    }
  }
);
