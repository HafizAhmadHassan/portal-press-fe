// Types
export type {
  PlcItem,
  PlcData,
  PlcIo,
  PlcStatus,
  PlcResponse,
  PlcQueryParams,
  PlcFilters,
  PlcState,
  CreatePlcPayload,
  UpdatePlcPayload,
  PlcSearchOptions,
  PlcStats,
} from "./plc.types";

// API hooks
export {
  plcApi,
  useGetQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useSearchQuery,
  useGetStatsQuery,
} from "./plc.api";

// Thunk actions (use cases)
export {
  loadPlc,
  createNewPlc,
  updateExistingPlc,
  deleteExistingPlc,
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
  selectPlcItemById,
  selectPlcCount,
  selectOnlinePlc,
  selectOfflinePlc,
} from "./plc.selectors";

// Hooks ergonomici
export { usePlc, usePlcById } from "./plc.hooks";

// Reducer (per configureStore)
export { default as plcReducer } from "./plc.slice";
