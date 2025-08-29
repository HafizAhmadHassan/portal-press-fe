import { createSlice } from "@reduxjs/toolkit";

const initialState: any = {
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

export const plcSlice = createSlice({
  name: "plc",
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
      if (action.payload) state.error = null;
    },
    setError: (state, action) => {
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
} = plcSlice.actions;

export default plcSlice.reducer;
