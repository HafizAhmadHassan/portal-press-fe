// @sections_admin/gpsList/_modals/ModalDeleteGpsConfirm.component.tsx
import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";
import Modal from "@components/shared/modal/Modal";
import type { GpsDevice } from "@store_admin/gps/gps.types";

interface Props {
  device: GpsDevice;
  onConfirm: (device: GpsDevice) => void;
}

export const ModalDeleteGpsConfirm: React.FC<Props> = ({
  device,
  onConfirm,
}) => {
  return (
    <Modal
      size="bare"
      triggerButton={
        <SimpleButton size="bare" color="danger" variant="ghost" icon={Trash2}>
          {""}
        </SimpleButton>
      }
      title={`Cancellazione GPS ${device?.codice}`}
      description={`Sei sicuro di voler cancellare il dispositivo "${device?.address}"?`}
      confirmText="Conferma"
      cancelText="Annulla"
      icon={AlertTriangle}
      onConfirm={() => onConfirm(device)}
    />
  );
};
