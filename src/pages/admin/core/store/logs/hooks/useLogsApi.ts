// @store_admin/logs/hooks/useLogsApi.ts
import { logsApi } from "@store_admin/logs/logs.api";

export const { useGetLogsQuery, useGetLogByIdQuery } = logsApi;
