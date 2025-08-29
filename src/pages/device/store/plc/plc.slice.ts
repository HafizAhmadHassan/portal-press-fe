// @store_device/plc/plc.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PlcState, PlcItem, PlcPagination, PlcFilters } from "./plc.types";
import {
  loadPlc,
  createNewPlc,
  updateExistingPlc,
  deleteExistingPlc,
  performBulkPlc,
} from "./plc.actions";

const initialState: PlcState = {
  items: [],
  selected: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: "",
    sortBy: "codice",
    sortOrder: "asc",
    codice: "",
    municipility: "",
    customer: "",
    waste: "",
  },
};

export const plcSlice = createSlice({
  name: "plc",
  initialState,
  reducers: {
    // Gestione items
    setItems: (state, action: PayloadAction<PlcItem[]>) => {
      state.items = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Gestione selezione
    setSelected: (state, action: PayloadAction<PlcItem | null>) => {
      state.selected = action.payload;
    },

    // Gestione paginazione
    setPagination: (state, action: PayloadAction<PlcPagination>) => {
      state.pagination = action.payload;
    },

    updatePagination: (
      state,
      action: PayloadAction<Partial<PlcPagination>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },

    // Gestione filtri
    setFilters: (state, action: PayloadAction<Partial<PlcFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset paginazione quando cambiano i filtri
      state.pagination.page = 1;
    },

    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },

    // Gestione stati
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Reset completo
    resetState: () => initialState,

    // Aggiornamento ottimistico di un singolo item
    updateItemOptimistic: (
      state,
      action: PayloadAction<{ id: number; data: Partial<PlcItem> }>
    ) => {
      const { id, data } = action.payload;
      const itemIndex = state.items.findIndex(
        (item) =>
          item.plc_data.id === id ||
          item.plc_io.id === id ||
          item.plc_status.id === id
      );

      if (itemIndex !== -1) {
        state.items[itemIndex] = { ...state.items[itemIndex], ...data };
      }
    },

    // Rimozione ottimistica di un item
    removeItemOptimistic: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.items = state.items.filter(
        (item) =>
          item.plc_data.id !== id &&
          item.plc_io.id !== id &&
          item.plc_status.id !== id
      );
    },
  },

  extraReducers: (builder) => {
    // Load PLC
    builder
      .addCase(loadPlc.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadPlc.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loadPlc.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create PLC
    builder
      .addCase(createNewPlc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewPlc.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createNewPlc.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update PLC
    builder
      .addCase(updateExistingPlc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateExistingPlc.fulfilled, (state, action) => {
        state.isLoading = false;
        // Aggiorna anche selected se corrisponde
        if (
          state.selected &&
          (state.selected.plc_data.id === action.payload.plc_data.id ||
            state.selected.plc_io.id === action.payload.plc_io.id ||
            state.selected.plc_status.id === action.payload.plc_status.id)
        ) {
          state.selected = action.payload;
        }
      })
      .addCase(updateExistingPlc.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete PLC
    builder
      .addCase(deleteExistingPlc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteExistingPlc.fulfilled, (state, action) => {
        state.isLoading = false;
        // Rimuovi da selected se corrisponde
        if (
          state.selected &&
          (state.selected.plc_data.id === action.payload ||
            state.selected.plc_io.id === action.payload ||
            state.selected.plc_status.id === action.payload)
        ) {
          state.selected = null;
        }
      })
      .addCase(deleteExistingPlc.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Bulk operations
    builder
      .addCase(performBulkPlc.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(performBulkPlc.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(performBulkPlc.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setItems,
  setSelected,
  setPagination,
  updatePagination,
  setFilters,
  resetFilters,
  setLoading,
  setError,
  clearError,
  resetState,
  updateItemOptimistic,
  removeItemOptimistic,
} = plcSlice.actions;

export default plcSlice.reducer;
