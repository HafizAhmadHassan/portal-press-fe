import { plcApi } from "../plc.api";

export const usePlcSearch = (query: string, limit = 10) => {
  const { data, isLoading, error } = plcApi.useSearchPlcQuery(
    { query, limit },
    { skip: !query || query.length < 2 }
  );
  return { plc: data || [], isLoading, error };
};
