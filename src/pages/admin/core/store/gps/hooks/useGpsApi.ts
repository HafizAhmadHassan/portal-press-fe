// @store_admin/gps/hooks/useGpsApi.ts
import { gpsApi } from "@store_admin/gps/gps.api";

export const {
  useGetGpsQuery,
  useGetGpsByIdQuery,
  useCreateGpsMutation,
  useUpdateGpsMutation,
  useDeleteGpsMutation,
  useSearchGpsQuery,
  useBulkGpsMutation,
  useGetGpsStatsQuery,
} = gpsApi;
