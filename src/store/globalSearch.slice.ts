import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface GlobalSearchState {
  query: string;
  lastUpdated: number;
  debounceMs: number;
  activeDomains: Record<string, boolean>;
}

const initialState: GlobalSearchState = {
  query: "",
  lastUpdated: 0,
  debounceMs: 550, // increased base debounce
  activeDomains: { devices: true },
};

const globalSearchSlice = createSlice({
  name: "globalSearch",
  initialState,
  reducers: {
    setGlobalSearchQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
      state.lastUpdated = Date.now();
    },
    enableSearchDomain(state, action: PayloadAction<string>) {
      state.activeDomains[action.payload] = true;
    },
    disableSearchDomain(state, action: PayloadAction<string>) {
      state.activeDomains[action.payload] = false;
    },
    setGlobalSearchDebounce(state, action: PayloadAction<number>) {
      state.debounceMs = action.payload;
    },
  },
});

export const {
  setGlobalSearchQuery,
  enableSearchDomain,
  disableSearchDomain,
  setGlobalSearchDebounce,
} = globalSearchSlice.actions;

export default globalSearchSlice.reducer;
