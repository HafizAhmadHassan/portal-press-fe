// hooks/useDevices.ts - Versione compatibile
import {
  useCreateDeviceMutation,
  useDeleteDeviceMutation,
  useGetDevicesQuery,
  useUpdateDeviceMutation,
} from "@store_admin/devices/devices.api";
import { useCallback } from "react";
import type {
  Device,
  DevicesQueryParams,
  CreateDeviceRequest,
  UpdateDeviceRequest,
} from "@store_admin/devices/devices.types";

interface DevicesMeta {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

type DevicesArrayResponse = Device[];
interface DevicesWrappedResponse {
  data: Device[];
  meta?: DevicesMeta;
}
type DevicesResponse =
  | DevicesArrayResponse
  | DevicesWrappedResponse
  | undefined;

function isWrapped(res: DevicesResponse): res is DevicesWrappedResponse {
  return (
    !!res && typeof res === "object" && "data" in res && Array.isArray(res.data)
  );
}

// Debug flag (abilita da console: window.__DEV_DEVICES_DEBUG = true) oppure tramite env VITE_DEBUG_DEVICES=true
declare global {
  interface Window {
    __DEV_DEVICES_DEBUG?: boolean;
  }
}

const DEV_DEBUG: boolean =
  (typeof window !== "undefined" && window.__DEV_DEVICES_DEBUG === true) ||
  (typeof import.meta !== "undefined" &&
    (import.meta as unknown as { env?: Record<string, string> })?.env
      ?.VITE_DEBUG_DEVICES === "true");

export const useDevices = (queryParams: DevicesQueryParams) => {
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
    async (data: CreateDeviceRequest) => {
      if (DEV_DEBUG) console.log("[useDevices] createDevice", data);
      return await createDeviceMutation(data).unwrap();
    },
    [createDeviceMutation]
  );

  const updateDevice = useCallback(
    async (data: UpdateDeviceRequest) => {
      if (DEV_DEBUG) console.log("[useDevices] updateDevice", data);
      return await updateDeviceMutation(data).unwrap();
    },
    [updateDeviceMutation]
  );

  const deleteDevice = useCallback(
    async (id: number) => {
      if (DEV_DEBUG) console.log("[useDevices] deleteDevice", id);
      return await deleteDeviceMutation(id).unwrap();
    },
    [deleteDeviceMutation]
  );

  // Enhanced refetch che forza il refresh
  const enhancedRefetch = useCallback(() => {
    if (DEV_DEBUG) console.log("[useDevices] refetch", queryParams);
    return refetch();
  }, [refetch, queryParams]);

  // Normalizza la risposta per gestire diversi formati
  let devices: Device[] = [];
  const resp: DevicesResponse = response as DevicesResponse;
  if (Array.isArray(resp)) {
    devices = resp;
  } else if (isWrapped(resp)) {
    devices = resp.data;
  }
  const meta: DevicesMeta = (isWrapped(resp) && resp.meta) || {
    page: 1,
    page_size: devices.length,
    total: devices.length,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  };

  if (DEV_DEBUG) {
    console.log("[useDevices] state", {
      devicesCount: devices.length,
      isLoading,
      isFetching,
      meta,
      error: !!error,
    });
  }

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
