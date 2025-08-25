import { createSlice } from '@reduxjs/toolkit';
import type { SidebarState } from '../ui.types';

const initialState: SidebarState = {
  // Desktop sidebar
  isCollapsed: false,
  position: 'left',
  accordionDirection: 'down',

  // Mobile sidebar
  isMobileOpen: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    // ========================================
    // DESKTOP SIDEBAR COLLAPSE
    // ========================================
    toggleSidebarCollapse: (state) => {
      state.isCollapsed = !state.isCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.isCollapsed = action.payload;
    },
    collapseSidebar: (state) => {
      state.isCollapsed = true;
    },
    expandSidebar: (state) => {
      state.isCollapsed = false;
    },

    // ========================================
    // MOBILE SIDEBAR
    // ========================================
    toggleMobileSidebar: (state) => {
      state.isMobileOpen = !state.isMobileOpen;
    },
    openMobileSidebar: (state) => {
      state.isMobileOpen = true;
    },
    closeMobileSidebar: (state) => {
      state.isMobileOpen = false;
    },

    // ========================================
    // SETTINGS
    // ========================================
    setSidebarPosition: (state, action) => {
      state.position = action.payload;
    },
    setAccordionDirection: (state, action) => {
      state.accordionDirection = action.payload;
    },

    // ========================================
    // UTILITY
    // ========================================
    closeAllSidebars: (state) => {
      state.isMobileOpen = false;
      // Non resettiamo isCollapsed perché è preferenza utente
    },

    // Reset completo
    resetSidebarState: () => initialState,
  },
});

export const {
  toggleSidebarCollapse,
  setSidebarCollapsed,
  collapseSidebar,
  expandSidebar,
  toggleMobileSidebar,
  openMobileSidebar,
  closeMobileSidebar,
  setSidebarPosition,
  setAccordionDirection,
  closeAllSidebars,
  resetSidebarState,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;