// @store_admin/gps/gps.selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";

export const selectGpsState = (s: RootState) => s.gps;

export const selectAllGps = createSelector(
  [selectGpsState],
  (s) => s.items || []
);
export const selectGpsLoading = createSelector(
  [selectGpsState],
  (s) => s.isLoading
);
export const selectGpsError = createSelector([selectGpsState], (s) => s.error);
export const selectGpsPagination = createSelector(
  [selectGpsState],
  (s) => s.pagination
);
export const selectGpsFilters = createSelector(
  [selectGpsState],
  (s) => s.filters
);

export const selectGpsById = createSelector(
  [selectAllGps, (_: RootState, id: number | number) => id],
  (items, id) => items.find((x) => x.id === id)
);
