import type { Device } from "@store_admin/devices/devices.types.ts";
import { createDevicePopup } from "@sections_admin//devicesList/utils/MapPopupBuilder";

export const DeviceHelpers = {
  getCoordinates: (device: Device) => {
    const latitude = parseFloat(device.gps_y || "0");
    const longitude = parseFloat(device.gps_x || "0");

    if (
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      latitude !== 0 &&
      longitude !== 0
    ) {
      return { gps_y: latitude, gps_x: longitude };
    }
    return null;
  },

  isActive: (device: Device) => device.status === 1,
  isBlocked: (device: Device) => device.status_Machine_Blocked === true,
  isReady: (device: Device) => device.status_READY_D75_3_7 === true,

  getFullAddress: (device: Device) => {
    const parts = [
      device.street || device.address,
      device.city,
      device.province,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Indirizzo non disponibile";
  },

  getStatusLabel: (status: number) => {
    if (status === 1) return "Attivo";
    if (status === 0) return "Inattivo";
    return "Sconosciuto";
  },

  getStatusColor: (status: number) => {
    if (status === 1) return "green";
    if (status === 0) return "red";
    return "gray";
  },

  transformDevicesToMapData: (devices: Device[]) => {
    const mapped = devices.map((device) => {
      const coords = DeviceHelpers.getCoordinates(device);
      return { id: device.id, coords };
    });

    const filtered = mapped.filter((entry) => entry.coords);

    return filtered.map(({ id, coords }) => {
      const device = devices.find((d) => d.id === id)!;
      return {
        id: device.id.toString(),
        name: device.machine_Name || `Dispositivo ${device.id}`,
        gps_y: coords!.gps_y,
        gps_x: coords!.gps_x,
        activeStatus: DeviceHelpers.isActive(device),
        popupContent: createDevicePopup(device), // Rimossa la callback
        additionalData: device,
      };
    });
  },
};
