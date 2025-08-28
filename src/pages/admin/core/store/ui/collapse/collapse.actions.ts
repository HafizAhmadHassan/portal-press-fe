import { createAction } from "@reduxjs/toolkit";

// Actions aggiuntive per collapse
export const resetCollapseState = createAction("collapse/resetState");
export const setCollapseLoading = createAction<boolean>("collapse/setLoading");
export const setCollapseError = createAction<string | null>(
  "collapse/setError"
);

// Actions per gestione bulk
export const bulkRegisterCollapses = createAction<
  Array<{
    id: number;
    autoClose?: boolean;
  }>
>("collapse/bulkRegister");

export const bulkToggleCollapses = createAction<string[]>(
  "collapse/bulkToggle"
);
