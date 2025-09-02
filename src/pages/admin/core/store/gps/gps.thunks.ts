// @store_admin/gps/gps.thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";
import { gpsApi } from "./gps.api";
import type {
  GpsQueryParams,
  CreateGpsRequest,
  UpdateGpsRequest,
  BulkActionRequest,
} from "./gps.types";
import { setItems, setPagination } from "./gps.slice";

export const loadGps = createAsyncThunk(
  "gps/load",
  async (
    params: Partial<GpsQueryParams> = {},
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const { filters, pagination } = state.gps;

      const query: GpsQueryParams = {
        page: params.page ?? pagination.page,
        page_size: params.page_size ?? pagination.limit,
        codice: params.codice ?? filters.codice,
        municipility: params.municipility ?? filters.municipility,
        customer_Name: params.customer_Name ?? filters.customer_Name,
        waste: params.waste ?? filters.waste,
        search: params.search ?? filters.search,
        sortBy: params.sortBy ?? filters.sortBy,
        sortOrder: params.sortOrder ?? filters.sortOrder,
      };

      const res = await dispatch(
        gpsApi.endpoints.getGps.initiate(query)
      ).unwrap();

      dispatch(setItems(Array.isArray(res) ? res : res.data ?? []));

      if ((res as any).meta) {
        const m = (res as any).meta;
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
      return rejectWithValue(e?.data?.message || "Errore nel caricamento GPS");
    }
  }
);

export const createNewGps = createAsyncThunk(
  "gps/create",
  async (data: CreateGpsRequest, { dispatch, rejectWithValue }) => {
    try {
      const created = await dispatch(
        gpsApi.endpoints.createGps.initiate(data)
      ).unwrap();
      await dispatch(loadGps({}));

      return created;
    } catch (e: any) {
      return rejectWithValue(e?.data?.message || "Errore creazione GPS");
    }
  }
);

export const updateExistingGps = createAsyncThunk(
  "gps/update",
  async (p: UpdateGpsRequest, { dispatch, rejectWithValue }) => {
    try {
      const updated = await dispatch(
        gpsApi.endpoints.updateGps.initiate(p)
      ).unwrap();
      return updated;
    } catch (e: any) {
      return rejectWithValue(e?.data?.message || "Errore aggiornamento GPS");
    }
  }
);

export const deleteExistingGps = createAsyncThunk(
  "gps/delete",
  async (id: number | number, { dispatch, rejectWithValue }) => {
    try {
      await dispatch(gpsApi.endpoints.deleteGps.initiate(id)).unwrap();
      await dispatch(loadGps({}));

      return id;
    } catch (e: any) {
      return rejectWithValue(e?.data?.message || "Errore eliminazione GPS");
    }
  }
);

export const performBulkGps = createAsyncThunk(
  "gps/bulk",
  async (req: BulkActionRequest, { dispatch, rejectWithValue }) => {
    try {
      const res = await dispatch(
        gpsApi.endpoints.bulkGps.initiate(req)
      ).unwrap();
      await dispatch(loadGps({}));

      return res;
    } catch (e: any) {
      return rejectWithValue(e?.data?.message || "Errore bulk GPS");
    }
  }
);
