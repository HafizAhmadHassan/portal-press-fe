// src/core/store/hooks/useUi.ts
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { applyThemeMode, initTheme, toggleDarkMode, systemThemeChanged } from '../ui/ui.thunk';
import { selectIsDark, selectThemeMode, selectEffectiveTheme } from '../ui/ui.selectors';
import type { ThemeMode } from '../ui/ui.types';

export function useUi() {
  const dispatch = useDispatch();
  const isDark = useSelector(selectIsDark);
  const themeMode = useSelector(selectThemeMode);
  const effective = useSelector(selectEffectiveTheme);

  // Init on mount once (idempotente)
  useEffect(() => {
    dispatch(initTheme() as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow system changes only in 'system' mode
  useEffect(() => {
    if (typeof window === 'undefined' || themeMode !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => dispatch(systemThemeChanged(e.matches) as any);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [themeMode, dispatch]);

  const setTheme = (mode: ThemeMode) => dispatch(applyThemeMode(mode) as any);
  const toggleTheme = () => dispatch(toggleDarkMode() as any);

  return {
    // state
    isDark,
    themeMode,
    effectiveTheme: effective.resolved,

    // actions
    setTheme,
    toggleTheme,
  };
}
