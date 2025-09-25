import type { Device } from "@store_admin/devices/devices.types";
import { DeviceHelpers } from "@sections_admin/devicesList/utils/DeviceHelpers";
import "@shared/map/styles/DevicePopup.scss";

export const createDevicePopup = (device: Device): string => {
  const address = DeviceHelpers.getFullAddress(device);
  const status = DeviceHelpers.getStatusLabel(device.status);
  const statusColor = DeviceHelpers.getStatusColor(device.status);
  const isBlocked = DeviceHelpers.isBlocked(device);
  const isReady = DeviceHelpers.isReady(device);

  return `
    <div class="device-popup popup ${
      isBlocked ? "inactive" : ""
    }" data-device-id="${device.id}">
      
      <!-- HEADER -->
      <div class="popup-header">
        <div class="popup-title">
          ${device.machine_Name || `Dispositivo ${device.id}`}
        </div>
        <span class="status-badge status-${statusColor}">${status}</span>
      </div>

      <!-- BODY -->
      <div class="popup-body">
        <div class="popup-row">
          <span class="popup-label">Cliente</span>
          <span class="popup-value">${
            device.customer || device.customer_Name || "N/A"
          }</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">Indirizzo</span>
          <span class="popup-value">${address}</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">Tipo rifiuto</span>
          <span class="popup-value">${device.waste || "N/A"}</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">IP Router</span>
          <span class="popup-value">${device.ip_Router || "N/A"}</span>
        </div>
        <div class="popup-row">
          <span class="popup-label">ID</span>
          <span class="popup-value">#${device.id}</span>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="popup-footer">
        <!-- ALERTS -->
        ${
          isBlocked
            ? `<div class="popup-alert popup-blocked">🚫 Dispositivo Bloccato</div>`
            : ""
        }
        ${
          isReady
            ? `<div class="popup-alert popup-ready">✅ Pronto all'uso</div>`
            : ""
        }
        ${
          device.gps_x !== undefined &&
          device.gps_y !== undefined &&
          (isNaN(parseFloat(device.gps_x)) || isNaN(parseFloat(device.gps_y)))
            ? `<div class="popup-alert popup-warning">⚠️ Coordinate GPS non valide</div>`
            : ""
        }

        <!-- BOTTONI -->
        <button class="popup-btn primary device-details-btn" data-device-id="${
          device.id
        }">
          Dettagli
        </button>
      </div>
    </div>
  `;
};
