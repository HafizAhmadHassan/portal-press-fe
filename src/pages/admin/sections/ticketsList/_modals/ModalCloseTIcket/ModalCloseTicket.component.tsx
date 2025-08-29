import { Eye } from "lucide-react";
import React, { useMemo, useState } from "react";
import Modal from "@components/shared/modal/Modal";
import styles from "./ModalCloseTicket.module.scss";
import InfoNote from "../_commons/InfoNote/InfoNote.component";
import TicketHeader from "../_commons/TicketHeader/TicketHeader.component";
import type { CloseTicketData } from "../../_types/TicketWithDevice.types";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import CloseTicketForm from "./_components/CloseTicketForm/CloseTicketForm.component";
import DeviceCompactCard from "../_commons/DeviceCompactCard/DeviceCompactCard.component";
import type { TicketWithDevice } from "@root/pages/admin/core/store/tickets/hooks/useTicketWithDevices";

type Props = {
  ticket: TicketWithDevice;
  onSave: (data: CloseTicketData) => Promise<void>;
  triggerButton?: React.ReactNode;
  btnClassName?: string;
};

const ModalCloseTicket: React.FC<Props> = ({
  ticket,
  onSave,
  triggerButton,
  btnClassName,
}) => {
  const dev = ticket?.device;

  const defaultInfo = useMemo(() => {
    const customer_Name = dev?.customer_Name || "N/D";
    const machineName = dev?.machine_Name ? ` – ${dev?.machine_Name}` : "";
    const waste = dev?.waste ? `\nTipo rifiuto: ${dev?.waste}` : "";
    return `Ticket #${ticket?.id}${machineName}\nCliente: ${customer_Name}${waste}`;
  }, [ticket?.id, dev?.machine_Name, dev?.customer_Name, dev?.waste]);

  const [formData, setFormData] = useState<CloseTicketData>({
    id: ticket?.id,
    date_Time: new Date(),
    info: defaultInfo,
    open_Description: ticket?.open_Description || "",
    close_Description: ticket?.close_Description || "", // Campo principale
    inGaranzia: false,
    fuoriGaranzia: false,
    machine_retrival: false,
    machine_not_repairable: false,
    customer_Name: dev?.customer_Name || "N/D",
    address:
      dev?.address ||
      `${dev?.city || ""} ${dev?.province || ""}`.trim() ||
      "N/A",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <K extends keyof CloseTicketData>(
    field: K,
    value: CloseTicketData[K]
  ) => {
    console.log(`Modifica campo ${String(field)}:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((e) => ({ ...e, [field as string]: "" }));
    }
  };

  const validate = () => {
    console.log("Validazione dati chiusura:", formData);

    const e: Record<string, string> = {};
    if (!formData.close_Description?.trim()) {
      e.close_Description = "La descrizione di chiusura è obbligatoria";
    }

    console.log("Errori validazione:", e);
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    console.log("Tentativo chiusura ticket:", formData);

    if (!validate()) {
      console.log("Validazione fallita");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSave(formData);
      console.log("Ticket chiuso con successo");

      // Reset form
      setFormData({
        id: ticket?.id,
        date_Time: new Date(),
        info: defaultInfo,
        open_Description: ticket?.open_Description || "",
        close_Description: "",
        inGaranzia: false,
        fuoriGaranzia: false,
        machine_retrival: false,
        machine_not_repairable: false,
        address:
          dev?.address ||
          `${dev?.city || ""} ${dev?.province || ""}`.trim() ||
          "N/A",
      });
      setErrors({});
    } catch (error) {
      console.error("Errore chiusura ticket:", error);
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
      btnClassName={btnClassName}
      size="lg"
      confirmText={isSubmitting ? "Chiusura..." : "Chiudi Ticket"}
      cancelText="Annulla"
      onConfirm={handleSave}
      confirmDisabled={isSubmitting}
      modalClassName={styles.modal}
    >
      <div className={styles.content}>
        <TicketHeader device={dev} mode="close" ticketId={ticket?.id} />

        <DeviceCompactCard
          device={dev}
          customer_Name={dev?.customer_Name || "N/D"}
        />

        <CloseTicketForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
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
          <strong>Importante:</strong> La <em>descrizione di chiusura</em> è
          obbligatoria. Specifica come è stato risolto il problema.
        </InfoNote>

        {/* Debug info */}
        {process.env.NODE_ENV === "development" && (
          <details style={{ marginTop: "12px", fontSize: "12px" }}>
            <summary>Debug Info Chiusura</summary>
            <pre>
              {JSON.stringify(
                {
                  formData,
                  ticket: {
                    id: ticket.id,
                    machine: ticket.machine,
                    customer_Name: ticket.customer_Name,
                  },
                  device: dev,
                },
                null,
                2
              )}
            </pre>
          </details>
        )}
      </div>
    </Modal>
  );
};

export default ModalCloseTicket;
