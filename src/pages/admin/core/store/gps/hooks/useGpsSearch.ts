// @store_admin/gps/hooks/useGpsSearch.ts
import { gpsApi } from "../gps.api";

export const useGpsSearch = (query: string, limit = 10) => {
  const { data, isLoading, error } = gpsApi.useSearchGpsQuery(
    { query, limit },
    { skip: !query || query.length < 2 }
  );
  return { gps: data || [], isLoading, error };
};
