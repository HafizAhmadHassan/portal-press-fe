import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import Modal from "@components/shared/modal/Modal";
import type { User } from "@store_admin/users/user.types";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";

interface ModalDeleteConfirmProps {
  user: User;
  onConfirm: (user: User) => void;
}

export const ModalDeleteConfirm: React.FC<ModalDeleteConfirmProps> = ({
  user,
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
      title={`Cancellazione Utente ${user?.full_name}`}
      description="Sei sicuro di voler cancellare questo utente?"
      confirmText="Conferma la cancellazione"
      cancelText="Annulla"
      icon={AlertTriangle}
      onConfirm={() => onConfirm(user)}
    />
  );
};
