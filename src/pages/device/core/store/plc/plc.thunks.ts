import { createAsyncThunk } from "@reduxjs/toolkit";
import { plcApi } from "./plc.api";
import { setItems, setPagination } from "./plc.slice";

export const loadPlc = createAsyncThunk<any, void>(
  "plc/load",
  async (_: void, { getState, dispatch, rejectWithValue }) => {
    try {
      const state: any = getState();
      const { filters, pagination } = state.plc;

      const query: any = {
        page: pagination.page,
        page_size: pagination.limit,
        codice: filters.codice,
        municipility: filters.municipility,
        customer: filters.customer,
        waste: filters.waste,
        search: filters.search,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
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
  async (id: number | number, { dispatch, rejectWithValue }) => {
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
