import React from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { CheckCircle, RotateCcw } from "lucide-react";
import type { Device } from "@store_admin/devices/devices.types.ts";
import "./ModalRiActivateDevice.scss";

interface Props {
  device: Device;
  onConfirm?: (d: Device) => Promise<void> | void;
  triggerButton?: React.ReactNode;
}

export const ModalRiActiveDevice: React.FC<Props> = ({
  device,
  onConfirm,
  triggerButton,
}) => {
  const handleConfirm = async () => {
    if (onConfirm) await onConfirm(device);
  };

  const defaultTriggerButton = (
    <SimpleButton variant="outline" color="success" size="sm">
      <RotateCcw size={14} />
      Riattiva
    </SimpleButton>
  );

  return (
    <Modal
      size="md"
      triggerButton={triggerButton || defaultTriggerButton}
      title="Riattivazione Device"
      description={`Sei sicuro di voler riattivare il device "${
        device?.machine__Name || "Sconosciuto"
      }"?`}
      confirmText="Riattiva Device"
      cancelText="Annulla"
      onConfirm={handleConfirm}
      modalClassName="modal-reactivate"
      defaultActions={{
        variantCancel: undefined,
        variantConfirm: undefined,
        colorCancel: undefined,
        colorConfirm: undefined,
      }}
    >
      <div className="modal-reactivate-content">
        {/* Device Info Card */}
        <div className="device-info-card">
          <div className="device-main-info">
            <div className="device-id-section">
              <div className="device-id-badge">
                <span>#{device?.id || "N/A"}</span>
              </div>

              <div className="device-primary-info">
                {/* Se vuoi riattivare il nome, togli il commento */}
                {/* <h4 className="device-name">{device?.machine__Name || 'Nome non disponibile'}</h4> */}
                <p className="device-status">
                  {device?.address || "Indirizzo non disponibile"}
                </p>
                <p className="device-status">
                  {device?.city || "Città non disponibile"}
                </p>
              </div>
            </div>
          </div>

          <div className="device-divider" />

          <div className="device-technical-specs">
            <h5 className="specs-title">Specifiche Tecniche</h5>
            <div className="specs-grid">
              <div className="spec-row">
                <span className="spec-label">Indirizzo IP</span>
                <span className="spec-value">
                  {device?.ip_Router || "Non disponibile"}
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

        {/* Success copy */}
        <div className="success-message">
          <div className="success-content">
            <CheckCircle className="success-icon" size={20} />
            <div className="success-text">
              <p className="success-title">Riattivazione Device</p>
              <p className="success-description">
                Il dispositivo tornerà operativo e riprenderà le sue funzioni
                normali. Tutti i servizi associati verranno riavviati
                automaticamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
