import React, { useState } from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { AlertCircle, Trash2 } from "lucide-react";
import type { Device } from "@store_admin/devices/devices.types.ts";
import "./ModalDeleteDevicesConfirm.scss";

interface Props {
  device: Device;
  onConfirm?: (d: Device) => Promise<void> | void;
  triggerButton?: React.ReactNode;
}

export const ModalDeleteDevicesConfirm: React.FC<Props> = ({
  device,
  onConfirm,
  triggerButton,
}) => {
  const [confirmText, setConfirmText] = useState("");

  const handleConfirm = async () => {
    if (confirmText.toLowerCase() !== "elimina") {
      return;
    }

    if (onConfirm) {
      await onConfirm(device);
    }
  };

  const defaultTriggerButton = (
    <SimpleButton size="bare" variant="ghost" color="danger" icon={Trash2} />
  );

  const isConfirmEnabled = confirmText.toLowerCase() === "elimina";

  return (
    <Modal
      size="md"
      triggerButton={triggerButton || defaultTriggerButton}
      title="Elimina Device"
      description={`Attenzione! Stai per eliminare definitivamente il device "${
        device?.machine__Name || "Sconosciuto"
      }".`}
      confirmText="Elimina Definitivamente"
      cancelText="Annulla"
      icon={<AlertCircle className="modal-delete-icon" size={24} />}
      variant="danger"
      onConfirm={isConfirmEnabled ? handleConfirm : undefined}
      modalClassName="modal-delete"
    >
      <div className="modal-delete-content">
        {/* Device Info Card - MIGLIORATA */}
        <div className="device-info-card">
          {/* Header con ID e Nome */}
          <div className="device-main-info">
            <div className="device-id-section">
              <div className="device-id-badge">
                <span>#{device?.id || "N/A"}</span>
              </div>
              <div className="device-primary-info">
                <h4 className="device-name">
                  {device?.machine__Name || "Nome non disponibile"}
                </h4>
                <p className="device-status">
                  {device?.address || "Indirizzo non disponibile"}
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="device-divider"></div>

          {/* Specifiche Tecniche */}
          <div className="device-technical-specs">
            <h5 className="specs-title">Specifiche Tecniche</h5>
            <div className="specs-grid">
              <div className="spec-row">
                <span className="spec-label">Indirizzo IP</span>
                <span className="spec-value">
                  {device?.ip_router || "Non disponibile"}
                </span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Coordinate GPS</span>
                <span className="spec-value">
                  {device?.gps_x && device?.gps_y
                    ? `${device.gps_x}, ${device.gps_y}`
                    : "Non disponibili"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="warning-message">
          <div className="warning-content">
            <AlertCircle className="warning-icon" size={20} />
            <div className="warning-text">
              <p className="warning-title">
                Attenzione: Questa azione è irreversibile!
              </p>
              <p className="warning-description">
                Una volta eliminato, il dispositivo e tutti i suoi dati
                associati verranno rimossi permanentemente dal sistema.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Input */}
        <div className="confirmation-input">
          <label className="confirmation-label">
            Per confermare, digita <strong>"elimina"</strong>:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className={`confirmation-field ${
              isConfirmEnabled ? "confirmation-field--valid" : ""
            }`}
            placeholder="elimina"
          />
        </div>
      </div>
    </Modal>
  );
};
