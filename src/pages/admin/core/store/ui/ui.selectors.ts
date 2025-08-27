// src/core/store/ui/ui.selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";
import type { ThemeMode } from "./ui.types";

export const selectUiState = (state: RootState) => state.ui.ui;

export const selectThemeMode = (state: RootState): ThemeMode =>
  state.ui.ui.themeMode;
export const selectIsDark = (state: RootState): boolean => state.ui.ui.isDark;

export const selectEffectiveTheme = createSelector(
  [selectThemeMode, selectIsDark],
  (mode, isDark) => ({
    mode, // 'light' | 'dark' | 'system'
    isDark, // boolean
    resolved: isDark ? "dark" : "light", // comodo per classi/telemetria
  })
);

// ---- Aggregato full UI (sidebar + collapse) ----
export const selectFullUiState = createSelector(
  [
    (state: RootState) => state.ui.ui,
    (state: RootState) => state.ui.sidebar,
    (state: RootState) => state.ui.collapse,
  ],
  (uiState, sidebarState, collapseState) => ({
    ui: uiState,
    sidebar: {
      ...sidebarState,
      isActive: !sidebarState.isCollapsed || sidebarState.isMobileOpen,
    },
    collapse: {
      ...collapseState,
      isActive: Object.keys(collapseState.items).length > 0,
    },
    isInteractive: !collapseState.isLoading,
    hasErrors: !!collapseState.error,
  })
);
