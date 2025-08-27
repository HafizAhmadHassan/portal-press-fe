import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Device } from "@store_admin/devices/devices.types.ts";

const initialState: any = {
  devices: [], // Devices paginati
  allDevices: [], // TUTTI i devices (per la mappa)
  selectedDevice: null,
  isLoading: false,
  isLoadingAll: false, // Loading specifico per getAllDevices
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: "",
    waste: "",
    status: null,
    city: "",
    province: "",
    customer: "",
    status_Machine_Blocked: null,
    tatus_ready_d75_3_7: null,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    // Imposta lista devices paginati
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.devices = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // NUOVO: Imposta TUTTI i devices (per la mappa)
    setAllDevices: (state, action: PayloadAction<Device[]>) => {
      state.allDevices = action.payload;
      state.isLoadingAll = false;
      state.error = null;
    },

    // Aggiungi nuovo device a entrambe le liste
    addDevice: (state, action: PayloadAction<Device>) => {
      state.devices.unshift(action.payload);
      state.allDevices.unshift(action.payload);
      state.pagination.total += 1;
    },

    // Aggiorna device esistente in entrambe le liste
    updateDeviceInList: (state, action: PayloadAction<Device>) => {
      // Aggiorna nei devices paginati
      const paginatedIndex = state.devices.findIndex(
        (device: Device) => device.id === action.payload.id
      );
      if (paginatedIndex !== -1) {
        state.devices[paginatedIndex] = action.payload;
      }

      // Aggiorna in tutti i devices
      const allIndex = state.allDevices.findIndex(
        (device: Device) => device.id === action.payload.id
      );
      if (allIndex !== -1) {
        state.allDevices[allIndex] = action.payload;
      }

      // Aggiorna selectedDevice se è lo stesso
      if (state.selectedDevice?.id === action.payload.id) {
        state.selectedDevice = action.payload;
      }
    },

    // Rimuovi device da entrambe le liste
    removeDevice: (state, action: PayloadAction<string>) => {
      // Rimuovi dai devices paginati
      state.devices = state.devices.filter(
        (device: Device) => device.id !== action.payload
      );
      // Rimuovi da tutti i devices
      state.allDevices = state.allDevices.filter(
        (device: Device) => device.id !== action.payload
      );

      state.pagination.total = Math.max(0, state.pagination.total - 1);

      // Rimuovi selectedDevice se è lo stesso
      if (state.selectedDevice?.id === action.payload) {
        state.selectedDevice = null;
      }
    },

    // Rimuovi più devices da entrambe le liste
    removeDevices: (state, action: PayloadAction<string[]>) => {
      const idsToRemove = new Set(action.payload);

      // Rimuovi dai devices paginati
      state.devices = state.devices.filter(
        (device: Device) => !idsToRemove.has(device.id)
      );
      // Rimuovi da tutti i devices
      state.allDevices = state.allDevices.filter(
        (device: Device) => !idsToRemove.has(device.id)
      );

      state.pagination.total = Math.max(
        0,
        state.pagination.total - action.payload.length
      );

      // Rimuovi selectedDevice se è incluso
      if (state.selectedDevice && idsToRemove.has(state.selectedDevice.id)) {
        state.selectedDevice = null;
      }
    },

    // Imposta device selezionato
    setSelectedDevice: (state, action: PayloadAction<Device | null>) => {
      state.selectedDevice = action.payload;
    },

    // Imposta paginazione
    setPagination: (
      state,
      action: PayloadAction<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      }>
    ) => {
      state.pagination = action.payload;
    },

    // Imposta filtri
    setFilters: (state, action: PayloadAction<Partial<any["filters"]>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filtri
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Imposta loading per devices paginati
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // NUOVO: Imposta loading per tutti i devices
    setLoadingAll: (state, action: PayloadAction<boolean>) => {
      state.isLoadingAll = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Imposta errore
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isLoadingAll = false;
    },

    // Pulisci errore
    clearError: (state) => {
      state.error = null;
    },

    // Reset completo dello stato
    resetDevicesState: (_state) => {
      return initialState;
    },

    // Aggiorna stato di più devices in entrambe le liste
    updateMultipleDevices: (
      state,
      action: PayloadAction<{
        deviceIds: string[];
        updates: Partial<Device>;
      }>
    ) => {
      const { deviceIds, updates } = action.payload;
      const idsSet = new Set(deviceIds);

      // Aggiorna nei devices paginati
      state.devices = state.devices.map((device: Device) =>
        idsSet.has(device.id) ? { ...device, ...updates } : device
      );

      // Aggiorna in tutti i devices
      state.allDevices = state.allDevices.map((device: Device) =>
        idsSet.has(device.id) ? { ...device, ...updates } : device
      );

      // Aggiorna selectedDevice se incluso
      if (state.selectedDevice && idsSet.has(state.selectedDevice.id)) {
        state.selectedDevice = { ...state.selectedDevice, ...updates };
      }
    },

    // Toggle status per più devices in entrambe le liste
    toggleMultipleDevicesStatus: (
      state,
      action: PayloadAction<{
        deviceIds: string[];
        status: number;
      }>
    ) => {
      const { deviceIds, status } = action.payload;
      const idsSet = new Set(deviceIds);

      // Aggiorna nei devices paginati
      state.devices = state.devices.map((device: Device) =>
        idsSet.has(device.id) ? { ...device, status } : device
      );

      // Aggiorna in tutti i devices
      state.allDevices = state.allDevices.map((device: Device) =>
        idsSet.has(device.id) ? { ...device, status } : device
      );

      // Aggiorna selectedDevice se incluso
      if (state.selectedDevice && idsSet.has(state.selectedDevice.id)) {
        state.selectedDevice = { ...state.selectedDevice, status };
      }
    },

    // Toggle block status per più devices in entrambe le liste
    toggleMultipleDevicesBlock: (
      state,
      action: PayloadAction<{
        deviceIds: string[];
        blocked: boolean;
      }>
    ) => {
      const { deviceIds, blocked } = action.payload;
      const idsSet = new Set(deviceIds);

      // Aggiorna nei devices paginati
      state.devices = state.devices.map((device: Device) =>
        idsSet.has(device.id)
          ? { ...device, status_Machine_Blocked: blocked }
          : device
      );

      // Aggiorna in tutti i devices
      state.allDevices = state.allDevices.map((device: Device) =>
        idsSet.has(device.id)
          ? { ...device, status_Machine_Blocked: blocked }
          : device
      );

      // Aggiorna selectedDevice se incluso
      if (state.selectedDevice && idsSet.has(state.selectedDevice.id)) {
        state.selectedDevice = {
          ...state.selectedDevice,
          status_Machine_Blocked: blocked,
        };
      }
    },
  },
});

// Export del slice
export { devicesSlice };

// Export delle actions
export const {
  setDevices,
  setAllDevices, // NUOVO
  addDevice,
  updateDeviceInList,
  removeDevice,
  removeDevices,
  setSelectedDevice,
  setPagination,
  setFilters,
  resetFilters,
  setLoading,
  setLoadingAll, // NUOVO
  setError,
  clearError,
  resetDevicesState,
  updateMultipleDevices,
  toggleMultipleDevicesStatus,
  toggleMultipleDevicesBlock,
} = devicesSlice.actions;

// Export del reducer (default export)
export default devicesSlice.reducer;
