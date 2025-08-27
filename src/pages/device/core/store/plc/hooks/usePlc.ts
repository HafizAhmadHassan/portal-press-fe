import { useMemo } from "react";
import {
  useCreatePlcMutation,
  useDeletePlcMutation,
  useGetPlcQuery,
  useUpdatePlcMutation,
} from "./usePlcApi";

export const usePlc = (params: any) => {
  const { data, isLoading, isFetching, error, refetch } = useGetPlcQuery(
    params,
    {
      keepPreviousData: true,
      pollingInterval: 0,
    }
  );

  const [deleteMutation] = useDeletePlcMutation();
  const [createMutation] = useCreatePlcMutation();
  const [updateMutation] = useUpdatePlcMutation();

  const plc = useMemo(() => data?.data ?? [], [data?.data]);
  const meta = data?.meta ?? null;

  return {
    plc,
    meta,
    isLoading: isLoading || isFetching,
    error,
    refetch,
    deletePlc: (id: string | number) => deleteMutation(id),
    createPlc: (payload: any) => createMutation(payload),
    updatePlc: (payload: any) => updateMutation(payload),
  };
};
