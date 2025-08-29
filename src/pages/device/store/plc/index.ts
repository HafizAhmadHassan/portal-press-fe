// @store_device/plc/index.ts

// Types
export type {
  PlcItem,
  PlcData,
  PlcIo,
  PlcStatus,
  PlcResponse,
  PlcQueryParams,
  PlcFilters,
  PlcPagination,
  PlcState,
  CreatePlcPayload,
  UpdatePlcPayload,
  PlcSearchOptions,
  PlcStats,
  ApiMeta,
  ApiResponse,
} from "./plc.types";

// API & RTK Query hooks
export {
  plcApi,
  useGetPlcQuery,
  useGetPlcByIdQuery,
  useCreatePlcMutation,
  useUpdatePlcMutation,
  useDeletePlcMutation,
  useSearchPlcQuery,
  useBulkPlcMutation,
  useGetPlcStatsQuery,
} from "./plc.api";

// Actions
export {
  loadPlc,
  createNewPlc,
  updateExistingPlc,
  deleteExistingPlc,
  performBulkPlc,
  searchPlc,
  refreshPlcData,
} from "./plc.actions";

// Slice actions
export {
  setItems,
  setSelected,
  setPagination,
  updatePagination,
  setFilters,
  resetFilters,
  setLoading,
  setError,
  clearError,
  resetState,
  updateItemOptimistic,
  removeItemOptimistic,
} from "./plc.slice";

// Selectors
export {
  selectPlcState,
  selectAllPlc,
  selectSelectedPlc,
  selectPlcLoading,
  selectPlcError,
  selectPlcPagination,
  selectPlcFilters,
  selectAllPlcData,
  selectAllPlcIo,
  selectAllPlcStatus,
  selectPlcItemById,
  selectPlcDataById,
  selectPlcIoById,
  selectPlcStatusById,
  selectPlcCount,
  selectFilteredPlc,
  selectPlcStats,
  selectPlcWithIssues,
  selectOnlinePlc,
  selectOfflinePlc,
  selectHasPendingChanges,
  selectHasErrors,
} from "./plc.selectors";

// Hooks
export { usePlc, usePlcById, usePlcSearch } from "./hooks/usePlc";

// Reducer (for store configuration)
export { default as plcReducer } from "./plc.slice";
