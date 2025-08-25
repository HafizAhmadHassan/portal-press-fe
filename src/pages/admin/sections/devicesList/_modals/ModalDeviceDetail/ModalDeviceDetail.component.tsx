import React from 'react';
import Modal from '@components/shared/modal/Modal';
import { SimpleButton } from '@shared/simple-btn/SimpleButton.component.tsx';
import { Eye } from 'lucide-react';
import type { Device } from '@store_admin/devices/devices.types.ts';
import styles from './ModalDeviceDetail.module.scss';
import TechnicalInfo from '@sections_admin//devicesList/_modals/ModalDeviceDetail/_components/TechnicalInfo/TechnicalInfo.component';
import PositionInfo from '@sections_admin//devicesList/_modals/ModalDeviceDetail/_components/PositionInfo/PositionInfo.component';
import DateHoursInfo from '@sections_admin//devicesList/_modals/ModalDeviceDetail/_components/DateHoursInfo/DateHoursInfo.component';
import CoordinatesInfo from '@sections_admin//devicesList/_modals/ModalDeviceDetail/_components/CoordinatesInfo/CoordinatesInfo.component';
import RegisterInfo from '@sections_admin//devicesList/_modals/ModalDeviceDetail/_components/RegisterInfo/RegisterInfo.component';
import NoteInfo from '@sections_admin//devicesList/_modals/ModalDeviceDetail/_components/NoteInfo/NoteInfo.component';
import Summary from '@sections_admin//devicesList/_modals/ModalDeviceDetail/_components/Summary/Summary.component';
import ModalDeviceHeader from '@sections_admin//devicesList/_modals/ModalDeviceDetail/_components/ModalDeviceHeader/ModalDeviceHeader.component';

interface ModalDeviceDetailsProps {
  device: Device;
  triggerButton?: React.ReactNode;
}

export const ModalDeviceDetails: React.FC<ModalDeviceDetailsProps> = ({
  device,
  triggerButton,
}) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Mai';
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Oggi';
    if (diffInDays === 1) return 'Ieri';
    if (diffInDays < 7) return `${diffInDays} giorni fa`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} settimane fa`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} mesi fa`;
    return `${Math.floor(diffInDays / 365)} anni fa`;
  };

  const formatCoordinates = (x: string | null | undefined, y: string | null | undefined) => {
    if (!x || !y) return 'N/A';
    const lat = parseFloat(y);
    const lng = parseFloat(x);
    if (isNaN(lat) || isNaN(lng)) return 'Non valide';
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const getFullAddress = () => {
    const parts = [device?.street || device?.address, device?.city, device?.province].filter(
      Boolean
    );
    return parts.length > 0 ? parts.join(', ') : 'Indirizzo non disponibile';
  };

  const displayName = device?.machineName || `Dispositivo ${device?.id}`;

  return (
    <Modal
      size="lg"
      triggerButton={
        triggerButton || (
          <SimpleButton size="bare" color="primary" variant="ghost" icon={Eye}>
            {' '}
          </SimpleButton>
        )
      }
      title={`Dettagli: ${displayName}`}
      cancelText="Chiudi"
      variant="primary"
    >
      <div className={styles.modalContent}>
        <ModalDeviceHeader
          device={device}
          displayName={displayName}
          getFullAddress={getFullAddress}
        />

        {/* Informazioni Tecniche */}
        <TechnicalInfo device={device} />

        {/* Informazioni di Posizione */}
        <PositionInfo device={device} />

        {/* Date e Orari */}
        <DateHoursInfo formatDate={formatDate} getRelativeTime={getRelativeTime} device={device} />

        {/* Coordinate GPS */}
        <CoordinatesInfo device={device} formatCoordinates={formatCoordinates} />

        {/* Matricole */}
        <RegisterInfo device={device} />

        {/* Note */}
        {device?.note && <NoteInfo device={device} />}

        {/* Riassunto Stati */}
        <Summary device={device} />
      </div>
    </Modal>
  );
};
