import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";
import type { PlcItem } from "./plc.types";

/** base */
export const selectPlcState = (state: RootState) => state.plc;

/** lista items */
export const selectAllPlc = createSelector(
  [selectPlcState],
  (s) => s.items || []
);

/** selected */
export const selectSelectedPlc = createSelector(
  [selectPlcState],
  (s) => s.selected
);

/** loading / error */
export const selectPlcLoading = createSelector(
  [selectPlcState],
  (s) => s.isLoading
);
export const selectPlcError = createSelector([selectPlcState], (s) => s.error);

/** paginazione / filtri */
export const selectPlcPagination = createSelector(
  [selectPlcState],
  (s) => s.pagination
);
export const selectPlcFilters = createSelector(
  [selectPlcState],
  (s) => s.filters
);

/** derived */
export const selectPlcCount = createSelector(
  [selectAllPlc],
  (items) => items.length
);

/** by id helper */
const getIdArg = (_: RootState, id: number) => id;

export const selectPlcItemById = createSelector(
  [selectAllPlc, getIdArg],
  (items: PlcItem[], id: number) =>
    items.find(
      (it) =>
        it?.plc_data?.id === id ||
        it?.plc_status?.id === id ||
        it?.plc_io?.id === id
    ) || null
);

/** esempi di filtri derivati */
export const selectOnlinePlc = createSelector([selectAllPlc], (items) =>
  items.filter(
    (it) =>
      it.plc_status?.online === true ||
      it.plc_status?.connected === 1 ||
      it.plc_data?.status === 1
  )
);

export const selectOfflinePlc = createSelector([selectAllPlc], (items) =>
  items.filter((it) => {
    const online =
      it.plc_status?.online === true ||
      it.plc_status?.connected === 1 ||
      it.plc_data?.status === 1;
    return online === false;
  })
);
