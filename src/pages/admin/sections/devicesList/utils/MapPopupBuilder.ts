import type { Device } from '@store_admin/devices/devices.types.ts';
import { DeviceHelpers } from '@sections_admin//devicesList/utils/DeviceHelpers';
import '@shared/map/styles/DevicePopup.module.scss';

export const createDevicePopup = (device: Device): string => {
  const address = DeviceHelpers.getFullAddress(device);
  const status = DeviceHelpers.getStatusLabel(device.status);
  const statusColor = DeviceHelpers.getStatusColor(device.status);
  const isBlocked = DeviceHelpers.isBlocked(device);
  const isReady = DeviceHelpers.isReady(device);

  return `
    <div class="device-popup ${isBlocked ? 'inactive' : ''}">
      
      <!-- HEADER -->
      <div class="popup-header">
        <div class="popup-title">${device.machineName || `Dispositivo ${device.id}`}</div>
        <span class="status-badge status-${statusColor}">${status}</span>
      </div>

      <!-- BODY -->
      <div class="popup-body">
        <div class="popup-row">
          <span class="popup-label">Cliente</span>
          <span class="popup-value">${device.customer || device.customerName || 'N/A'}</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">Indirizzo</span>
          <span class="popup-value">${address}</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">Tipo rifiuto</span>
          <span class="popup-value">${device.waste || 'N/A'}</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">IP Router</span>
          <span class="popup-value">${device.ip_router || 'N/A'}</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">ID</span>
          <span class="popup-value">#${device.id}</span>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="popup-footer">
        <!-- ALERTS -->
        ${isBlocked ? `<div class="popup-alert popup-blocked">🚫 Dispositivo Bloccato</div>` : ''}
        ${isReady ? `<div class="popup-alert popup-ready">✅ Pronto all'uso</div>` : ''}
        ${
          device.gps_x !== undefined &&
          device.gps_y !== undefined &&
          (isNaN(parseFloat(device.gps_x)) || isNaN(parseFloat(device.gps_y)))
            ? '<div class="popup-alert popup-warning">⚠️ Coordinate GPS non valide</div>'
            : ''
        }

        <!-- BOTTONI -->
        <div style="display:flex;gap:6px;margin-top:6px;">
          <button class="popup-btn primary">Dettagli</button>
          ${
            isBlocked
              ? `<button class="popup-btn success">Sblocca</button>`
              : `<button class="popup-btn error">Blocca</button>`
          }
        </div>
        
        
        
      </div>

    </div>
  `;
};
