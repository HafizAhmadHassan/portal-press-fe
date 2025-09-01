// @store_device/plc/plc.api.ts
import { apiSlice } from "@store_admin/apiSlice";
import type {
  PlcItem,
  PlcQueryParams,
  PlcResponse,
  PlcWriteRequest,
  PlcWriteResponse,
} from "./plc.types";
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

// ✅ Endpoint aggiuntivo per scrivere su PLC
export const plcWriteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    writePlc: builder.mutation<PlcWriteResponse, PlcWriteRequest>({
      query: (body) => ({
        url: "plc_write/",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Plc" as const, id: "LIST" }],
      // Ottimistic update opzionale
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        console.log("PLC Write command sent:", args);

        try {
          const { data } = await queryFulfilled;
          console.log("PLC Write successful:", data);
        } catch (error) {
          console.error("PLC Write failed:", error);
        }
      },
    }),
  }),
  overrideExisting: false,
});

// ✅ Alias con nomi "parlanti" per l'entità, mantenendo i TIPI
export const {
  useGetPlcQuery,
  useGetPlcByIdQuery,
  useCreatePlcMutation,
  useUpdatePlcMutation,
  useDeletePlcMutation,
  useSearchPlcQuery, // presente solo se enableSearch=true
  useGetPlcStatsQuery, // presente solo se enableStats=true
} = plcApi;

// ✅ Hook per PLC Write dal secondo API slice
export const { useWritePlcMutation } = plcWriteApi;
