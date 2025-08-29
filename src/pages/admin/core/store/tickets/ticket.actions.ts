// @store_admin/tickets/ticket.thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";

import { ticketsApi } from "./ticket.api";
import {
  setTickets,
  setAllTickets,
  setPagination,
  setLoading,
  setLoadingAll,
  setError,
} from "./ticket.slice";

import type {
  TicketRead,
  TicketsQueryParams,
  ApiResponse,
  BulkActionRequest,
} from "./ticket.types";
import { createCrudThunks } from "../actions.factory";

/** selectors "in-place" (usano lo stato dei tickets) */
const selectFilters = (s: RootState) => s.tickets.filters;
const selectPagination = (s: RootState) => ({
  page: s.tickets.pagination.page,
  page_size: s.tickets.pagination.limit, // mappo limit → page_size
});

/** Mapping stato → params lista */
const mapStateToListParams = (
  filters: ReturnType<typeof selectFilters>,
  pag: ReturnType<typeof selectPagination>,
  custom?: Partial<TicketsQueryParams>
): TicketsQueryParams => ({
  page: pag.page,
  page_size: pag.page_size,
  ...filters,
  ...(custom || {}),
});

/** Estrattore items/meta dalla response */
const extractFromListResponse = (res: ApiResponse<TicketRead> | any) => ({
  items: Array.isArray(res?.data)
    ? (res.data as TicketRead[])
    : Array.isArray(res)
    ? (res as TicketRead[])
    : [],
  meta: res?.meta,
});

/** Thunks CRUD generati */
const { load, refresh, create, update, remove } = createCrudThunks<
  RootState,
  TicketRead,
  TicketsQueryParams
>({
  api: ticketsApi as any,
  endpointKeys: {
    list: "getTickets",
    create: "createTicket",
    update: "updateTicket",
    delete: "deleteTicket",
  },
  sliceActions: {
    setItems: (payload) => setTickets(payload),
    setPagination: (payload) => setPagination(payload as any),
    setLoading: (payload) => setLoading(payload),
    setError: (payload) => setError(payload),
  },
  selectors: {
    selectFilters,
    selectPagination,
  },
  mapStateToListParams,
  extractFromListResponse,
});

export const loadTickets = load; // (params?) => dispatch(loadTickets(params))
export const refreshTickets = refresh;
export const createNewTicket = create; // (data)
export const updateExistingTicket = update; // ({ id, data })
export const deleteExistingTicket = remove; // (id)

/** EXTRA: tutti i ticket */
export const loadAllTickets = createAsyncThunk<any, void, { state: RootState }>(
  "tickets/loadAll",
  async (_: void, { dispatch, rejectWithValue }) => {
    try {
      setLoadingAll(true);
      const all = await dispatch(
        ticketsApi.endpoints.getAllTickets.initiate()
      ).unwrap();
      dispatch(setAllTickets(all));
      setLoadingAll(false);
      return all;
    } catch (error: any) {
      const msg =
        error?.data?.message ||
        error?.message ||
        "Errore caricamento tutti i ticket";
      dispatch(setError(msg));
      setLoadingAll(false);
      return rejectWithValue(msg);
    }
  }
);

/** EXTRA: bulk */
export const performBulkTicketAction = createAsyncThunk<
  any,
  BulkActionRequest,
  { state: RootState }
>("tickets/bulk", async (request, { dispatch, rejectWithValue }) => {
  try {
    const res = await dispatch(
      ticketsApi.endpoints.bulkTickets.initiate(request)
    ).unwrap();
    await dispatch(load()); // ricarica lista paginata corrente
    await dispatch(loadAllTickets());
    return {
      ...res,
      action: request.action,
      affectedTicketIds: request.ticketIds,
    };
  } catch (error: any) {
    const msg =
      error?.data?.message || error?.message || "Errore operazione bulk";
    dispatch(setError(msg));
    return rejectWithValue(msg);
  }
});
