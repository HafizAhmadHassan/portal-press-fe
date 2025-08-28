import { apiSlice } from "@store_admin/apiSlice";

export const plcApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPlc: builder.query({
      query: (params: any = {}) => {
        const clean = Object.entries(params).reduce((acc: any, [k, v]) => {
          if (v !== undefined && v !== null && v !== "") acc[k] = v;
          return acc;
        }, {});
        return { url: "http://35.152.52.213/myapi/plc/", params: clean };
      },
      providesTags: [
        { type: "LIST", id: "Plc" },
        { type: "STATS", id: "Plc" },
      ],
      // Sostituisci keepPreviousData con keepUnusedDataFor
      keepUnusedDataFor: 60, // mantiene i dati per 60 secondi
      transformResponse: (res: any) => {
        if (!res?.meta || !Array.isArray(res?.data)) {
          throw new Error("Invalid API response structure");
        }
        return res;
      },
    }),

    getPlcById: builder.query({
      query: (id: number | number) => `http://35.152.52.213/myapi/plc/${id}`,
      providesTags: (_r, _e, id) => [{ type: "ENTITY", id }],
    }),

    createPlc: builder.mutation({
      query: (body: any) => ({
        url: "http://35.152.52.213/myapi/plc/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LIST", id: "Plc" },
        { type: "STATS", id: "Plc" },
      ],
    }),

    updatePlc: builder.mutation({
      query: ({ id, data }: any) => ({
        url: `http://35.152.52.213/myapi/plc/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }: any) => [
        { type: "ENTITY", id },
        { type: "LIST", id: "Plc" },
        { type: "STATS", id: "Plc" },
      ],
      async onQueryStarted({ id, data }: any, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          plcApi.util.updateQueryData("getPlcById", id as any, (draft: any) => {
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

    deletePlc: builder.mutation({
      query: (id: number | number) => ({
        url: `http://35.152.52.213/myapi/plc/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_r, _e, id) => [
        { type: "ENTITY", id },
        { type: "LIST", id: "Plc" },
        { type: "STATS", id: "Plc" },
      ],
    }),

    searchPlc: builder.query({
      query: ({ query, limit = 10 }: { query: string; limit?: number }) => ({
        url: "http://35.152.52.213/myapi/plc/search",
        params: { q: query, limit },
      }),
      providesTags: [{ type: "LIST", id: "Plc" }],
    }),

    bulkPlc: builder.mutation({
      query: (body: any) => ({
        url: "http://35.152.52.213/myapi/plc/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LIST", id: "Plc" },
        { type: "STATS", id: "Plc" },
      ],
    }),

    // Se esiste un endpoint di stats:
    getPlcStats: builder.query({
      query: () => "http://35.152.52.213/myapi/plc/stats",
      providesTags: [{ type: "STATS", id: "Plc" }],
    }),
  }),
  overrideExisting: false,
});

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
