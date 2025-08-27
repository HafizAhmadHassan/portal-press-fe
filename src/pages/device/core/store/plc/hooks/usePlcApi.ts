import { plcApi } from "@store_device/plc/plc.api";

export const {
  useGetPlcQuery,
  useGetPlcByIdQuery,
  useCreatePlcMutation,
  useUpdatePlcMutation,
  useDeletePlcMutation,
  useSearchPlcQuery,
  useBulkPlcMutation,
  useGetPlcStatsQuery,
} = plcApi;
