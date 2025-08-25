import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { SimpleButton } from '@shared/simple-btn/SimpleButton.component';
import Modal from '@components/shared/modal/Modal';

interface ModalDeleteConfirmProps {
  device: any;
  onConfirm: (device: any) => void;
}

export const ModalDeleteConfirm: React.FC<ModalDeleteConfirmProps> = ({ device, onConfirm }) => {
  return (
    <Modal
      size="bare"
      triggerButton={
        <SimpleButton size="bare" color="danger" variant="ghost" icon={Trash2}>
          {''}
        </SimpleButton>
      }
      title={`Cancellazione Utente ${device?.device_name}`}
      description="Sei sicuro di voler cancellare questo utente?"
      confirmText="Conferma la cancellazione"
      cancelText="Annulla"
      icon={<AlertTriangle className="size-5 text-red-500" />}
      variant="danger"
      onConfirm={() => onConfirm(device)}
    />
  );
};
