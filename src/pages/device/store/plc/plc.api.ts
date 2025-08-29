import { apiSlice } from "@store_admin/apiSlice";
import type { PlcItem, PlcQueryParams, PlcResponse } from "./plc.types";
import { METHODS_TYPE } from "@root/pages/admin/core/store/api.types";

/**
 * RTK Query: endpoints atomici, nessuna orchestrazione.
 * Tag: usiamo categorie LIST/ENTITY/STATS con id "Plc".
 */

const BASE_URL = "plc/";
const ID_TAGS = "Plc";

export const plcApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    get: builder.query<PlcResponse, PlcQueryParams>({
      query: (params = {}) => {
        const clean = Object.entries(params).reduce((acc, [k, v]) => {
          if (v !== undefined && v !== null && v !== "") acc[k] = v;
          return acc;
        }, {} as Record<string, any>);
        return { url: `${BASE_URL}`, params: clean };
      },
      providesTags: [
        { type: "LIST", id: ID_TAGS },
        { type: "STATS", id: ID_TAGS },
      ],
      keepUnusedDataFor: 60,
      transformResponse: (res: any): PlcResponse => {
        if (!res?.meta || !Array.isArray(res?.data)) {
          throw new Error("Invalid API response structure");
        }
        return res;
      },
    }),

    getById: builder.query<PlcItem, number>({
      query: (id) => `${BASE_URL}${id}`,
      providesTags: (_r, _e, id) => [{ type: "ENTITY", id }],
    }),

    create: builder.mutation<PlcItem, Partial<PlcItem>>({
      query: (body) => ({ url: BASE_URL, method: METHODS_TYPE.POST, body }),
      invalidatesTags: [
        { type: "LIST", id: ID_TAGS },
        { type: "STATS", id: ID_TAGS },
      ],
    }),

    update: builder.mutation<PlcItem, { id: number; data: Partial<PlcItem> }>({
      query: ({ id, data }) => ({
        url: `${id}`,
        method: METHODS_TYPE.PUT,
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ENTITY", id },
        { type: "LIST", id: ID_TAGS },
        { type: "STATS", id: ID_TAGS },
      ],
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

    delete: builder.mutation<void, number>({
      query: (id) => ({ url: `${id}`, method: METHODS_TYPE.DELETE }),
      invalidatesTags: (_r, _e, id) => [
        { type: "ENTITY", id },
        { type: "LIST", id: ID_TAGS },
        { type: "STATS", id: ID_TAGS },
      ],
    }),

    search: builder.query<PlcItem[], { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => ({
        url: `${BASE_URL}search`,
        params: { q: query, limit },
      }),
      providesTags: [{ type: "LIST", id: ID_TAGS }],
    }),

    getStats: builder.query<any, void>({
      query: () => `${BASE_URL}stats`,
      providesTags: [{ type: "STATS", id: ID_TAGS }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useSearchQuery,
  useGetStatsQuery,
} = plcApi;
