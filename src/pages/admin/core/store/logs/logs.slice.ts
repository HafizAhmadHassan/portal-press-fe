// @store_admin/logs/logs.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { LogsState, LogItem } from "./logs.types";

const initialState: LogsState = {
  items: [],
  selected: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
  filters: {
    machine_ip: "",
    code_alarm: "",
    name_alarm: "",
    date_from: "",
    date_to: "",
    search: "",
    sortBy: "date_and_time",
    sortOrder: "desc",
  },
};

export const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<LogItem[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelected: (state, action: PayloadAction<LogItem | null>) => {
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
      action: PayloadAction<Partial<LogsState["filters"]>>
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
} = logsSlice.actions;

export default logsSlice.reducer;
