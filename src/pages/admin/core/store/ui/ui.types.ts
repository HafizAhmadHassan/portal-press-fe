// src/core/store/ui/ui.types.ts

export type ThemeMode = "light" | "dark" | "system";

export interface UiState {
  // Global theme handling
  themeMode: ThemeMode; // user preference
  isDark: boolean; // resolved theme applied to the DOM
  isLoading?: boolean;
  error?: string | null;
}

export interface SidebarState {
  // Desktop sidebar
  isCollapsed: boolean;
  position: "left" | "right";
  accordionDirection: "up" | "down";

  // Mobile sidebar
  isMobileOpen: boolean;
}

export interface CollapseItem {
  id: number;
  isOpen: boolean;
  autoClose?: boolean;
}

export interface CollapseState {
  items: Record<string, CollapseItem>;
  activeGroup?: string;
  isLoading: boolean;
  error: string | null;
}

// Stato UI completo
export interface FullUiState {
  ui: UiState;
  sidebar: SidebarState;
  collapse: CollapseState;
}
