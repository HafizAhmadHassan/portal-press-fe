// ModalRiActivateDevice.component.tsx
import React from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { CheckCircle, RotateCcw } from "lucide-react";
import type { Device } from "@store_admin/devices/devices.types.ts";
import styles from "./ModalRiActivateDevice.module.scss";
import { useWritePlcMutation } from "@store_device/plc/plc.api";

interface Props {
  device: Device;
  onConfirm?: (d: Device) => Promise<void> | void; // <- la useremo per ricaricare la pagina
  triggerButton?: React.ReactNode;
}

export const ModalRiActiveDevice: React.FC<Props> = ({
  device,
  onConfirm,
  triggerButton,
}) => {
  const [writePlc, { isLoading: writing, error: writeError }] =
    useWritePlcMutation();

  const handleConfirm = async () => {
    // payload per “riattiva”
    const payload: any = {
      status_Machine_Block: 0,
      // se il backend richiede un identificatore del device, sblocca uno di questi:
      // device_id: device.id,
      // id: device.id,
    };

    await writePlc(payload).unwrap();

    // dopo il POST, rinfresca tutto tramite callback passata dalla pagina
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
      title="Riattivazione Macchina"
      description={`Sei sicuro di voler riattivare la macchina "${
        device?.machine_Name || "Sconosciuto"
      }"?`}
      confirmText="Riattiva Macchina"
      cancelText="Annulla"
      onConfirm={handleConfirm}
      loading={writing} // blocca i bottoni durante la chiamata
      modalClassName={styles.modalReactivate}
      defaultActions={{
        variantCancel: undefined,
        variantConfirm: undefined,
        colorCancel: "danger",
        colorConfirm: "success",
      }}
    >
      <div className={styles.modalReactivateContent}>
        {writeError && (
          <div className={styles.errorBanner} role="alert">
            Errore durante la riattivazione PLC.
          </div>
        )}

        {/* … resto del contenuto invariato … */}
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
                normali…
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
