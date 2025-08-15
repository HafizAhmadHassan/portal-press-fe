// src/sections/ticketsList/_modals/ModalOpenTicket.component.tsx
import React, { useState } from 'react';
import { Calendar, FileText, Grid, Tag, User } from 'lucide-react';
import Modal from '@components/shared/modal/Modal';
import './ModalOpenTicket.scss';
import type { Device } from '@store_admin/devices/devices.types';
import type { TicketCreate } from '@store_admin/tickets/ticket.types';

interface ModalOpenTicketProps {
  device: Device;
  triggerButton: React.ReactNode;
  onSave: (ticketData: Omit<TicketCreate, 'created_by_user_id'>) => Promise<void>;
}

export const ModalOpenTicket: React.FC<ModalOpenTicketProps> = ({
  device,
  triggerButton,
  onSave,
}) => {
  // categorie disponibili
  const CATEGORY_OPTIONS: TicketCreate['category'] = [
    'DATABASE','HYDRAULIC','ELECTRIC','MECHANIC'
  ];

  const [formData, setFormData] = useState<Omit<TicketCreate,'created_by_user_id'>>({
    machine_id: device.id,
    created_at: new Date().toISOString(),
    note: '',
    category: [],
    user_id: 0,        
  });
  const [errors, setErrors] = useState<Record<string,string>>({});

  const handleChange = (field: keyof typeof formData, value: any) => {
    setFormData(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e: Record<string,string> = {};
    if (!formData.note.trim()) e.note = 'Note obbligatorie';
    if (formData?.category?.length === 0) e.category = 'Seleziona almeno una categoria';
    // user_id lasciamo fuori (assumiamo tu lo riempia da context)
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    await onSave(formData);
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
                {new Date(formData.created_at).toLocaleDateString('it-IT')}
              </div>
            </div>
          </div>
        </div>

        {/* DEVICE INFO COMPACT */}
        <div className="modal-open-ticket__device-compact">
          <div className="modal-open-ticket__compact-grid">
            <div className="modal-open-ticket__compact-item">
              <strong>Customer:</strong> {device.customer || 'N/D'}
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
        </div>

        {/* FORM COMPACT */}
        <div className="modal-open-ticket__form-compact">
          {/* Data */}
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label">
              <Calendar size={14} />
              Data
            </label>
            <input
              type="date"
              className="modal-open-ticket__input modal-open-ticket__input--compact"
              value={formData.created_at.slice(0,10)}
              onChange={e => handleChange('created_at', e.target.value)}
            />
          </div>

          {/* Categoria */}
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label">
              <Tag size={14} />
              Categoria <span className="modal-open-ticket__label--required">*</span>
            </label>
            <div className="modal-open-ticket__options-compact">
              <div className="modal-open-ticket__options-group">
                {CATEGORY_OPTIONS.map(cat => (
                  <div key={cat} className="modal-open-ticket__option-item">
                    <input
                      type="checkbox"
                      id={`cat_${cat}`}
                      checked={formData.category?.includes(cat)}
                      onChange={e => {
                        const arr = formData.category?.slice();
                        if (e.target.checked) arr?.push(cat);
                        else arr?.splice(arr?.indexOf(cat),1);
                        handleChange('category', arr);
                      }}
                      className="modal-open-ticket__option-checkbox"
                    />
                    <label htmlFor={`cat_${cat}`} className="modal-open-ticket__option-label">
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
              {errors.category && (
                <div className="modal-open-ticket__error">
                  <FileText className="modal-open-ticket__error-icon" />
                  {errors.category}
                </div>
              )}
            </div>
          </div>

          {/* Note */}
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label modal-open-ticket__label--required">
              <FileText size={14} />
              Note
            </label>
            <textarea
              className={`modal-open-ticket__textarea modal-open-ticket__textarea--compact ${
                errors.note ? 'modal-open-ticket__textarea--error' : ''
              }`}
              rows={3}
              value={formData?.note}
              onChange={e => handleChange('note', e.target.value)}
              placeholder="Descrivi il problema..."
            />
            {errors.note && (
              <div className="modal-open-ticket__error">
                <FileText className="modal-open-ticket__error-icon" />
                {errors.note}
              </div>
            )}
          </div>
        </div>

        {/* INFO NOTE */}
        <div className="modal-open-ticket__info-note modal-open-ticket__info-note--compact">
          <FileText size={14} />
          <span><strong>Importante:</strong> Compilare i campi obbligatori (*) prima di salvare.</span>
        </div>
      </div>
    </Modal>
  );
};

export default ModalOpenTicket;
