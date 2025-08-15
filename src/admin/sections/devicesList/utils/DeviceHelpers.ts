import type { Device } from '@store_admin/devices/devices.types.ts';
import { createDevicePopup } from '@sections_admin//devicesList/utils/MapPopupBuilder';

export const DeviceHelpers = {
  getCoordinates: (device: Device) => {
    // log per debug
    console.log(`Parsing lat/long per device ${device.id}:`, device.gps_y, device.gps_x);

    // gps_y e gps_x arrivano come stringhe: le parsifichiamo
    const latitude = parseFloat(device.gps_y || '0');
    const longitude = parseFloat(device.gps_x || '0');
    console.log(` → parsed to`, { latitude, longitude });

    // accettiamo solo valori non-NaN e diversi da zero
    if (!isNaN(latitude) && !isNaN(longitude) && latitude !== 0 && longitude !== 0) {
      return { gps_y: latitude, gps_x: longitude };
    }
    console.log(` → coordinate non valide o zero, scarto`);
    return null;
  },

  isActive: (device: Device) => device.status === 1,
  isBlocked: (device: Device) => device.statusMachineBlocked === true,
  isReady: (device: Device) => device.statusReadyD75_3_7 === true,

  getFullAddress: (device: Device) => {
    const parts = [device.street || device.address, device.city, device.province].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Indirizzo non disponibile';
  },

  getStatusLabel: (status: number) => {
    if (status === 1) return 'Attivo';
    if (status === 0) return 'Inattivo';
    return 'Sconosciuto';
  },

  getStatusColor: (status: number) => {
    if (status === 1) return 'green';
    if (status === 0) return 'red';
    return 'gray';
  },

  transformDevicesToMapData: (devices: Device[]) => {
    console.log('=== transformDevicesToMapData START ===');
    console.log('Input devices array:', devices);

    const mapped = devices.map((device) => {
      const coords = DeviceHelpers.getCoordinates(device);
      return { id: device.id, coords };
    });
    console.log('Preliminare (id + coords):', mapped);

    // Conserva solo quelli con coords valide
    const filtered = mapped.filter((entry) => entry.coords);
    console.log('Dopo filter:', filtered);

    return filtered.map(({ id, coords }) => {
      const device = devices.find((d) => d.id === id)!;
      return {
        id: device.id.toString(),
        name: device.machineName || `Dispositivo ${device.id}`,
        gps_y: coords!.gps_y,
        gps_x: coords!.gps_x,
        activeStatus: DeviceHelpers.isActive(device),
        popupContent: createDevicePopup(device),
        additionalData: device,
      };
    });
  },
};
