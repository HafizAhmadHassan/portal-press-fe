// @store_device/plc/plc.api.ts
import { apiSlice } from "@store_admin/apiSlice";
import type { PlcItem, PlcQueryParams, PlcResponse } from "./plc.types";
import { createCrudEndpoints } from "@root/pages/admin/core/store/api.factory";

export const plcApi = apiSlice.injectEndpoints({
  endpoints: (builder) =>
    createCrudEndpoints<PlcItem, PlcQueryParams, PlcResponse>(builder, {
      entity: "Plc",
      baseUrl: "plc/",
      idTag: "Plc",
      keepUnusedDataFor: 60,
      enableSearch: true,
      searchPath: "search",
      enableStats: true,
      statsPath: "stats",
      transformListResponse: (res: any): PlcResponse => {
        if (!res?.meta || !Array.isArray(res?.data)) {
          throw new Error("Invalid API response structure");
        }
        return res as PlcResponse;
      },
      apiForOptimisticPatch: apiSlice, // abilita patch ottimistico su getById
    }),
  overrideExisting: false,
});

// ✅ Alias con nomi “parlanti” per l’entità, mantenendo i TIPI
export const {
  useGetListQuery: useGetPlcQuery,
  useGetByIdQuery: useGetPlcByIdQuery,
  useCreateMutation: useCreatePlcMutation,
  useUpdateMutation: useUpdatePlcMutation,
  useDeleteMutation: useDeletePlcMutation,
  useSearchQuery: useSearchPlcQuery, // presente solo se enableSearch=true
  useGetStatsQuery: useGetPlcStatsQuery, // presente solo se enableStats=true
} = plcApi;
