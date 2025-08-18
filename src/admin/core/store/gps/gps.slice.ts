// @store_admin/gps/gps.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GpsDevice, GpsState } from "./gps.types";

const initialState: GpsState = {
  items: [],
  selected: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  filters: {
    codice: "",
    municipility: "",
    customer: "",
    waste: "",
    search: "",
    sortBy: "codice",
    sortOrder: "asc",
  },
};

export const gpsSlice = createSlice({
  name: "gps",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<GpsDevice[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelected: (state, action: PayloadAction<GpsDevice | null>) => {
      state.selected = action.payload;
    },
    setPagination: (
      state,
      action: PayloadAction<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      }>
    ) => {
      state.pagination = action.payload;
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<GpsState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
});

export const {
  setItems,
  setSelected,
  setPagination,
  setFilters,
  resetFilters,
  setLoading,
  setError,
  clearError,
  resetState,
} = gpsSlice.actions;

export default gpsSlice.reducer;
