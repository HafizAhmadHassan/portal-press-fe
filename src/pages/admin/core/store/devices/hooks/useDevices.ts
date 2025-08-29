// hooks/useDevices.ts - Versione compatibile
import {
  useCreateDeviceMutation,
  useDeleteDeviceMutation,
  useGetDevicesQuery,
  useUpdateDeviceMutation,
} from "@store_admin/devices/devices.api";
import { useCallback } from "react";

export const useDevices = (queryParams: any) => {
  // Query per ottenere i devices con skip se parametri non validi
  const {
    data: response,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetDevicesQuery(queryParams, {
    skip: !queryParams || Object.keys(queryParams).length === 0,
    refetchOnMountOrArgChange: true, // Force refetch quando cambiano i parametri
  });

  // Mutations
  const [createDeviceMutation] = useCreateDeviceMutation();
  const [updateDeviceMutation] = useUpdateDeviceMutation();
  const [deleteDeviceMutation] = useDeleteDeviceMutation();

  // Wrapped mutations con logging
  const createDevice = useCallback(
    async (data: any) => {
      console.log("useDevices: Creating device with:", data);
      return await createDeviceMutation(data).unwrap();
    },
    [createDeviceMutation]
  );

  const updateDevice = useCallback(
    async (data: any) => {
      console.log("useDevices: Updating device with:", data);
      return await updateDeviceMutation(data).unwrap();
    },
    [updateDeviceMutation]
  );

  const deleteDevice = useCallback(
    async (id: number) => {
      console.log("useDevices: Deleting device:", id);
      return await deleteDeviceMutation(id).unwrap();
    },
    [deleteDeviceMutation]
  );

  // Enhanced refetch che forza il refresh
  const enhancedRefetch = useCallback(() => {
    console.log("useDevices: Force refetching with params:", queryParams);
    return refetch();
  }, [refetch, queryParams]);

  // Normalizza la risposta per gestire diversi formati
  const devices = response?.data || response || [];
  const meta = response?.meta || {
    page: 1,
    page_size: devices.length,
    total: devices.length,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  };

  console.log("useDevices result:", {
    devicesCount: devices.length,
    isLoading,
    isFetching,
    meta,
    error: !!error,
  });

  return {
    devices,
    meta,
    isLoading: isLoading || isFetching,
    error,
    refetch: enhancedRefetch,
    // Esponi le mutations
    createDevice,
    updateDevice,
    deleteDevice,
  };
};
