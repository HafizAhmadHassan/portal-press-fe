// src/core/store/ui/ui.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UiState, ThemeMode } from './ui.types';
import { initTheme, applyThemeMode, toggleDarkMode, systemThemeChanged } from './ui.thunk';

const getInitialState = (): UiState => {
  // SSR safe defaults
  let themeMode: ThemeMode = 'system';
  let isDark = false;

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('ui-theme-mode') as ThemeMode | null;
    themeMode = (saved === 'light' || saved === 'dark' || saved === 'system') ? saved : 'system';
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark = themeMode === 'dark' || (themeMode === 'system' && prefersDark);
  }

  return {
    themeMode,
    isDark,
    isLoading: false,
    error: null,
  };
};

const initialState: UiState = getInitialState();

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Usato internamente dai thunk per aggiornare lo stato risolto
    setThemeState: (state, action: PayloadAction<{ themeMode: ThemeMode; isDark: boolean }>) => {
      state.themeMode = action.payload.themeMode;
      state.isDark = action.payload.isDark;
    },
    resetUiState: () => getInitialState(),
  },
  extraReducers: (builder) => {
    builder
      .addCase(initTheme.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(initTheme.fulfilled, (state, action) => {
        state.isLoading = false;
        state.themeMode = action.payload.themeMode;
        state.isDark = action.payload.isDark;
      })
      .addCase(initTheme.rejected, (state, action) => { state.isLoading = false; state.error = String(action.payload || action.error.message || 'Init theme failed'); })

      .addCase(applyThemeMode.fulfilled, (state, action) => {
        state.themeMode = action.payload.themeMode;
        state.isDark = action.payload.isDark;
      })

      .addCase(toggleDarkMode.fulfilled, (state, action) => {
        state.themeMode = action.payload.themeMode;
        state.isDark = action.payload.isDark;
      })

      .addCase(systemThemeChanged.fulfilled, (state, action) => {
        // Solo se siamo in 'system' aggiorniamo l'effettivo
        if (state.themeMode === 'system') {
          state.isDark = action.payload.isDark;
        }
      });
  }
});

export const { setThemeState, resetUiState } = uiSlice.actions;
export default uiSlice.reducer;
