// @store_admin/logs/logs.api.ts
import { apiSlice } from "@store_admin/apiSlice";
import type { LogItem, LogsQueryParams, LogsResponse } from "./logs.types";

export const logsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query<LogsResponse, LogsQueryParams | void>({
      query: (params = {}) => {
        const safeParams = params ?? {};
        const clean = Object.entries(safeParams as Record<string, any>).reduce(
          (acc, [k, v]) => {
            if (v !== undefined && v !== null && v !== "") (acc as any)[k] = v;
            return acc;
          },
          {} as Record<string, any>
        );
        return { url: "log/", params: clean };
      },
      providesTags: [{ type: "LIST" as const, id: "Logs" }],
      transformResponse: (res: LogsResponse) => {
        if (!res?.meta || !Array.isArray(res?.data)) {
          throw new Error("Invalid API response structure");
        }
        return res;
      },
    }),

    getLogById: builder.query<LogItem, string | number>({
      query: (id) => `log/${id}`,
      providesTags: (_r, _e, id) => [{ type: "ENTITY" as const, id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetLogsQuery, useGetLogByIdQuery } = logsApi;
