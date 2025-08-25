// Nel tuo hook useDevices, assicurati di esportare direttamente gli hook RTK Query:

import {
  useCreateDeviceMutation,
  useDeleteDeviceMutation,
  useGetDevicesQuery,
  useUpdateDeviceMutation,
} from '@store_admin/devices/devices.api';

export const useDevices = (queryParams: any) => {
  // Query per ottenere i devices
  const { data: response, isLoading, error, refetch } = useGetDevicesQuery(queryParams);

  // Mutations
  const [createDevice] = useCreateDeviceMutation();
  const [updateDevice] = useUpdateDeviceMutation();
  const [deleteDevice] = useDeleteDeviceMutation();

  return {
    devices: response?.data || [],
    meta: response?.meta,
    isLoading,
    error,
    refetch,
    // ✅ Esponi direttamente gli hook delle mutations
    createDevice,
    updateDevice,
    deleteDevice,
  };
};
