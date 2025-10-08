import { useCallback } from "react";
import { useCrud } from "@root/hooks/useCrud";
import {
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
  useCreateDeviceMutation,
} from "@store_admin/devices/devices.api";
import type {
  CreateDeviceRequest,
  Device,
} from "@store_admin/devices/devices.types";

/**
 * Hook personalizzato che consolida tutte le operazioni CRUD sui dispositivi
 * Include create, update, delete e toggle status
 */
export function useDevicesCRUD(onSuccess?: () => void) {
  const { execUpdate, execDelete, execCreate } = useCrud();
  const [updateDeviceTrigger] = useUpdateDeviceMutation();
  const [deleteDeviceTrigger] = useDeleteDeviceMutation();
  const [createDeviceTrigger] = useCreateDeviceMutation();

  const handleCreateDevice = useCallback(
    async (deviceData: CreateDeviceRequest) => {
      const res = await execCreate(createDeviceTrigger, deviceData);
      if (!res.success) throw new Error(res.error);
      onSuccess?.();
    },
    [execCreate, createDeviceTrigger, onSuccess]
  );

  const handleEditDevice = useCallback(
    async (deviceId: number, updatedData: Partial<Device>) => {
      const res = await execUpdate(updateDeviceTrigger, {
        id: deviceId,
        data: updatedData,
      });
      if (!res.success) throw new Error(res.error);
      onSuccess?.();
    },
    [execUpdate, updateDeviceTrigger, onSuccess]
  );

  const handleDeleteDevice = useCallback(
    async (device: Device) => {
      const name = device.machine_Name || device.id;
      if (
        window.confirm(`Sei sicuro di voler eliminare il dispositivo ${name}?`)
      ) {
        const res = await execDelete(deleteDeviceTrigger, device.id);
        if (!res.success) throw new Error(res.error);
        onSuccess?.();
      }
    },
    [execDelete, deleteDeviceTrigger, onSuccess]
  );

  const handleToggleStatus = useCallback(async () => {
    onSuccess?.();
  }, [onSuccess]);

  return {
    handleCreateDevice,
    handleEditDevice,
    handleDeleteDevice,
    handleToggleStatus,
  };
}
