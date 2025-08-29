// @store_device/plc/plc.api.ts
import { apiSlice } from "@store_admin/apiSlice";
import type { PlcItem, PlcQueryParams, PlcResponse } from "./plc.types";

export const plcApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Lista PLC con filtri
    getPlc: builder.query<PlcResponse, PlcQueryParams>({
      query: (params = {}) => {
        const cleanParams = Object.entries(params).reduce((acc, [k, v]) => {
          if (v !== undefined && v !== null && v !== "") acc[k] = v;
          return acc;
        }, {} as Record<string, any>);

        return { url: "plc/", params: cleanParams };
      },
      providesTags: [
        { type: "LIST", id: "Plc" },
        { type: "STATS", id: "Plc" },
      ],
      keepUnusedDataFor: 60,
      transformResponse: (res: any): PlcResponse => {
        if (!res?.meta || !Array.isArray(res?.data)) {
          throw new Error("Invalid API response structure");
        }
        return res;
      },
    }),

    // Singolo PLC per ID
    getPlcById: builder.query<PlcItem, number>({
      query: (id) => `plc/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ENTITY", id }],
    }),

    // Creazione PLC
    createPlc: builder.mutation<PlcItem, Partial<PlcItem>>({
      query: (body) => ({
        url: "plc/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LIST", id: "Plc" },
        { type: "STATS", id: "Plc" },
      ],
    }),

    // Aggiornamento PLC
    updatePlc: builder.mutation<
      PlcItem,
      { id: number; data: Partial<PlcItem> }
    >({
      query: ({ id, data }) => ({
        url: `plc/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ENTITY", id },
        { type: "LIST", id: "Plc" },
        { type: "STATS", id: "Plc" },
      ],
      // Optimistic update
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          plcApi.util.updateQueryData("getPlcById", id, (draft) => {
            Object.assign(draft, data);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    // Eliminazione PLC
    deletePlc: builder.mutation<void, number>({
      query: (id) => ({
        url: `plc/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "ENTITY", id },
        { type: "LIST", id: "Plc" },
        { type: "STATS", id: "Plc" },
      ],
    }),

    // Ricerca PLC
    searchPlc: builder.query<PlcItem[], { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => ({
        url: "plc/search",
        params: { q: query, limit },
      }),
      providesTags: [{ type: "LIST", id: "Plc" }],
    }),

    // Operazioni bulk
    bulkPlc: builder.mutation<any, any>({
      query: (body) => ({
        url: "plc/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LIST", id: "Plc" },
        { type: "STATS", id: "Plc" },
      ],
    }),

    // Statistiche PLC
    getPlcStats: builder.query<any, void>({
      query: () => "plc/stats",
      providesTags: [{ type: "STATS", id: "Plc" }],
    }),
  }),
  overrideExisting: false,
});

// Export degli hook generati automaticamente
export const {
  useGetPlcQuery,
  useGetPlcByIdQuery,
  useCreatePlcMutation,
  useUpdatePlcMutation,
  useDeletePlcMutation,
  useSearchPlcQuery,
  useBulkPlcMutation,
  useGetPlcStatsQuery,
} = plcApi;
