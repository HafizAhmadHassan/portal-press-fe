import React, { useState } from 'react';
import { Ticket, AlertCircle, Calendar, FileText, Monitor, MapPin, Settings } from 'lucide-react';
import Modal from '@components/shared/modal/Modal';
import './ModalCloseTicket.scss';
import type { Device } from '@core/store/devices/devices.types';

interface TicketData {
  deviceId: string;
  date?: Date;
  info?: string;
  note?: string;
  opening?: string;
  migration?: string;
  address?: string;
  inGaranzia?: boolean;
  fuoriGaranzia?: boolean;
  machine_retrival?: boolean;
  machine_not_repairable?: boolean;
}

interface ModalCloseTicketProps {
  device?: Device;
  triggerButton: React.ReactNode;
  onSave: (ticketData: TicketData) => Promise<void>;
  btnClassName?: string;
}

const ModalCloseTicket: React.FC<ModalCloseTicketProps> = ({
  device,
  triggerButton,
  onSave,
  btnClassName
}) => {
  const getFullAddress = (device: Device): string => {
    const parts = [
      device?.address,
      device?.street,
      device?.city,
      device?.province,
      device?.postal_code,
      device?.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  const [formData, setFormData] = useState<TicketData>({
    deviceId: device?.id,
    date: new Date(),
    info: `Ticket per device: ${device?.machine_name}\nCliente: ${device?.customer_name || 'N/D'}\nTipo rifiuto: ${device?.waste || 'N/D'}`,
    opening: `Apertura ticket per ${device?.machine_name}`,
    migration: device?.linux_version ? `Linux Version: ${device?.linux_version}` : '',
    address: getFullAddress(device),
    inGaranzia: false,
    fuoriGaranzia: false,
    machine_retrival: false,
    machine_not_repairable: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof TicketData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.info?.trim()) newErrors.info = 'Le informazioni sono obbligatorie';
    if (!formData.opening?.trim()) newErrors.opening = "L'apertura è obbligatoria";
    if (!formData.address?.trim()) newErrors.address = "L'indirizzo è obbligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    try {
      await onSave(formData);
      setFormData({
        deviceId: device?.id,
        date: new Date(),
        info: `Ticket per device: ${device?.machine_name}\nCliente: ${device?.customer_name || 'N/D'}\nTipo rifiuto: ${device?.waste || 'N/D'}`,
        opening: `Apertura ticket per ${device?.machine_name}`,
        migration: device?.linux_version ? `Linux Version: ${device?.linux_version}` : '',
        address: getFullAddress(device),
        inGaranzia: false,
        fuoriGaranzia: false,
        machine_retrival: false,
        machine_not_repairable: false
      });
      setErrors({});
    } catch (error) {
      console.error('Errore durante il salvataggio del ticket:', error);
      throw error;
    }
  };

  return (
    <Modal
      triggerButton={triggerButton}
      btnClassName={btnClassName}
      size="lg"
      confirmText="Salva Ticket"
      cancelText="Annulla"
      onConfirm={handleSave}
      variant="primary"
      modalClassName="modal-open-ticket"
    >
      <div className="modal-open-ticket__content">
        
        {/* Header Compatto */}
        <div className="modal-open-ticket__header">
          <div className="modal-open-ticket__header-main">
            <div className="modal-open-ticket__header-left">
              <div className="modal-open-ticket__device-icon">
                <Monitor />
              </div>
              <div className="modal-open-ticket__header-info">
                <h3 className="modal-open-ticket__header-title">{device?.machine_name}</h3>
                <div className="modal-open-ticket__header-subtitle">
                  {device?.customer_name || 'Cliente N/D'} • {device?.waste || 'Tipo N/D'}
                </div>
              </div>
            </div>
            <div className="modal-open-ticket__header-right">
              <div className="modal-open-ticket__header-tag">
                <Ticket size={14} />
                CHIUSURA TICKET
              </div>
              <div className="modal-open-ticket__header-date">
                {new Date().toLocaleDateString('it-IT', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
          <div className="modal-open-ticket__header-badges">
            <span className={`modal-open-ticket__status-badge ${
              device?.status === 1 ? 'modal-open-ticket__status-badge--active' : 'modal-open-ticket__status-badge--inactive'
            }`}>
              <span className="modal-open-ticket__status-dot"></span>
              {device?.status === 1 ? 'Attivo' : 'Inattivo'}
            </span>
            {device?.status_machine_blocked && (
              <span className="modal-open-ticket__status-badge modal-open-ticket__status-badge--blocked">
                <AlertCircle size={12} />
                Bloccato
              </span>
            )}
          </div>
        </div>

        {/* Informazioni Device Compatte */}
        <div className="modal-open-ticket__device-compact">
          <div className="modal-open-ticket__compact-grid">
            <div className="modal-open-ticket__compact-item">
              <strong>Customer:</strong> {device?.customer_name || 'N/D'}
            </div>
            <div className="modal-open-ticket__compact-item">
              <strong>Matricola:</strong> {device?.matricola_kgn || device?.matricola_bte || '00000'}
            </div>
            <div className="modal-open-ticket__compact-item">
              <strong>Waste:</strong> {device?.waste || 'N/D'}
            </div>
            <div className="modal-open-ticket__compact-item">
              <strong>IP:</strong> {device?.ip_router || 'N/D'}
            </div>
            <div className="modal-open-ticket__compact-item">
              <strong>Street:</strong> {device?.street || 'N/D'} {device?.city && `- ${device?.city}`}
            </div>
            {(device?.gps_x && device?.gps_y) && (
              <div className="modal-open-ticket__compact-item">
                <strong>GPS:</strong> {device?.gps_x}, {device?.gps_y}
              </div>
            )}
          </div>
        </div>

        {/* Form Compatto */}
        <div className="modal-open-ticket__form-compact">
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label">
              <Calendar size={14} />
              Data
            </label>
            <input
              type="date"
              value={formData.date?.toISOString().split('T')[0] || ''}
              onChange={(e) => handleInputChange('date', new Date(e.target.value))}
              className="modal-open-ticket__input modal-open-ticket__input--compact"
            />
          </div>
          
          <div className="modal-open-ticket__divider"></div>
          
          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label">
              <AlertCircle size={14} />
              Opzioni
            </label>
            <div className="modal-open-ticket__options-compact">
              <div className="modal-open-ticket__options-group">
                <div className="modal-open-ticket__option-item">
                  <input
                    type="checkbox"
                    id="inGaranzia"
                    checked={formData.inGaranzia}
                    onChange={(e) => handleInputChange('inGaranzia', e.target.checked)}
                    className="modal-open-ticket__option-checkbox"
                  />
                  <label htmlFor="inGaranzia" className="modal-open-ticket__option-label">
                    In Garanzia
                  </label>
                </div>
                <div className="modal-open-ticket__option-item">
                  <input
                    type="checkbox"
                    id="fuoriGaranzia"
                    checked={formData.fuoriGaranzia}
                    onChange={(e) => handleInputChange('fuoriGaranzia', e.target.checked)}
                    className="modal-open-ticket__option-checkbox"
                  />
                  <label htmlFor="fuoriGaranzia" className="modal-open-ticket__option-label">
                    Fuori Garanzia
                  </label>
                </div>
              </div>

              <div className="modal-open-ticket__options-divider"></div>

              <div className="modal-open-ticket__options-group">
                <div className="modal-open-ticket__option-item">
                  <input
                    type="checkbox"
                    id="machine_retrival"
                    checked={formData.machine_retrival}
                    onChange={(e) => handleInputChange('machine_retrival', e.target.checked)}
                    className="modal-open-ticket__option-checkbox"
                  />
                  <label htmlFor="machine_retrival" className="modal-open-ticket__option-label">
                    Ripristino Macchina
                  </label>
                </div>
                <div className="modal-open-ticket__option-item">
                  <input
                    type="checkbox"
                    id="machine_not_repairable"
                    checked={formData.machine_not_repairable}
                    onChange={(e) => handleInputChange('machine_not_repairable', e.target.checked)}
                    className="modal-open-ticket__option-checkbox"
                  />
                  <label htmlFor="machine_not_repairable" className="modal-open-ticket__option-label">
                    Macchina non riparabile in loco
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-open-ticket__input-group">
            <label className="modal-open-ticket__label modal-open-ticket__label--required">
              <FileText size={14} />
              Note
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => handleInputChange('note', e.target.value)}
              placeholder="Inserisci le informazioni del ticket..."
              rows={3}
              className={`modal-open-ticket__textarea modal-open-ticket__textarea--compact ${
                errors.note ? 'modal-open-ticket__textarea--error' : ''
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

        {/* Nota Informativa Compatta */}
        <div className="modal-open-ticket__info-note modal-open-ticket__info-note--compact">
          <AlertCircle size={14} />
          <span><strong>Importante:</strong> Compilare tutti i campi obbligatori (*) prima di salvare.</span>
        </div>

      </div>
    </Modal>
  );
};

export default ModalCloseTicket;