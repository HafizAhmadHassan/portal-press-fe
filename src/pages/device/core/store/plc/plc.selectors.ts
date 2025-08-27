// @store_admin/plc/plc.selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";
import type { PlcItem } from "./plc.types";

/** Root */
export const selectPlcState = (s: RootState) => s.plc;

/** Lista completa (array di PlcItem) */
export const selectAllPlc = createSelector(
  [selectPlcState],
  (s) => s.items || []
);

/** Loading / Error / Pagination / Filters */
export const selectPlcLoading = createSelector(
  [selectPlcState],
  (s) => s.isLoading
);

export const selectPlcError = createSelector([selectPlcState], (s) => s.error);

export const selectPlcPagination = createSelector(
  [selectPlcState],
  (s) => s.pagination
);

export const selectPlcFilters = createSelector(
  [selectPlcState],
  (s) => s.filters
);

/** --- SELETTORI SEPARATI PER I 3 BLOCCHI --- */

/** Tutti i plc_data */
export const selectAllPlcData = createSelector([selectAllPlc], (items) =>
  items.map((i) => i.plc_data)
);

/** Tutti i plc_io */
export const selectAllPlcIo = createSelector([selectAllPlc], (items) =>
  items.map((i) => i.plc_io)
);

/** Tutti i plc_status */
export const selectAllPlcStatus = createSelector([selectAllPlc], (items) =>
  items.map((i) => i.plc_status)
);

/** --- BY ID (usa l'id presente in ciascun blocco) --- */
const getIdArg = (_: RootState, id: string | number) => id;

/** PlcItem by id (match su plc_data.id | plc_status.id | plc_io.id) */
export const selectPlcItemById = createSelector(
  [selectAllPlc, getIdArg],
  (items: PlcItem[], id) =>
    items.find(
      (x) =>
        x?.plc_data?.id === id ||
        x?.plc_status?.id === id ||
        x?.plc_io?.id === id
    ) || null
);

/** plc_data by id */
export const selectPlcDataById = createSelector(
  [selectAllPlc, getIdArg],
  (items, id) => items.find((x) => x?.plc_data?.id === id)?.plc_data || null
);

/** plc_io by id */
export const selectPlcIoById = createSelector(
  [selectAllPlc, getIdArg],
  (items, id) => items.find((x) => x?.plc_io?.id === id)?.plc_io || null
);

/** plc_status by id */
export const selectPlcStatusById = createSelector(
  [selectAllPlc, getIdArg],
  (items, id) => items.find((x) => x?.plc_status?.id === id)?.plc_status || null
);
