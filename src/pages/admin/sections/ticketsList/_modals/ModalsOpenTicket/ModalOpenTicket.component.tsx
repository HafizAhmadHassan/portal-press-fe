// src/sections/ticketsList/_modals/ModalOpenTicket/ModalOpenTicket.component.tsx
import React, { useState } from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { Eye } from "lucide-react";

import type { Device } from "@store_admin/devices/devices.types";
import type {
  MessageCreate,
  ProblemCategory,
} from "@store_admin/tickets/ticket.types";

import styles from "./ModalOpenTicket.module.scss";

import OpenTicketHeader from "./_components/OpenTicketHeader/OpenTicketHeader.component";
import DeviceCompactCard from "./_components/DeviceCompactCard/DeviceCompactCard.component";
import OpenTicketForm from "./_components/OpenTicketForm/OpenTicketForm.component";
import InfoNote from "./_components/InfoNote/InfoNote.component";

type Props = {
  device: Device;
  onSave: (data: MessageCreate) => Promise<void>;
  /** opzionale: se non lo passi, mostro l’icona a “occhio” */
  triggerButton?: React.ReactNode;
};

export const ModalOpenTicket: React.FC<Props> = ({
  device,
  onSave,
  triggerButton,
}) => {
  const PROBLEM_OPTIONS: ProblemCategory[] = [
    "DATA_BASE",
    "IDRAULICO",
    "ELETTRICO",
    "MECCANICO",
  ];

  const [formData, setFormData] = useState<MessageCreate>({
    machine: Number(device.id),
    problema: [],
    status: 1, // 1 = aperto, 2 = chiuso
    open_Description: "",
    customer: device.customer ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = <K extends keyof MessageCreate>(
    field: K,
    value: MessageCreate[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((e) => ({ ...e, [field as string]: "" }));
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.open_Description.trim())
      e.open_Description = "Descrizione obbligatoria";
    if (!formData.problema?.length) e.problema = "Seleziona almeno un problema";
    if (formData.status !== 1 && formData.status !== 2)
      e.status = "Stato non valido (1 = aperto, 2 = chiuso)";
    if (!formData.customer?.trim())
      e.customer = "Customer non disponibile per la macchina selezionata";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave(formData);
  };

  return (
    <Modal
      triggerButton={
        triggerButton ?? (
          <SimpleButton
            size="bare"
            color="primary"
            variant="ghost"
            icon={Eye}
          />
        )
      }
      size="lg"
      confirmText="Apri Ticket"
      cancelText="Annulla"
      onConfirm={handleSave}
      modalClassName={styles.modal}
    >
      <div className={styles.content}>
        <OpenTicketHeader device={device} />
        <DeviceCompactCard
          device={device}
          customer={formData.customer}
          error={errors.customer}
        />
        <OpenTicketForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          problemOptions={PROBLEM_OPTIONS}
        />
        <InfoNote />
      </div>
    </Modal>
  );
};

export default ModalOpenTicket;
