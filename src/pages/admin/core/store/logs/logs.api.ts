// @store_admin/logs/logs.api.ts
import { apiSlice } from "@store_admin/apiSlice";
import type {
  LogItem,
  LogsQueryParams,
  LogsResponse,
  MachineLogsDetailResponse,
  MachineLogsQueryParams,
  GroupedMachinesLogsResponse,
} from "./logs.types";

type QueryValue = string | number | boolean | undefined | null;
type QueryParamsDict = Record<string, QueryValue>;

export const logsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Lista piatta (flat view) ora usa /log
    getLogs: builder.query<LogsResponse, LogsQueryParams | void>({
      query: (params = {}) => {
        const safeParams = params as LogsQueryParams;
        const clean = Object.entries(safeParams).reduce<QueryParamsDict>(
          (acc, [k, v]) => {
            if (v !== undefined && v !== null && v !== "") acc[k] = v;
            return acc;
          },
          {}
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

    // Raggruppata per macchina resta su /grouped_by_machine
    getGroupedMachineLogs: builder.query<
      GroupedMachinesLogsResponse,
      LogsQueryParams | void
    >({
      query: (params = {}) => {
        const safeParams = params as LogsQueryParams;
        const clean = Object.entries(safeParams).reduce<QueryParamsDict>(
          (acc, [k, v]) => {
            if (v !== undefined && v !== null && v !== "") acc[k] = v;
            return acc;
          },
          {}
        );
        return { url: "grouped_by_machine/", params: clean };
      },
      providesTags: [{ type: "LIST" as const, id: "GroupedMachineLogs" }],
      transformResponse: (res: GroupedMachinesLogsResponse) => {
        if (!res?.meta || !Array.isArray(res?.data)) {
          throw new Error("Invalid grouped response structure");
        }
        return res;
      },
    }),

    // Dettaglio logs per singola macchina (paginato)
    getMachineLogs: builder.query<
      MachineLogsDetailResponse,
      MachineLogsQueryParams
    >({
      query: ({ machine_ip, ...rest }) => {
        const clean = Object.entries(
          rest as Record<string, QueryValue>
        ).reduce<QueryParamsDict>((acc, [k, v]) => {
          if (v !== undefined && v !== null && v !== "") acc[k] = v;
          return acc;
        }, {});
        return {
          url: `machine/${encodeURIComponent(machine_ip)}/logs/`,
          params: clean,
        };
      },
      serializeQueryArgs: ({ queryArgs }) => {
        const { machine_ip, page_size, sortBy, sortOrder } = queryArgs;
        return `${machine_ip}|${page_size || ""}|${sortBy || ""}|${
          sortOrder || ""
        }`;
      },
      merge: (currentCache, newData) => {
        if (currentCache.meta.page !== newData.meta.page) {
          currentCache.data.push(...newData.data);
          currentCache.meta = newData.meta;
        } else {
          return newData;
        }
      },
      forceRefetch({ currentArg, previousArg }) {
        return (
          currentArg?.machine_ip !== previousArg?.machine_ip ||
          currentArg?.page !== previousArg?.page ||
          currentArg?.page_size !== previousArg?.page_size ||
          currentArg?.sortBy !== previousArg?.sortBy ||
          currentArg?.sortOrder !== previousArg?.sortOrder
        );
      },
    }),

    getLogById: builder.query<LogItem, string | number>({
      query: (id) => `log/${id}`,
      providesTags: (_r, _e, id) => [{ type: "ENTITY" as const, id }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLogsQuery,
  useGetGroupedMachineLogsQuery,
  useGetMachineLogsQuery,
  useGetLogByIdQuery,
} = logsApi;
