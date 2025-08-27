import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";

// ✅ SELETTORI BASE (primitivi - non usare createSelector)
export const selectSidebarState = (state: RootState) => state.ui.sidebar;
export const selectIsSidebarCollapsed = (state: RootState) =>
  state.ui.sidebar.isCollapsed;
export const selectIsMobileOpen = (state: RootState) =>
  state.ui.sidebar.isMobileOpen;
export const selectSidebarPosition = (state: RootState) =>
  state.ui.sidebar.position;
export const selectAccordionDirection = (state: RootState) =>
  state.ui.sidebar.accordionDirection;

// ✅ SELETTORI MEMOIZZATI (solo per trasformazioni reali)
export const selectSidebarConfig = createSelector(
  [selectIsSidebarCollapsed, selectSidebarPosition, selectAccordionDirection],
  (isCollapsed, position, accordionDirection) => ({
    isCollapsed,
    position,
    accordionDirection,
    // ✅ TRASFORMAZIONE REALE - crea nuove proprietà
    classes: {
      position: `sidebar-${position}`,
      direction: `accordion-${accordionDirection}`,
      collapsed: isCollapsed ? "collapsed" : "expanded",
    },
    // ✅ TRASFORMAZIONE REALE - logica derivata
    displayMode: isCollapsed ? "icons-only" : "full",
    shouldShowLabels: !isCollapsed,
  })
);

// ✅ SELETTORE per stato mobile (trasformazione)
export const selectMobileState = createSelector(
  [selectIsMobileOpen],
  (isMobileOpen) => ({
    isMobileOpen,
    isOpen: isMobileOpen,
    // ✅ TRASFORMAZIONE REALE
    overlayVisible: isMobileOpen,
    bodyLocked: isMobileOpen,
  })
);

// ✅ SELETTORE per controllo qualsiasi sidebar aperta
export const selectAnySidebarOpen = createSelector(
  [selectIsMobileOpen, selectIsSidebarCollapsed],
  (isMobileOpen, isCollapsed) => ({
    // ✅ TRASFORMAZIONE REALE - logica combinata
    anyOpen: isMobileOpen || !isCollapsed,
    mobileOpen: isMobileOpen,
    desktopExpanded: !isCollapsed,
  })
);
