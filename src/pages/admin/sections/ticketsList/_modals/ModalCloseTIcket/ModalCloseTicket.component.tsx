import { Eye } from "lucide-react";
import React, { useMemo, useState } from "react";
import Modal from "@components/shared/modal/Modal";
import styles from "./ModalCloseTicket.module.scss";
import InfoNote from "../_commons/InfoNote/InfoNote.component";
import type { TicketWithDevice } from "@store_admin/tickets/ticket.api";
import TicketHeader from "../_commons/TicketHeader/TicketHeader.component";
import type { CloseTicketData } from "../../_types/TicketWithDevice.types";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import CloseTicketForm from "./_components/CloseTicketForm/CloseTicketForm.component";
import DeviceCompactCard from "../_commons/DeviceCompactCard/DeviceCompactCard.component";

type Props = {
  ticket: TicketWithDevice & CloseTicketData;
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
    const customer = dev?.customer || dev?.customer_Name || "N/D";
    const machineName = dev?.machine_Name ? ` – ${dev?.machine_Name}` : "";
    const waste = dev?.waste ? `\nTipo rifiuto: ${dev?.waste}` : "";
    return `Ticket #${ticket?.id}${machineName}\nCliente: ${customer}${waste}`;
  }, [
    ticket?.id,
    dev?.machine_Name,
    dev?.customer,
    dev?.customer_Name,
    dev?.waste,
  ]);

  const [formData, setFormData] = useState<CloseTicketData>({
    id: ticket?.id,
    date_Time: new Date(),
    info: defaultInfo,
    open_Description: ticket?.open_Description || "",
    close_Description: ticket?.close_Description || "",
    inGaranzia: false,
    fuoriGaranzia: false,
    machine_retrival: false,
    machine_not_repairable: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = <K extends keyof CloseTicketData>(
    field: K,
    value: CloseTicketData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as string]) {
      setErrors((e) => ({ ...e, [field as string]: "" }));
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.close_Description?.trim())
      e.close_Description = "La nota di chiusura è obbligatoria";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave(formData);
    // reset soft (mantiene il contesto)
    setFormData({
      id: ticket?.id,
      date_Time: new Date(),
      info: defaultInfo,
      open_Description: ticket?.open_Description || "",
      close_Description: ticket?.close_Description || "",
      inGaranzia: false,
      fuoriGaranzia: false,
      machine_retrival: false,
      machine_not_repairable: false,
      note: "",
    });
    setErrors({});
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
      confirmText="Chiudi Ticket"
      cancelText="Annulla"
      onConfirm={handleSave}
      modalClassName={styles.modal}
    >
      <div className={styles.content}>
        {/* REUSE HEADER (modal open) con mode="close" */}
        <TicketHeader device={dev} mode="close" ticketId={ticket?.id} />

        {/* REUSE device compact */}
        <DeviceCompactCard
          device={dev}
          customer={dev?.customer || dev?.customer_Name || "N/D"}
        />

        <CloseTicketForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
        />

        {/* REUSE info note, con testo custom */}
        <InfoNote>
          <strong>Importante:</strong> La <em>nota di chiusura</em> è
          obbligatoria. Le altre opzioni sono facoltative e aiutano a
          contestualizzare la chiusura.
        </InfoNote>
      </div>
    </Modal>
  );
};

export default ModalCloseTicket;
