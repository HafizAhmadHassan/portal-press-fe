// devices.selectors.ts - Selectors aggiornati con supporto per tutti i devices

import { createSelector } from "@reduxjs/toolkit";
import type { Device } from "@store_admin/devices/devices.types.ts";
import type { RootState } from "@root/store.ts";

// Selettori base
export const selectDevicesState = (state: RootState) => state.devices;
export const selectDevices = (state: RootState) => state.devices.devices;
export const selectAllDevices = (state: RootState) => state.devices.allDevices;
export const selectSelectedDevice = (state: RootState) =>
  state.devices.selectedDevice;
export const selectDevicesLoading = (state: RootState) =>
  state.devices.isLoading;
export const selectAllDevicesLoading = (state: RootState) =>
  state.devices.isLoadingAll;
export const selectAllDevicesError = (state: RootState) =>
  state.devices.allDevicesError;
export const selectDevicesError = (state: RootState) => state.devices.error;
export const selectDevicesPagination = (state: RootState) =>
  state.devices.pagination;
export const selectDevicesFilters = (state: RootState) => state.devices.filters;

// Selettori per devices filtrati per tipo di waste (usando devices paginati)
export const selectPlasticDevices = createSelector([selectDevices], (devices) =>
  devices.filter((device: Device) => device.waste === "Plastica")
);

export const selectDryDevices = createSelector([selectDevices], (devices) =>
  devices.filter((device: Device) => device.waste === "Secco")
);

export const selectWetDevices = createSelector([selectDevices], (devices) =>
  devices.filter((device: Device) => device.waste === "Umido")
);

export const selectGlassDevices = createSelector([selectDevices], (devices) =>
  devices.filter((device: Device) => device.waste === "Vetro")
);

export const selectIndifferenziatedDevices = createSelector(
  [selectDevices],
  (devices) =>
    devices.filter((device: Device) => device.waste === "Indifferenziato")
);

export const selectCartaDevices = createSelector([selectDevices], (devices) =>
  devices.filter((device: Device) => device.waste === "Carta")
);

export const selectVplDevices = createSelector([selectDevices], (devices) =>
  devices.filter((device: Device) => device.waste === "vpl")
);

// NUOVO: Selettori per TUTTI i devices filtrati per tipo di waste (per la mappa)
export const selectAllPlasticDevices = createSelector(
  [selectAllDevices],
  (allDevices) =>
    allDevices.filter((device: Device) => device.waste === "Plastica")
);

export const selectAllDryDevices = createSelector(
  [selectAllDevices],
  (allDevices) =>
    allDevices.filter((device: Device) => device.waste === "Secco")
);

export const selectAllWetDevices = createSelector(
  [selectAllDevices],
  (allDevices) =>
    allDevices.filter((device: Device) => device.waste === "Umido")
);

export const selectAllGlassDevices = createSelector(
  [selectAllDevices],
  (allDevices) =>
    allDevices.filter((device: Device) => device.waste === "Vetro")
);

export const selectAllIndifferenziatedDevices = createSelector(
  [selectAllDevices],
  (allDevices) =>
    allDevices.filter((device: Device) => device.waste === "Indifferenziato")
);

export const selectAllCartaDevices = createSelector(
  [selectAllDevices],
  (allDevices) =>
    allDevices.filter((device: Device) => device.waste === "Carta")
);

export const selectAllVplDevices = createSelector(
  [selectAllDevices],
  (allDevices) => allDevices.filter((device: Device) => device.waste === "vpl")
);

// Selettori per devices per status (usando devices paginati)
export const selectActiveDevices = createSelector([selectDevices], (devices) =>
  devices.filter((device: Device) => device.status === 1)
);

export const selectInactiveDevices = createSelector(
  [selectDevices],
  (devices) => devices.filter((device: Device) => device.status === 0)
);

export const selectBlockedDevices = createSelector([selectDevices], (devices) =>
  devices.filter((device: Device) => device.status_Machine_Blocked === true)
);

export const selectReadyDevices = createSelector([selectDevices], (devices) =>
  devices.filter((device: Device) => device.status_ready_d75_3_7 === true)
);

// NUOVO: Selettori per TUTTI i devices per status (per la mappa)
export const selectAllActiveDevices = createSelector(
  [selectAllDevices],
  (allDevices) => allDevices.filter((device: Device) => device.status === 1)
);

export const selectAllInactiveDevices = createSelector(
  [selectAllDevices],
  (allDevices) => allDevices.filter((device: Device) => device.status === 0)
);

export const selectAllBlockedDevices = createSelector(
  [selectAllDevices],
  (allDevices) =>
    allDevices.filter(
      (device: Device) => device.status_Machine_Blocked === true
    )
);

export const selectAllReadyDevices = createSelector(
  [selectAllDevices],
  (allDevices) =>
    allDevices.filter((device: Device) => device.status_ready_d75_3_7 === true)
);

