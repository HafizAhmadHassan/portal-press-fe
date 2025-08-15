// src/core/store/ui/index.ts
import { combineReducers } from '@reduxjs/toolkit';
import uiSliceReducer from './ui.slice'; // ✅ Nome diverso per evitare conflitto
import sidebarReducer from './sidebar/sidebar.slice';
import collapseReducer from './collapse/collapse.slice';

export const uiReducer = combineReducers({
  ui: uiSliceReducer,          // ✅ Usa il nome importato
  sidebar: sidebarReducer,
  collapse: collapseReducer,
});

export type UiRootState = ReturnType<typeof uiReducer>;

// Esporta _hooks
export { useUi } from '@store_admin/hooks/useUi';
export { useCollapse } from '@store_admin/hooks/useCollapse';

// Esporta types
export type { UiState, SidebarState, CollapseState, CollapseItem, FullUiState } from './ui.types';