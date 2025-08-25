import { createSlice } from '@reduxjs/toolkit';
import type { CollapseState } from '../ui.types';

const initialState: CollapseState = {
  items: {},
  activeGroup: undefined,
  isLoading: false,
  error: null,
};

const collapseSlice = createSlice({
  name: 'collapse',
  initialState,
  reducers: {
    registerCollapse: (state, action) => {
      const { id, autoClose = false } = action.payload;
      state.items[id] = { id, isOpen: false, autoClose };
      state.error = null;
    },

    unregisterCollapse: (state, action) => {
      const id = action.payload;
      delete state.items[id];
    },

    toggleCollapse: (state, action) => {
      const id = action.payload;
      const item = state.items[id];

      if (!item) return;

      const wasOpen = item.isOpen;

      if (item.autoClose && !wasOpen) {
        Object.values(state.items).forEach(collapse => {
          if (collapse.autoClose && collapse.id !== id) {
            collapse.isOpen = false;
          }
        });
      }

      item.isOpen = !wasOpen;
      state.error = null;
    },

    openCollapse: (state, action) => {
      const id = action.payload;
      const item = state.items[id];

      if (!item) return;

      if (item.autoClose) {
        Object.values(state.items).forEach(collapse => {
          if (collapse.autoClose && collapse.id !== id) {
            collapse.isOpen = false;
          }
        });
      }

      item.isOpen = true;
      state.error = null;
    },

    closeCollapse: (state, action) => {
      const id = action.payload;
      const item = state.items[id];

      if (item) {
        item.isOpen = false;
      }
    },

    closeAllCollapses: (state) => {
      Object.values(state.items).forEach(item => {
        item.isOpen = false;
      });
    },

    setActiveGroup: (state, action) => {
      state.activeGroup = action.payload;
    },

    // Reset completo
    resetCollapseState: () => initialState,
  },
});

export const {
  registerCollapse,
  unregisterCollapse,
  toggleCollapse,
  openCollapse,
  closeCollapse,
  closeAllCollapses,
  setActiveGroup,
  resetCollapseState,
} = collapseSlice.actions;

export default collapseSlice.reducer;