// Conteggi per devices paginati
export const selectDevicesCount = createSelector([selectDevices], (devices) => {
  if (!Array.isArray(devices)) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      blocked: 0,
      ready: 0,
      plastic: 0,
      dry: 0,
      wet: 0,
      glass: 0,
      indifferenziato: 0,
      carta: 0,
      vpl: 0,
    };
  }

  return {
    total: devices.length,
    active: devices.filter((d) => d.status === 1).length,
    inactive: devices.filter((d) => d.status === 0).length,
    blocked: devices.filter((d) => d.status_Machine_Blocked === true).length,
    ready: devices.filter((d) => d.tatus_ready_d75_3_7 === true).length,
    plastic: devices.filter((d) => d.waste === "Plastica").length,
    dry: devices.filter((d) => d.waste === "Secco").length,
    wet: devices.filter((d) => d.waste === "Umido").length,
    glass: devices.filter((d) => d.waste === "Vetro").length,
    indifferenziato: devices.filter((d) => d.waste === "Indifferenziato")
      .length,
    carta: devices.filter((d) => d.waste === "Carta").length,
    vpl: devices.filter((d) => d.waste === "vpl").length,
  };
});

// NUOVO: Conteggi per TUTTI i devices (per la mappa)
export const selectAllDevicesCount = createSelector(
  [selectAllDevices],
  (allDevices) => {
    if (!Array.isArray(allDevices)) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        blocked: 0,
        ready: 0,
        plastic: 0,
        dry: 0,
        wet: 0,
        glass: 0,
        indifferenziato: 0,
        carta: 0,
        vpl: 0,
      };
    }

    return {
      total: allDevices.length,
      active: allDevices.filter((d) => d.status === 1).length,
      inactive: allDevices.filter((d) => d.status === 0).length,
      blocked: allDevices.filter((d) => d.status_Machine_Blocked === true)
        .length,
      ready: allDevices.filter((d) => d.tatus_ready_d75_3_7 === true).length,
      plastic: allDevices.filter((d) => d.waste === "Plastica").length,
      dry: allDevices.filter((d) => d.waste === "Secco").length,
      wet: allDevices.filter((d) => d.waste === "Umido").length,
      glass: allDevices.filter((d) => d.waste === "Vetro").length,
      indifferenziato: allDevices.filter((d) => d.waste === "Indifferenziato")
        .length,
      carta: allDevices.filter((d) => d.waste === "Carta").length,
      vpl: allDevices.filter((d) => d.waste === "vpl").length,
    };
  }
);

// Selettore per devices per città (usando devices paginati)
export const selectDevicesByCity = createSelector(
  [selectDevices],
  (devices) => {
    const devicesByCity: Record<string, Device[]> = {};
    devices.forEach((device: Device) => {
      if (device.city) {
        if (!devicesByCity[device.city]) {
          devicesByCity[device.city] = [];
        }
        devicesByCity[device.city].push(device);
      }
    });
    return devicesByCity;
  }
);

// NUOVO: Selettore per TUTTI i devices per città (per la mappa)
export const selectAllDevicesByCity = createSelector(
  [selectAllDevices],
  (allDevices) => {
    const devicesByCity: Record<string, Device[]> = {};
    allDevices.forEach((device: Device) => {
      if (device.city) {
        if (!devicesByCity[device.city]) {
          devicesByCity[device.city] = [];
        }
        devicesByCity[device.city].push(device);
      }
    });
    return devicesByCity;
  }
);

// Selettore per devices per cliente (usando devices paginati)
export const selectDevicesByCustomer = createSelector(
  [selectDevices],
  (devices) => {
    const devicesByCustomer: Record<string, Device[]> = {};
    devices.forEach((device: Device) => {
      if (device.customer) {
        if (!devicesByCustomer[device.customer]) {
          devicesByCustomer[device.customer] = [];
        }
        devicesByCustomer[device.customer].push(device);
      }
    });
    return devicesByCustomer;
  }
);

// NUOVO: Selettore per TUTTI i devices per cliente (per la mappa)
export const selectAllDevicesByCustomer = createSelector(
  [selectAllDevices],
  (allDevices) => {
    const devicesByCustomer: Record<string, Device[]> = {};
    allDevices.forEach((device: Device) => {
      if (device.customer) {
        if (!devicesByCustomer[device.customer]) {
          devicesByCustomer[device.customer] = [];
        }
        devicesByCustomer[device.customer].push(device);
      }
    });
    return devicesByCustomer;
  }
);

// Selettore per devices con coordinate GPS (usando devices paginati)
export const selectDevicesWithGPS = createSelector([selectDevices], (devices) =>
  devices.filter((device: Device) => device.gps_x && device.gps_y)
);

// NUOVO: Selettore per TUTTI i devices con coordinate GPS (per la mappa)
export const selectAllDevicesWithGPS = createSelector(
  [selectAllDevices],
  (allDevices) =>
    allDevices.filter((device: Device) => device.gps_x && device.gps_y)
);
