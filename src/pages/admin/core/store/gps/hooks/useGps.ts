// @store_admin/gps/hooks/useGps.ts
import { useMemo } from "react";
import {
  useCreateGpsMutation,
  useDeleteGpsMutation,
  useGetGpsQuery,
  useUpdateGpsMutation,
} from "./useGpsApi";
import type { CreateGpsRequest, GpsQueryParams } from "../gps.types";

export const useGps = (params: GpsQueryParams) => {
  const { data, isLoading, isFetching, error, refetch } = useGetGpsQuery(
    params,
    {
      pollingInterval: 0,
    }
  );

  const [deleteMutation] = useDeleteGpsMutation();
  const [createMutation] = useCreateGpsMutation();
  const [updateMutation] = useUpdateGpsMutation();

  const gps = useMemo(() => data?.data ?? [], [data?.data]);
  const meta = data?.meta ?? null;

  return {
    gps,
    meta,
    isLoading: isLoading || isFetching,
    error,
    refetch,
    deleteGps: (id: number | number) => deleteMutation(id),
    createGps: (payload: CreateGpsRequest) => createMutation(payload),
    updateGps: (payload: any) => updateMutation(payload),
  };
};
