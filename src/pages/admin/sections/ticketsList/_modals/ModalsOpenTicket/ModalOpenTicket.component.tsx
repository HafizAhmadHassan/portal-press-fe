// ModalOpenTicket.component.tsx - VERSIONE CON DEBUG
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

import TicketHeader from "../_commons/TicketHeader/TicketHeader.component";
import DeviceCompactCard from "../_commons/DeviceCompactCard/DeviceCompactCard.component";
import OpenTicketForm from "./_components/OpenTicketForm/OpenTicketForm.component";
import InfoNote from "../_commons/InfoNote/InfoNote.component";

type Props = {
  device: Device;
  onSave: (data: MessageCreate) => Promise<void>;
  onClose?: () => void;
  triggerButton?: React.ReactNode;
};

export const ModalOpenTicket: React.FC<Props> = ({
  device,
  onSave,
  onClose,
  triggerButton,
}) => {
  const PROBLEM_OPTIONS: ProblemCategory[] = [
    "DATA_BASE",
    "IDRAULICO",
    "ELETTRICO",
    "MECCANICO",
  ];

  const [formData, setFormData] = useState<MessageCreate>({
    machine: Number(device?.id),
    problema: [],
    status: 1, // 1 = aperto, 2 = chiuso
    open_Description: "",
    customer_Name: device?.customer_Name ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof MessageCreate>(
    field: K,
    value: MessageCreate[K]
  ) => {
    console.log(`📝 Campo modificato: ${String(field)} =`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((e) => ({ ...e, [field as string]: "" }));
    }
  };

  const validate = () => {
    console.log("🔍 Validazione dati:", formData);

    const e: Record<string, string> = {};

    if (!formData.open_Description?.trim()) {
      e.open_Description = "Descrizione obbligatoria";
    }

    if (!formData.problema?.length) {
      e.problema = "Seleziona almeno un problema";
    }

    if (formData.status !== 1 && formData.status !== 2) {
      e.status = "Stato non valido (1 = aperto, 2 = chiuso)";
    }

    if (!formData.customer_Name?.trim()) {
      e.customer_Name = "Customer non disponibile per la macchina selezionata";
    }

    if (!formData.machine || formData.machine <= 0) {
      e.machine = "ID macchina non valido";
    }

    console.log("❌ Errori di validazione:", e);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    console.log("🚀 Tentativo salvataggio ticket...");
    console.log("📊 Dati form correnti:", formData);
    console.log("🏠 Device:", device);

    if (!validate()) {
      console.log("❌ Validazione fallita, interruzione");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("📤 Invio richiesta con dati:", {
        ...formData,
        // Assicurati che tutti i campi siano nel formato corretto
        machine: Number(formData.machine),
        status: Number(formData.status),
        problema: Array.isArray(formData.problema) ? formData.problema : [],
      });

      await onSave({
        ...formData,
        machine: Number(formData.machine),
        status: Number(formData.status),
        problema: Array.isArray(formData.problema) ? formData.problema : [],
      });

      console.log("✅ Ticket creato con successo!");

      // Reset form
      setFormData({
        machine: Number(device?.id),
        problema: [],
        status: 1,
        open_Description: "",
        customer_Name: device?.customer_Name ?? "",
      });

      // Chiudi modal se è fornita la callback
      onClose?.();
    } catch (error) {
      console.error("❌ Errore durante la creazione:", error);
      setErrors({
        submit: error instanceof Error ? error.message : "Errore sconosciuto",
      });
    } finally {
      setIsSubmitting(false);
    }
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
      confirmText={isSubmitting ? "Creazione..." : "Apri Ticket"}
      cancelText="Annulla"
      onConfirm={handleSave}
      onCancel={onClose}
      modalClassName={styles.modal}
      confirmDisabled={isSubmitting}
    >
      <div className={styles.content}>
        <TicketHeader device={device} />
        <DeviceCompactCard
          device={device}
          customer_name={formData.customer_Name}
          error={errors.customer_Name}
        />
        <OpenTicketForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          problemOptions={PROBLEM_OPTIONS}
        />

        {errors.submit && (
          <div
            style={{
              color: "var(--error-color)",
              padding: "8px",
              backgroundColor: "var(--error-bg)",
              borderRadius: "4px",
              marginTop: "12px",
            }}
          >
            <strong>Errore:</strong> {errors.submit}
          </div>
        )}

        <InfoNote>
          <strong>Importante:</strong> La <em>descrizione del problema</em> è
          obbligatoria. Le altre opzioni sono facoltative e aiutano a
          contestualizzare l'apertura.
        </InfoNote>

        {/* DEBUG INFO (rimuovi in produzione) */}
        {process.env.NODE_ENV === "development" && (
          <details style={{ marginTop: "12px", fontSize: "12px" }}>
            <summary>🔧 Debug Info</summary>
            <pre>{JSON.stringify({ formData, errors, device }, null, 2)}</pre>
          </details>
        )}
      </div>
    </Modal>
  );
};

export default ModalOpenTicket;
