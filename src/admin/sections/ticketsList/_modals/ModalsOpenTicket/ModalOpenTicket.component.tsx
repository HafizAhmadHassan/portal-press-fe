import React, { useState } from 'react';
import { Calendar, FileText, Grid, Tag } from 'lucide-react';
import Modal from '@components/shared/modal/Modal';
import './ModalOpenTicket.scss';
import type { Device } from '@store_admin/devices/devices.types';
import type { MessageCreate, ProblemCategory } from '@store_admin/tickets/ticket.types';

interface ModalOpenTicketProps {
  device: Device;
  triggerButton: React.ReactNode;
  onSave: (data: MessageCreate) => Promise<void>;
}

export const ModalOpenTicket: React.FC<ModalOpenTicketProps> = ({
  device,
  triggerButton,
  onSave,
}) => {
  // Opzioni problema (costanti richieste)
  const PROBLEM_OPTIONS: ProblemCategory[] = [
    'DATA_BASE',
    'IDRAULICO',
    'ELETTRICO',
    'MECCANICO',
  ];

  // customer è prelevato dal device e NON è modificabile
  const [formData, setFormData] = useState<MessageCreate>({
    machine: device.id,
    problema: [],
    status: 1, // default 1
    open_Description: '',
    customer: device.customer ?? '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = <K extends keyof MessageCreate>(field: K, value: MessageCreate[K]) => {
    setFormData((f) => ({ ...f, [field]: value }));
    if (errors[field as string]) setErrors((e) => ({ ...e, [field as string]: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.open_Description.trim()) e.open_Description = 'Descrizione obbligatoria';
    if (!formData.problema || formData.problema.length === 0)
      e.problema = 'Seleziona almeno un problema';
    if (formData.status !== 1 && formData.status !== 2)
      e.status = 'Stato non valido (ammessi 1 o 2)';
    if (!formData.customer?.trim())
      e.customer = 'Customer non disponibile per la macchina selezionata';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    console.debug('[ModalOpenTicket] Click conferma', formData);
    if (!validate()) {
      console.debug('[ModalOpenTicket] Validazione fallita', { errors });
      return;
    }
    try {
      console.debug('[ModalOpenTicket] Invio onSave...', formData);
      await onSave(formData);
      console.debug('[ModalOpenTicket] onSave completata');
    } catch (err) {
      console.error('[ModalOpenTicket] Errore durante onSave', err);
    }
  };

  return (
    <Modal
      triggerButton={triggerButton}
      size="lg"
      confirmText="Apri Ticket"
      cancelText="Annulla"
      onConfirm={handleSave}
      variant="primary"
      modalClassName="modal-open-ticket"
    >
      <div className="modal-open-ticket__content">
        {/* HEADER */}
        <div className="modal-open-ticket__header">
          <div className="modal-open-ticket__header-main">
            <div className="modal-open-ticket__header-left">
              <div className="modal-open-ticket__device-icon">
                <Grid />
              </div>
              <div className="modal-open-ticket__header-info">
                <h3 className="modal-open-ticket__header-title">
                  {device.machine_name}
                </h3>
                <div className="modal-open-ticket__header-subtitle">
                  {device.customer || 'Cliente N/D'} • {device.city || 'Luogo N/D'}
                </div>
              </div>
            </div>
            <div className="modal-open-ticket__header-right">
              <div className="modal-open-ticket__header-tag">
                <Tag size={14} />
                APERTURA TICKET
              </div>
              <div className="modal-open-ticket__header-date">
                {new Date().toLocaleDateString('it-IT')}
              </div>
            </div>
          </div>
        </div>

        {/* DEVICE INFO COMPACT */}
        <div className="modal-open-ticket__device-compact">
          <div className="modal-open-ticket__compact-grid">
            <div className="modal-open-ticket__compact-item">
              <strong>Customer:</strong>{' '}
              <span className="modal-open-ticket__readonly-chip">
                {formData.customer || 'N/D'}
              </span>
            </div>
            <div className="modal-open-ticket__compact-item">
              <strong>Machine ID:</strong> {device.id}
            </div>
            {device.city && (
              <div className="modal-open-ticket__compact-item">
                <strong>City:</strong> {device.city}
              </div>
            )}
          </div>
          {errors.customer && (
            <div className="modal-open-ticket__error" style={{ marginTop: 8 }}>
              <FileText className="modal-open-ticket__error-icon" />
              {errors.customer}
            </div>
          )}
        </div>

        {/* FORM COMPACT */}
        <div className="modal-open-ticket__form-compact">
          {/* Stato (1|2) */}
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label">
              <Calendar size={14} />
              Stato <span className="modal-open-ticket__label--required">*</span>
            </label>
            <div className="modal-open-ticket__options-compact">
              {[1, 2].map((val) => (
                <label key={val} className="modal-open-ticket__radio">
                  <input
                    type="radio"
                    name="status"
                    checked={formData.status === val}
                    onChange={() => handleChange('status', val as 1 | 2)}
                  />
                  <span>{val}</span>
                </label>
              ))}
            </div>
            {errors.status && (
              <div className="modal-open-ticket__error">
                <FileText className="modal-open-ticket__error-icon" />
                {errors.status}
              </div>
            )}
          </div>

          {/* Problema (checkbox multiple) */}
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label">
              <Tag size={14} />
              Problema <span className="modal-open-ticket__label--required">*</span>
            </label>
            <div className="modal-open-ticket__options-compact">
              <div className="modal-open-ticket__options-group">
                {PROBLEM_OPTIONS.map((p) => (
                  <div key={p} className="modal-open-ticket__option-item">
                    <input
                      type="checkbox"
                      id={`prob_${p}`}
                      checked={formData.problema.includes(p)}
                      onChange={(e) => {
                        const next = new Set(formData.problema);
                        if (e.target.checked) next.add(p);
                        else next.delete(p);
                        handleChange('problema', Array.from(next) as ProblemCategory[]);
                      }}
                      className="modal-open-ticket__option-checkbox"
                    />
                    <label htmlFor={`prob_${p}`} className="modal-open-ticket__option-label">
                      {p}
                    </label>
                  </div>
                ))}
              </div>
              {errors.problema && (
                <div className="modal-open-ticket__error">
                  <FileText className="modal-open-ticket__error-icon" />
                  {errors.problema}
                </div>
              )}
            </div>
          </div>

          {/* Descrizione apertura */}
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label modal-open-ticket__label--required">
              <FileText size={14} />
              Descrizione apertura
            </label>
            <textarea
              className={`modal-open-ticket__textarea modal-open-ticket__textarea--compact ${
                errors.open_Description ? 'modal-open-ticket__textarea--error' : ''
              }`}
              rows={3}
              value={formData.open_Description}
              onChange={(e) => handleChange('open_Description', e.target.value)}
              placeholder="Descrivi il problema..."
            />
            {errors.open_Description && (
              <div className="modal-open-ticket__error">
                <FileText className="modal-open-ticket__error-icon" />
                {errors.open_Description}
              </div>
            )}
          </div>
        </div>

        {/* INFO NOTE */}
        <div className="modal-open-ticket__info-note modal-open-ticket__info-note--compact">
          <FileText size={14} />
          <span>
            <strong>Importante:</strong> Il customer è impostato automaticamente dalla macchina
            selezionata e non è modificabile. Compila i campi obbligatori (*) prima di salvare.
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ModalOpenTicket;
