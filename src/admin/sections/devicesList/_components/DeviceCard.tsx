import React, { useState } from 'react';
import type { Device } from '@store_admin/devices/devices.types';
import styles from '../_styles/DeviceCard.module.scss';
import {
  CheckCircleIcon,
  EyeIcon,
  MapPinIcon,
  MoreVerticalIcon,
  PowerIcon,
  SpoolIcon,
  WifiIcon,
} from 'lucide-react';
import { ModalDeviceDetails } from '@sections_admin/devicesList/_modals/ModalDeviceDetail/ModalDeviceDetail.component';
import { ModalRiActiveDevice } from '@sections_admin/devicesList/_modals/ModalRiActivateDevice/ModalRiActiveDevice.component';
import ModalOpenTicket from '@sections_admin/ticketsList/_modals/ModalsOpenTicket/ModalOpenTicket.component';

interface DeviceCardProps {
  device: Device;
  onAction: (actionKey: string, device: Device) => void;
  style?: React.CSSProperties;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onAction, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = device.status === 1;

  // Indirizzo completo
  const getFullAddress = () => {
    const parts = [device.address, device.municipality || device.city].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'Ubicazione non specificata';
  };

  // Colore per tipo rifiuto (usa CSS vars dei token)
  const getWasteColorVar = (wasteType: string | null | undefined) => {
    const key = (wasteType || 'N/A').toUpperCase();
    switch (key) {
      case 'PLASTICA':
        return 'var(--warning-color)';
      case 'CARTA':
        return 'var(--primary-color)';
      case 'ORGANICO':
        return 'var(--success-color)';
      case 'VETRO':
        return 'var(--purple-color)';
      case 'INDIFFERENZIATO':
        return 'var(--gray-500)'; // neutro
      default:
        return 'var(--text-secondary)';
    }
  };

  // Immagine (fallback)
  const imageUrl =
    'https://public-assets.ayayot.com/4081-0733-7005-8389-2939/38/e5/9c8102cb24c5ba8f5ae5e12216abffde7b947fb036e70808a4b091f80c98c57cd21d5548e3da8767fd3bcab35c0bbddc57f6683cd790e55269a3097ef8d3.png';

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).style.display = 'none';
  };

  const cardClasses = [
    styles['compact-device-card'],
    isActive ? styles['is-active'] : styles['is-inactive'],
    isHovered ? styles['is-hovered'] : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClasses}
      style={{
        ...style,
        opacity: 1,
        visibility: 'visible',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      key={`device-${device.id || Math.random()}`}
      data-device-id={device.id}
      data-status={isActive ? 'active' : 'inactive'}
    >
      {/* Header compatto */}
      <div className={styles['compact-header']}>
        <div
          className={[
            styles['status-dot'],
            isActive ? styles['is-active'] : styles['is-inactive'],
          ].join(' ')}
        />
        <div
          className={styles['waste-badge']}
          style={{
            backgroundColor: getWasteColorVar(device.waste),
            color: 'var(--white)',
          }}
        >
          {device.waste || 'N/A'}
        </div>

        <div className={styles['actions-menu']}>
          <button className={styles['menu-btn']} type="button">
            <MoreVerticalIcon size={12} />
          </button>
        </div>
      </div>

      {/* Contenuto compatto */}
      <div className={styles['compact-content']}>
        {/* Sinistra: thumb */}
        <div className={styles['device-thumb']}>
          <img src={imageUrl} alt="Device" onError={handleImageError} loading="lazy" />
          <div
            className={[
              styles['wifi-indicator'],
              isActive ? styles['is-active'] : styles['is-inactive'],
            ].join(' ')}
          >
            <WifiIcon size={10} />
          </div>
        </div>

        {/* Destra: info */}
        <div className={styles['device-info-compact']}>
          <div className={styles['device-location']}>
            <MapPinIcon size={12} />
            <span>{getFullAddress()}</span>
          </div>

          <div className={styles['device-technical']}>
            {device.ip_router && <span className={styles['tech-detail']}>IP: {device.ip_router}</span>}
            {device.codice_gps && <span className={styles['tech-detail']}>GPS: {device.codice_gps}</span>}
          </div>

          <div
            className={[
              styles['status-text'],
              isActive ? styles['is-active'] : styles['is-inactive'],
            ].join(' ')}
          >
            {isActive ? 'Operativo' : 'Non Operativo'}
          </div>
        </div>
      </div>

      {/* Footer compatto */}
      <div className={styles['compact-footer']}>
        {!isActive ? (
          <ModalRiActiveDevice
            device={device}
            triggerButton={
              <button className={[styles['compact-btn'], styles.error].join(' ')} type="button">
                <PowerIcon size={12} />
              </button>
            }
          />
        ) : (
          <button className={styles['compact-btn']} disabled type="button">
            <CheckCircleIcon size={12} />
          </button>
        )}

        <ModalDeviceDetails
          device={device}
          triggerButton={
            <button className={[styles['compact-btn'], styles.primary].join(' ')} type="button">
              <EyeIcon size={12} />
            </button>
          }
        />

        <ModalOpenTicket
          device={device}
          onSave={async (ticketData) => {
            console.log('Ticket data:', ticketData);
          }}
          triggerButton={
            <button
              className={[styles['compact-btn'], styles.warning].join(' ')}
              onClick={() => onAction('ticket', device)}
              type="button"
            >
              <SpoolIcon size={12} />
            </button>
          }
        />
      </div>
    </div>
  );
};
