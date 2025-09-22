// @store_admin/logs/logs.selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";

export const selectLogsState = (s: RootState) => s.logs;

export const selectAllLogs = createSelector(
  [selectLogsState],
  (s) => s.items || []
);

export const selectLogsLoading = createSelector(
  [selectLogsState],
  (s) => s.isLoading
);

export const selectLogsError = createSelector(
  [selectLogsState],
  (s) => s.error
);

export const selectLogsPagination = createSelector(
  [selectLogsState],
  (s) => s.pagination
);

export const selectLogsFilters = createSelector(
  [selectLogsState],
  (s) => s.filters
);

export const selectLogById = createSelector(
  [selectAllLogs, (_: RootState, id: string | number) => id],
  (items, id) => items.find((x) => x.id === id)
);
