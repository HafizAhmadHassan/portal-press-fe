// @store_admin/logs/hooks/useLogsSearch.ts
import { useGetLogsQuery } from "./useLogsApi";

export const useLogsSearch = (query: string, limit = 10) => {
  const { data, isLoading, error } = useGetLogsQuery(
    { search: query, page: 1, page_size: limit },
    { skip: !query || query.length < 2 }
  );

  return { logs: data?.data || [], isLoading, error };
};
