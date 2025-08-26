// @store_admin/gps/gps.api.ts
import { apiSlice } from "@store_admin/apiSlice";
import type {
  BulkActionRequest,
  CreateGpsRequest,
  UpdateGpsRequest,
  GpsDevice,
  GpsQueryParams,
  GpsResponse,
  GpsStatsResponse,
} from "./gps.types";

export const gpsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGps: builder.query<GpsResponse, GpsQueryParams | void>({
      query: (params = {}) => {
        const clean = Object.entries(params).reduce((acc, [k, v]) => {
          if (v !== undefined && v !== null && v !== "") (acc as any)[k] = v;
          return acc;
        }, {} as Record<string, any>);
        return { url: "gps/", params: clean };
      },
      providesTags: [
        { type: "LIST" as const, id: "Gps" },
        { type: "STATS" as const, id: "Gps" },
      ],
      keepPreviousData: true,
      transformResponse: (res: GpsResponse) => {
        if (!res?.meta || !Array.isArray(res?.data)) {
          throw new Error("Invalid API response structure");
        }
        return res;
      },
    }),

    getGpsById: builder.query<GpsDevice, string | number>({
      query: (id) => `gps/${id}`,
      providesTags: (_r, _e, id) => [{ type: "ENTITY" as const, id }],
    }),

    createGps: builder.mutation<GpsDevice, CreateGpsRequest>({
      query: (body) => ({ url: "gps", method: "POST", body }),
      invalidatesTags: [
        { type: "LIST" as const, id: "Gps" },
        { type: "STATS" as const, id: "Gps" },
      ],
    }),

    updateGps: builder.mutation<GpsDevice, UpdateGpsRequest>({
      query: ({ id, data }) => ({
        url: `gps/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Gps" },
        { type: "STATS" as const, id: "Gps" },
      ],
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          apiSlice.util.updateQueryData(
            "getGpsById",
            id as any,
            (draft: any) => {
              Object.assign(draft, data);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          (patch as any).undo?.();
        }
      },
    }),

    deleteGps: builder.mutation<{ success: boolean }, string | number>({
      query: (id) => ({ url: `gps/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Gps" },
        { type: "STATS" as const, id: "Gps" },
      ],
    }),

    searchGps: builder.query<GpsDevice[], { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => ({
        url: "gps/search",
        params: { q: query, limit },
      }),
      providesTags: [{ type: "LIST" as const, id: "Gps" }],
    }),

    bulkGps: builder.mutation<
      { message: string; affected: number },
      BulkActionRequest
    >({
      query: (body) => ({ url: "gps/bulk", method: "POST", body }),
      invalidatesTags: [
        { type: "LIST" as const, id: "Gps" },
        { type: "STATS" as const, id: "Gps" },
      ],
    }),

    getGpsStats: builder.query<GpsStatsResponse, void>({
      query: () => "gps/stats",
      providesTags: [{ type: "STATS" as const, id: "Gps" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetGpsQuery,
  useGetGpsByIdQuery,
  useCreateGpsMutation,
  useUpdateGpsMutation,
  useDeleteGpsMutation,
  useSearchGpsQuery,
  useBulkGpsMutation,
  useGetGpsStatsQuery,
} = gpsApi;
