// @store_admin/scope/scope.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ScopeState = { customer: string | null };

const initialState: ScopeState = { customer: null };

const scopeSlice = createSlice({
  name: "scope",
  initialState,
  reducers: {
    setCustomer(state, action: PayloadAction<string | null>) {
      const v = (action.payload || "").trim();
      state.customer = v || null;
    },
    clearCustomer(state) {
      state.customer = null;
    },
  },
});

export const { setCustomer, clearCustomer } = scopeSlice.actions;
export default scopeSlice.reducer;
