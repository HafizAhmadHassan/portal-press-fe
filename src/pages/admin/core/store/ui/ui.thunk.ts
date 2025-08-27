// src/core/store/ui/ui.thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ThemeMode } from "./ui.types";
import { uiApi } from "./ui.api";
import { setThemeState } from "./ui.slice";
import type { RootState } from "@root/store";

const resolveIsDark = (mode: ThemeMode): boolean => {
  if (typeof window === "undefined") return mode === "dark";
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  return mode === "dark" || (mode === "system" && prefersDark);
};

const applyDomClass = (isDark: boolean) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("darkMode", isDark);
};

export const initTheme = createAsyncThunk(
  "ui/initTheme",
  async (_, { dispatch }) => {
    const saved = await uiApi.loadThemeMode();
    const mode: ThemeMode = saved ?? "system";
    const isDark = resolveIsDark(mode);
    // Set state and DOM
    dispatch(setThemeState({ themeMode: mode, isDark }));
    applyDomClass(isDark);
    return { themeMode: mode, isDark };
  }
);

export const applyThemeMode = createAsyncThunk(
  "ui/applyThemeMode",
  async (mode: ThemeMode, { dispatch }) => {
    await uiApi.saveThemeMode(mode);
    const isDark = resolveIsDark(mode);
    dispatch(setThemeState({ themeMode: mode, isDark }));
    applyDomClass(isDark);
    return { themeMode: mode, isDark };
  }
);

export const toggleDarkMode = createAsyncThunk(
  "ui/toggleDarkMode",
  async (_, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { themeMode, isDark } = state.ui.ui;
    // Toggle for preference: if system, switch to explicit light/dark
    const nextMode: ThemeMode =
      themeMode === "system"
        ? isDark
          ? "light"
          : "dark"
        : isDark
        ? "light"
        : "dark";

    return await dispatch(applyThemeMode(nextMode)).unwrap();
  }
);

// Usato per reagire ai cambi del sistema quando themeMode === 'system'
export const systemThemeChanged = createAsyncThunk(
  "ui/systemThemeChanged",
  async (isSystemDark: boolean, { getState, dispatch }) => {
    const state = getState() as RootState;
    const { themeMode } = state.ui.ui;
    const isDark =
      themeMode === "dark" || (themeMode === "system" && isSystemDark);
    dispatch(setThemeState({ themeMode, isDark }));
    // Aggiorna DOM
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("darkMode", isDark);
    }
    return { isDark };
  }
);
