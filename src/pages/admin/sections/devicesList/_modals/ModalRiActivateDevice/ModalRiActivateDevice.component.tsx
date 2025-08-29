import React from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { CheckCircle, RotateCcw } from "lucide-react";
import type { Device } from "@store_admin/devices/devices.types.ts";
import styles from "./ModalRiActivateDevice.module.scss";

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
    <SimpleButton
      variant="outline"
      color="success"
      size="sm"
      aria-label="Riattiva dispositivo"
    >
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
        device?.machine_Name || "Sconosciuto"
      }"?`}
      confirmText="Riattiva Device"
      cancelText="Annulla"
      onConfirm={handleConfirm}
      modalClassName={styles.modalReactivate}
      defaultActions={{
        variantCancel: undefined,
        variantConfirm: undefined,
        colorCancel: "error",
        colorConfirm: "success",
      }}
    >
      <div className={styles.modalReactivateContent}>
        {/* Device Info Card */}
        <div
          className={styles.deviceInfoCard}
          role="group"
          aria-label="Informazioni dispositivo"
        >
          <div className={styles.deviceMainInfo}>
            <div className={styles.deviceIdSection}>
              <div className={styles.deviceIdBadge} aria-hidden="true">
                <span>#{device?.id ?? "N/A"}</span>
              </div>

              <div className={styles.devicePrimaryInfo}>
                {/* <h4 className={styles.deviceName}>{device?.machine_Name || 'Nome non disponibile'}</h4> */}
                <p className={styles.deviceStatus}>
                  {device?.address || "Indirizzo non disponibile"}
                </p>
                <p className={styles.deviceStatus}>
                  {device?.city || "Città non disponibile"}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.deviceDivider} />

          <div className={styles.deviceTechnicalSpecs}>
            <h5 className={styles.specsTitle}>Specifiche Tecniche</h5>
            <div className={styles.specsGrid}>
              <div className={styles.specRow}>
                <span className={styles.specLabel}>Indirizzo IP</span>
                <span className={styles.specValue}>
                  {device?.ip_Router || "Non disponibile"}
                </span>
              </div>

              <div className={styles.specRow}>
                <span className={styles.specLabel}>Coordinate GPS</span>
                <span className={styles.specValue}>
                  {device?.gps_x && device?.gps_y
                    ? `${device.gps_x}, ${device.gps_y}`
                    : "Non disponibili"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Success copy */}
        <div className={styles.successMessage} role="note" aria-live="polite">
          <div className={styles.successContent}>
            <CheckCircle
              className={styles.successIcon}
              size={20}
              aria-hidden="true"
            />
            <div className={styles.successText}>
              <p className={styles.successTitle}>Riattivazione Device</p>
              <p className={styles.successDescription}>
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
