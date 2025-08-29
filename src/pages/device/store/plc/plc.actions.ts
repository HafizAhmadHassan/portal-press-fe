// @store_device/plc/plc.actions.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { plcApi } from "./plc.api";
import { setItems, setPagination, setLoading, setError } from "./plc.slice";
import type { PlcQueryParams, PlcItem } from "./plc.types";
import type { RootState } from "@root/store";

// Action per caricare la lista PLC con filtri e paginazione
export const loadPlc = createAsyncThunk<
  void,
  PlcQueryParams | void,
  { state: RootState }
>("plc/load", async (customParams, { getState, dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));

    const state = getState();
    const { filters, pagination } = state.plc;

    // Merge parametri custom con stato corrente
    const queryParams: PlcQueryParams = {
      page: pagination.page,
      page_size: pagination.limit,
      search: filters.search,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
      ...customParams,
    };

    const response = await dispatch(
      plcApi.endpoints.getPlc.initiate(queryParams)
    ).unwrap();

    // Aggiorna items nello stato
    dispatch(setItems(response.data ?? []));

    // Aggiorna paginazione se presente nei meta
    if (response?.meta) {
      const meta = response.meta;
      dispatch(
        setPagination({
          page: meta.page,
          limit: meta.page_size,
          total: meta.total,
          totalPages: meta.total_pages,
        })
      );
    }

    dispatch(setLoading(false));
  } catch (error: any) {
    const errorMessage = error?.data?.message || "Errore nel caricamento PLC";
    dispatch(setError(errorMessage));
    return rejectWithValue(errorMessage);
  }
});

// Action per creare un nuovo PLC
export const createNewPlc = createAsyncThunk<
  PlcItem,
  Partial<PlcItem>,
  { state: RootState }
>("plc/create", async (data, { dispatch, rejectWithValue }) => {
  try {
    const created = await dispatch(
      plcApi.endpoints.createPlc.initiate(data)
    ).unwrap();

    // Ricarica la lista dopo la creazione
    await dispatch(loadPlc());

    return created;
  } catch (error: any) {
    const errorMessage = error?.data?.message || "Errore nella creazione PLC";
    return rejectWithValue(errorMessage);
  }
});

// Action per aggiornare un PLC esistente
export const updateExistingPlc = createAsyncThunk<
  PlcItem,
  { id: number; data: Partial<PlcItem> },
  { state: RootState }
>("plc/update", async (payload, { dispatch, rejectWithValue }) => {
  try {
    const updated = await dispatch(
      plcApi.endpoints.updatePlc.initiate(payload)
    ).unwrap();

    return updated;
  } catch (error: any) {
    const errorMessage =
      error?.data?.message || "Errore nell'aggiornamento PLC";
    return rejectWithValue(errorMessage);
  }
});

// Action per eliminare un PLC
export const deleteExistingPlc = createAsyncThunk<
  number,
  number,
  { state: RootState }
>("plc/delete", async (id, { dispatch, rejectWithValue }) => {
  try {
    await dispatch(plcApi.endpoints.deletePlc.initiate(id)).unwrap();

    // Ricarica la lista dopo l'eliminazione
    await dispatch(loadPlc());

    return id;
  } catch (error: any) {
    const errorMessage = error?.data?.message || "Errore nell'eliminazione PLC";
    return rejectWithValue(errorMessage);
  }
});

// Action per operazioni bulk
export const performBulkPlc = createAsyncThunk<any, any, { state: RootState }>(
  "plc/bulk",
  async (request, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(
        plcApi.endpoints.bulkPlc.initiate(request)
      ).unwrap();

      // Ricarica la lista dopo le operazioni bulk
      await dispatch(loadPlc());

      return result;
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Errore nelle operazioni bulk PLC";
      return rejectWithValue(errorMessage);
    }
  }
);

// Action per ricerca PLC
export const searchPlc = createAsyncThunk<
  PlcItem[],
  { query: string; limit?: number },
  { state: RootState }
>("plc/search", async (params, { dispatch, rejectWithValue }) => {
  try {
    const results = await dispatch(
      plcApi.endpoints.searchPlc.initiate(params)
    ).unwrap();

    return results;
  } catch (error: any) {
    const errorMessage = error?.data?.message || "Errore nella ricerca PLC";
    return rejectWithValue(errorMessage);
  }
});

// Action per refresh dei dati
export const refreshPlcData = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("plc/refresh", async (_, { dispatch, getState }) => {
  const state = getState();
  const currentFilters = state.plc.filters;
  const currentPagination = state.plc.pagination;

  await dispatch(
    loadPlc({
      page: currentPagination.page,
      page_size: currentPagination.limit,
      search: currentFilters.search,
      sortBy: currentFilters.sortBy,
      sortOrder: currentFilters.sortOrder,
    })
  );
});
