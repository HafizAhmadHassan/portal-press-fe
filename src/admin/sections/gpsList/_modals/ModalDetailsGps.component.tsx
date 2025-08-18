// @sections_admin/gpsList/_modals/ModalDetailsGps.component.tsx
import React from 'react';
import Modal from '@components/shared/modal/Modal';
import { SimpleButton } from '@shared/simple-btn/SimpleButton.component';
import { Eye, MapPin, Satellite, Hash } from 'lucide-react';
import styles from './ModalDetailsGps.module.scss';
import type { GpsDevice } from '@store_admin/gps/gps.types';
import DevicesMap from '../../devicesList/_components/DevicesMap';
import GpsMap from '../_components/GpsMap';

export const ModalDetailsGps: React.FC<{ device: GpsDevice }> = ({ device }) => {
  const fmt = (k: string) => k || 'N/A';

  return (
    <Modal
      size="lg"
      triggerButton={<SimpleButton size="bare" color="primary" variant="ghost" icon={Eye} />}
      cancelText="Chiudi"
      variant="primary"
    >
      <div className={styles.modalContent}>
        <div className={styles.mapWrapper}>
          <GpsMap
            mapData={[device]}
            isCollapsed={false}
            center={[Number(device.gps_x), Number(device.gps_y)]}
            showActions={false}
            mapHeight="100%"
            zoom={14}
          
          />
        </div>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Satellite className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Dettagli dispositivo</h4>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Codice</span>
              <span className={styles.infoValue}>{fmt(device.codice)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Cliente</span>
              <span className={styles.infoValue}>{fmt(device.customer)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Rifiuto</span>
              <span className={styles.infoValue}>{fmt(device.waste)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Indirizzo</span>
              <span className={styles.infoValue}>{fmt(device.address)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Comune</span>
              <span className={styles.infoValue}>{fmt(device.municipility)}</span>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <MapPin className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Coordinate</h4>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>gps_x (lat)</span>
              <span className={styles.infoValue}>{fmt(device.gps_x)}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>gps_y (lng)</span>
              <span className={styles.infoValue}>{fmt(device.gps_y)}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
