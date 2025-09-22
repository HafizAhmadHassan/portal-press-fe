// @store_admin/logs/hooks/useLogs.ts
import { useMemo } from "react";
import { useGetLogsQuery } from "./useLogsApi";
import type { LogsQueryParams } from "../logs.types";

export const useLogs = (params: LogsQueryParams) => {
  const { data, isLoading, isFetching, error, refetch } = useGetLogsQuery(
    params,
    { pollingInterval: 0 }
  );

  const logs = useMemo(() => data?.data ?? [], [data?.data]);
  const meta = data?.meta ?? null;

  return {
    logs,
    meta,
    isLoading: isLoading || isFetching,
    error,
    refetch,
  };
};
