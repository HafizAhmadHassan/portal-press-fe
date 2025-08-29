// @store_device/plc/plc.thunks.ts
import type { RootState } from "@root/store";

import { plcApi } from "./plc.api";
import { setItems, setPagination, setLoading, setError } from "./plc.slice";
import { selectPlcFilters, selectPlcPagination } from "./plc.selectors";

import type { PlcItem, PlcQueryParams, PlcResponse } from "./plc.types";
import { createCrudThunks } from "@root/pages/admin/core/store/actions.factory";

/** Mappa filtri/paginazione di stato → params API */
const mapStateToListParams = (
  filters: ReturnType<typeof selectPlcFilters>,
  pag: ReturnType<typeof selectPlcPagination>,
  custom?: Partial<PlcQueryParams>
): PlcQueryParams => {
  return {
    page: pag.page,
    page_size: pag.page_size,
    search: filters.search,
    sortBy: filters.sortBy,
    sortOrder: filters.sortOrder,
    codice: filters.codice,
    municipility: filters.municipility,
    customer: filters.customer,
    waste: filters.waste,
    ...(custom || {}),
  };
};

/** Estrattore items/meta dalla response API */
const extractFromListResponse = (res: PlcResponse | any) => ({
  items: Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [],
  meta: res?.meta,
});

/** Crea i thunk CRUD per i PLC */
const { load, refresh, create, update, remove, search } = createCrudThunks<
  RootState,
  PlcItem,
  PlcQueryParams,
  { query: string; limit?: number }
>({
  api: plcApi as any,
  endpointKeys: {
    list: "getPlc", // <- combacia con plc.api.ts
    create: "createPlc",
    update: "updatePlc",
    delete: "deletePlc",
    search: "searchPlc",
  },
  sliceActions: {
    setItems: (payload) => setItems(payload),
    setPagination: (payload) => setPagination(payload),
    setLoading: (payload) => setLoading(payload),
    setError: (payload) => setError(payload),
  },
  selectors: {
    selectFilters: (s) => selectPlcFilters(s),
    selectPagination: (s) => selectPlcPagination(s),
  },
  mapStateToListParams,
  extractFromListResponse,
});

export const loadPlc = load;
export const refreshPlcData = refresh;
export const createNewPlc = create;
export const updateExistingPlc = update;
export const deleteExistingPlc = remove;
export const searchPlc = search!;
