// src/core/store/ui/ui.api.ts
// Piccola API locale per persistere le preferenze UI (localStorage)
// In futuro puoi sostituirla con chiamate reali al backend.

const STORAGE_KEYS = {
  THEME_MODE: 'ui-theme-mode',
  UI_PREFS: 'ui-prefs',
};

export const uiApi = {
  savePreferences: async (preferences: Record<string, unknown>) => {
    const currentRaw = localStorage.getItem(STORAGE_KEYS.UI_PREFS);
    const current = currentRaw ? JSON.parse(currentRaw) : {};
    const merged = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.UI_PREFS, JSON.stringify(merged));
    return merged;
  },

  loadPreferences: async () => {
    const currentRaw = localStorage.getItem(STORAGE_KEYS.UI_PREFS);
    return currentRaw ? JSON.parse(currentRaw) : {};
  },

  saveThemeMode: async (mode: 'light' | 'dark' | 'system') => {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, mode);
    return { mode };
  },

  loadThemeMode: async (): Promise<'light' | 'dark' | 'system' | null> => {
    const value = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    return (value === 'light' || value === 'dark' || value === 'system') ? value : null;
  },
};
