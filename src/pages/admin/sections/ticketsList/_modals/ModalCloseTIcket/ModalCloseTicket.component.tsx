import React, { useState } from "react";
import {
  Ticket as TicketIcon,
  AlertCircle,
  Calendar,
  FileText,
  MapPin,
} from "lucide-react";
import Modal from "@components/shared/modal/Modal";
import "./ModalCloseTicket.scss";
import type { TicketWithDevice } from "@store_admin/tickets/ticket.api";

interface CloseTicketData {
  ticketId: number | string;
  date?: Date;
  note?: string;
  info?: string;
  address?: string;
  inGaranzia?: boolean;
  fuoriGaranzia?: boolean;
  machine_retrival?: boolean;
  machine_not_repairable?: boolean;
}

interface ModalCloseTicketProps {
  ticket: TicketWithDevice;
  triggerButton: React.ReactNode;
  onSave: (data: CloseTicketData) => Promise<void>;
  btnClassName?: string;
}

const ModalCloseTicket: React.FC<ModalCloseTicketProps> = ({
  ticket,
  triggerButton,
  onSave,
  btnClassName,
}) => {
  const dev = ticket?.device;

  const getFullAddress = (): string => {
    const parts = [
      dev?.address,
      dev?.street,
      dev?.city,
      dev?.province,
      dev?.postal_Code,
      dev?.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Ubicazione non specificata";
  };

  const [formData, setFormData] = useState<CloseTicketData>({
    ticketId: ticket?.id,
    date: new Date(),
    info: `Ticket #${ticket?.id}${
      dev?.machine__Name ? ` – ${dev?.machine__Name}` : ""
    }\nCliente: ${dev?.customer || dev?.customer_Name || "N/D"}${
      (dev as any)?.waste ? `\nTipo rifiuto: ${(dev as any)?.waste}` : ""
    }`,
    address: getFullAddress(),
    inGaranzia: false,
    fuoriGaranzia: false,
    machine_retrival: false,
    machine_not_repairable: false,
    note: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CloseTicketData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    // per la chiusura rendiamo obbligatoria almeno la nota
    if (!formData.note?.trim())
      newErrors.note = "La nota di chiusura è obbligatoria";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      await onSave(formData);
      // reset "soft" mantenendo ticketId e address di contesto
      setFormData({
        ticketId: ticket?.id,
        date: new Date(),
        info: `Ticket #${ticket?.id}${
          dev?.machine__Name ? ` – ${dev?.machine__Name}` : ""
        }\nCliente: ${dev?.customer || dev?.customer_Name || "N/D"}${
          (dev as any)?.waste ? `\nTipo rifiuto: ${(dev as any)?.waste}` : ""
        }`,
        address: getFullAddress(),
        inGaranzia: false,
        fuoriGaranzia: false,
        machine_retrival: false,
        machine_not_repairable: false,
        note: "",
      });
      setErrors({});
    } catch (error) {
      console.error("Errore durante la chiusura del ticket:", error);
      throw error;
    }
  };

  return (
    <Modal
      triggerButton={triggerButton}
      btnClassName={btnClassName}
      size="lg"
      confirmText="Chiudi Ticket"
      cancelText="Annulla"
      onConfirm={handleSave}
      variant="primary"
      modalClassName="modal-close-ticket"
    >
      <div className="modal-open-ticket__content">
        {/* HEADER */}
        <div className="modal-open-ticket__header">
          <div className="modal-open-ticket__header-main">
            <div className="modal-open-ticket__header-left">
              <div className="modal-open-ticket__device-icon">
                <TicketIcon />
              </div>
              <div className="modal-open-ticket__header-info">
                <h3 className="modal-open-ticket__header-title">
                  Ticket #{ticket?.id}
                  {dev?.machine__Name ? ` – ${dev?.machine__Name}` : ""}
                </h3>
                <div className="modal-open-ticket__header-subtitle">
                  {dev?.customer ||
                    (dev as any)?.customer_Name ||
                    "Cliente N/D"}{" "}
                  • {dev?.city || "Luogo N/D"}
                </div>
              </div>
            </div>
            <div className="modal-open-ticket__header-right">
              <div className="modal-open-ticket__header-tag">
                <TicketIcon size={14} />
                CHIUSURA TICKET
              </div>
              <div className="modal-open-ticket__header-date">
                {new Date().toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
          <div className="modal-open-ticket__header-badges">
            <span
              className={`modal-open-ticket__status-badge ${
                ticket?.status === 2
                  ? "modal-open-ticket__status-badge--inactive"
                  : "modal-open-ticket__status-badge--active"
              }`}
            >
              <span className="modal-open-ticket__status-dot"></span>
              {ticket?.status === 2 ? "Chiuso" : "Aperto"}
            </span>
          </div>
        </div>

        {/* INFO COMPATTE */}
        <div className="modal-open-ticket__device-compact">
          <div className="modal-open-ticket__compact-grid">
            <div className="modal-open-ticket__compact-item">
              <strong>Customer:</strong>{" "}
              {dev?.customer || (dev as any)?.customer_Name || "N/D"}
            </div>
            <div className="modal-open-ticket__compact-item">
              <strong>Ticket ID:</strong> {ticket?.id}
            </div>
            {dev?.machine__Name && (
              <div className="modal-open-ticket__compact-item">
                <strong>Macchina:</strong> {dev.machine__Name}
              </div>
            )}
            {(dev as any)?.waste && (
              <div className="modal-open-ticket__compact-item">
                <strong>Waste:</strong> {(dev as any).waste}
              </div>
            )}
            {dev?.ip_Router && (
              <div className="modal-open-ticket__compact-item">
                <strong>IP:</strong> {dev.ip_Router}
              </div>
            )}
            {dev?.city && (
              <div className="modal-open-ticket__compact-item">
                <strong>Città:</strong> {dev.city}
              </div>
            )}
          </div>
        </div>

        {/* FORM */}
        <div className="modal-open-ticket__form-compact">
          {/* Data di chiusura */}
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label">
              <Calendar size={14} />
              Data chiusura
            </label>
            <input
              type="date"
              value={formData.date?.toISOString().split("T")[0] || ""}
              onChange={(e) =>
                handleInputChange("date", new Date(e.target.value))
              }
              className="modal-open-ticket__input modal-open-ticket__input--compact"
            />
          </div>

          <div className="modal-open-ticket__divider"></div>

          {/* Opzioni */}
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label">
              <AlertCircle size={14} />
              Opzioni di chiusura
            </label>
            <div className="modal-open-ticket__options-compact">
              <div className="modal-open-ticket__options-group">
                <div className="modal-open-ticket__option-item">
                  <input
                    type="checkbox"
                    id="inGaranzia"
                    checked={!!formData.inGaranzia}
                    onChange={(e) =>
                      handleInputChange("inGaranzia", e.target.checked)
                    }
                    className="modal-open-ticket__option-checkbox"
                  />
                  <label
                    htmlFor="inGaranzia"
                    className="modal-open-ticket__option-label"
                  >
                    In garanzia
                  </label>
                </div>
                <div className="modal-open-ticket__option-item">
                  <input
                    type="checkbox"
                    id="fuoriGaranzia"
                    checked={!!formData.fuoriGaranzia}
                    onChange={(e) =>
                      handleInputChange("fuoriGaranzia", e.target.checked)
                    }
                    className="modal-open-ticket__option-checkbox"
                  />
                  <label
                    htmlFor="fuoriGaranzia"
                    className="modal-open-ticket__option-label"
                  >
                    Fuori garanzia
                  </label>
                </div>
              </div>

              <div className="modal-open-ticket__options-divider"></div>

              <div className="modal-open-ticket__options-group">
                <div className="modal-open-ticket__option-item">
                  <input
                    type="checkbox"
                    id="machine_retrival"
                    checked={!!formData.machine_retrival}
                    onChange={(e) =>
                      handleInputChange("machine_retrival", e.target.checked)
                    }
                    className="modal-open-ticket__option-checkbox"
                  />
                  <label
                    htmlFor="machine_retrival"
                    className="modal-open-ticket__option-label"
                  >
                    Ripristino macchina
                  </label>
                </div>
                <div className="modal-open-ticket__option-item">
                  <input
                    type="checkbox"
                    id="machine_not_repairable"
                    checked={!!formData.machine_not_repairable}
                    onChange={(e) =>
                      handleInputChange(
                        "machine_not_repairable",
                        e.target.checked
                      )
                    }
                    className="modal-open-ticket__option-checkbox"
                  />
                  <label
                    htmlFor="machine_not_repairable"
                    className="modal-open-ticket__option-label"
                  >
                    Macchina non riparabile in loco
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Indirizzo (readonly informativo) */}
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label">
              <MapPin size={14} />
              Indirizzo
            </label>
            <input
              type="text"
              value={formData.address || ""}
              readOnly
              className="modal-open-ticket__input modal-open-ticket__input--compact"
            />
          </div>

          {/* Nota di chiusura (obbligatoria) */}
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label modal-open-ticket__label--required">
              <FileText size={14} />
              Nota di chiusura
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              placeholder="Inserisci la nota di chiusura..."
              rows={3}
              className={`modal-open-ticket__textarea modal-open-ticket__textarea--compact ${
                errors.note ? "modal-open-ticket__textarea--error" : ""
              }`}
            />
            {errors.note && (
              <div className="modal-open-ticket__error">
                <AlertCircle className="modal-open-ticket__error-icon" />
                {errors.note}
              </div>
            )}
          </div>
        </div>

        {/* Nota informativa */}
        <div className="modal-open-ticket__info-note modal-open-ticket__info-note--compact">
          <AlertCircle size={14} />
          <span>
            <strong>Importante:</strong> Compila la <em>nota di chiusura</em>.
            Gli altri campi sono informativi o opzionali.
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCloseTicket;
