import { createAsyncThunk } from "@reduxjs/toolkit";
import { plcApi } from "./plc.api";
import { setItems, setPagination, setLoading, setError } from "./plc.slice";
import type { PlcQueryParams, PlcItem } from "./plc.types";
import type { RootState } from "@root/store";

/** Carica lista PLC con filtri/paginazione correnti (o custom) */
export const loadPlc = createAsyncThunk<
  void,
  PlcQueryParams | void,
  { state: RootState }
>("plc/load", async (customParams, { getState, dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));

    const state = getState();
    const { filters, pagination } = state.plc;

    const params: PlcQueryParams = {
      page: pagination.page,
      page_size: pagination.limit,
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      // filtri opzionali
      codice: filters.codice,
      municipility: filters.municipility,
      customer: filters.customer,
      waste: filters.waste,
      ...customParams,
    };

    const res = await dispatch(plcApi.endpoints.get.initiate(params)).unwrap();

    dispatch(setItems(res.data ?? []));

    if (res?.meta) {
      const m = res.meta;
      dispatch(
        setPagination({
          page: m.page,
          limit: m.page_size,
          total: m.total,
          totalPages: m.total_pages,
        })
      );
    }

    dispatch(setLoading(false));
  } catch (error: any) {
    const message = error?.data?.message || "Errore nel caricamento PLC";
    dispatch(setError(message));
    return rejectWithValue(message);
  }
});

/** Crea PLC e ricarica lista */
export const createNewPlc = createAsyncThunk<
  PlcItem,
  Partial<PlcItem>,
  { state: RootState }
>("plc/create", async (data, { dispatch, rejectWithValue }) => {
  try {
    const created = await dispatch(
      plcApi.endpoints.create.initiate(data)
    ).unwrap();
    await dispatch(loadPlc());
    return created;
  } catch (error: any) {
    const message = error?.data?.message || "Errore nella creazione PLC";
    return rejectWithValue(message as string);
  }
});

/** Update PLC (senza refetch globale per sfruttare invalidation/optimistic) */
export const updateExistingPlc = createAsyncThunk<
  PlcItem,
  { id: number; data: Partial<PlcItem> },
  { state: RootState }
>("plc/update", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const updated = await dispatch(
      plcApi.endpoints.update.initiate(payload)
    ).unwrap();
    return updated;
  } catch (error: any) {
    const message = error?.data?.message || "Errore nell'aggiornamento PLC";
    return rejectWithValue(message as string);
  }
});

/** Delete PLC e ricarica lista */
export const deleteExistingPlc = createAsyncThunk<
  number,
  number,
  { state: RootState }
>("plc/delete", async (id, { dispatch, rejectWithValue }) => {
  try {
    await dispatch(plcApi.endpoints.delete.initiate(id)).unwrap();
    await dispatch(loadPlc());
    return id;
  } catch (error: any) {
    const message = error?.data?.message || "Errore nell'eliminazione PLC";
    return rejectWithValue(message as string);
  }
});

/** Ricerca (endpoint dedicato) */
export const searchPlc = createAsyncThunk<
  PlcItem[],
  { query: string; limit?: number },
  { state: RootState }
>("plc/search", async (params, { dispatch, rejectWithValue }) => {
  try {
    const results = await dispatch(
      plcApi.endpoints.search.initiate(params)
    ).unwrap();
    return results;
  } catch (error: any) {
    const message = error?.data?.message || "Errore nella ricerca PLC";
    return rejectWithValue(message as string);
  }
});

/** Refresh list con filtri/paginazione correnti */
export const refreshPlcData = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("plc/refresh", async (_: void, { getState, dispatch }) => {
  const state = getState();
  const { filters, pagination } = state.plc;
  await dispatch(
    loadPlc({
      page: pagination.page,
      page_size: pagination.limit,
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      codice: filters.codice,
      municipility: filters.municipility,
      customer: filters.customer,
      waste: filters.waste,
    })
  );
});
