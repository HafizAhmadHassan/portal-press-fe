import { useMemo } from "react";
import {
  loadPlc,
  createNewPlc,
  updateExistingPlc,
  deleteExistingPlc,
  refreshPlcData,
} from "./plc.actions";
import {
  selectAllPlc,
  selectPlcLoading,
  selectPlcError,
  selectPlcPagination,
  selectPlcFilters,
  selectPlcItemById,
} from "./plc.selectors";
import {
  setFilters,
  resetFilters,
  setPagination,
  setSelected,
  clearError,
} from "./plc.slice";
import type { PlcQueryParams, PlcFilters, PlcItem } from "./plc.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@root/pages/admin/core/store/store.hooks";

/** Hook principale per la gestione PLC (ergonomico per la UI) */
export const usePlc = () => {
  const dispatch = useAppDispatch();

  const items = useAppSelector(selectAllPlc);
  const isLoading = useAppSelector(selectPlcLoading);
  const error = useAppSelector(selectPlcError);
  const pagination = useAppSelector(selectPlcPagination);
  const filters = useAppSelector(selectPlcFilters);

  const actions = useMemo(
    () => ({
      load: (params?: PlcQueryParams) => dispatch(loadPlc(params)),
      refresh: () => dispatch(refreshPlcData()),
      create: (data: Partial<PlcItem>) => dispatch(createNewPlc(data)),
      update: (id: number, data: Partial<PlcItem>) =>
        dispatch(updateExistingPlc({ id, data })),
      delete: (id: number) => dispatch(deleteExistingPlc(id)),
      setFilters: (f: Partial<PlcFilters>) => dispatch(setFilters(f)),
      resetFilters: () => dispatch(resetFilters()),
      setPagination: (p: any) => dispatch(setPagination(p)),
      setSelected: (item: PlcItem | null) => dispatch(setSelected(item)),
      clearError: () => dispatch(clearError()),
    }),
    [dispatch]
  );

  return { items, isLoading, error, pagination, filters, ...actions };
};

/** Hook per un singolo PLC */
export const usePlcById = (id: number) => {
  const dispatch = useAppDispatch();
  const item = useAppSelector((s) => selectPlcItemById(s, id));
  const isLoading = useAppSelector(selectPlcLoading);
  const error = useAppSelector(selectPlcError);

  const actions = useMemo(
    () => ({
      update: (data: Partial<PlcItem>) =>
        dispatch(updateExistingPlc({ id, data })),
      delete: () => dispatch(deleteExistingPlc(id)),
      refresh: () => dispatch(loadPlc()),
    }),
    [dispatch, id]
  );

  return { item, isLoading, error, ...actions };
};
