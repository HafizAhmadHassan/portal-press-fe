import { createAsyncThunk } from "@reduxjs/toolkit";
import { plcApi } from "./plc.api";
import { setItems, setPagination } from "./plc.slice";

export const loadPlc = createAsyncThunk(
  "plc/load",
  async (params: any = {}, { getState, dispatch, rejectWithValue }) => {
    try {
      const state: any = getState();
      const { filters, pagination } = state.plc;

      const query: any = {
        page: params.page ?? pagination.page,
        page_size: params.page_size ?? pagination.limit,
        codice: params.codice ?? filters.codice,
        municipility: params.municipility ?? filters.municipility,
        customer: params.customer ?? filters.customer,
        waste: params.waste ?? filters.waste,
        search: params.search ?? filters.search,
        sortBy: params.sortBy ?? filters.sortBy,
        sortOrder: params.sortOrder ?? filters.sortOrder,
      };

      const res: any = await dispatch(
        plcApi.endpoints.getPlc.initiate(query)
      ).unwrap();

      dispatch(setItems(res.data ?? res));

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

      return res;
    } catch (e: any) {
      return rejectWithValue(e?.data?.message || "Errore nel caricamento PLC");
    }
  }
);

export const createNewPlc = createAsyncThunk(
  "plc/create",
  async (data: any, { dispatch, rejectWithValue }) => {
    try {
      const created = await dispatch(
        plcApi.endpoints.createPlc.initiate(data)
      ).unwrap();
      await dispatch(loadPlc());
      return created;
    } catch (e: any) {
      return rejectWithValue(e?.data?.message || "Errore creazione PLC");
    }
  }
);

export const updateExistingPlc = createAsyncThunk(
  "plc/update",
  async (p: any, { dispatch, rejectWithValue }) => {
    try {
      const updated = await dispatch(
        plcApi.endpoints.updatePlc.initiate(p)
      ).unwrap();
      return updated;
    } catch (e: any) {
      return rejectWithValue(e?.data?.message || "Errore aggiornamento PLC");
    }
  }
);

export const deleteExistingPlc = createAsyncThunk(
  "plc/delete",
  async (id: string | number, { dispatch, rejectWithValue }) => {
    try {
      await dispatch(plcApi.endpoints.deletePlc.initiate(id)).unwrap();
      await dispatch(loadPlc());
      return id;
    } catch (e: any) {
      return rejectWithValue(e?.data?.message || "Errore eliminazione PLC");
    }
  }
);

export const performBulkPlc = createAsyncThunk(
  "plc/bulk",
  async (req: any, { dispatch, rejectWithValue }) => {
    try {
      const res = await dispatch(
        plcApi.endpoints.bulkPlc.initiate(req)
      ).unwrap();
      await dispatch(loadPlc());
      return res;
    } catch (e: any) {
      return rejectWithValue(e?.data?.message || "Errore bulk PLC");
    }
  }
);
