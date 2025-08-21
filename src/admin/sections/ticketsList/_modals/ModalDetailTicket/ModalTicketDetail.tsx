import React from 'react';
import Modal from '@components/shared/modal/Modal';
import { SimpleButton } from '@shared/simple-btn/SimpleButton.component.tsx';
import {
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  MapPin,
  Shield,
  FileText,
  Hash,
  User as UserIcon,
  Monitor,
  Badge,
} from 'lucide-react';
import styles from './ModalTicketDetail.module.scss';
import type { TicketRead } from '@store_admin/tickets/ticket.types';

type DeviceLite = {
  machine_name?: string;
  city?: string;
  province?: string;
  customer_name?: string;
  customer?: string;
  ip_router?: string;
  waste?: string;
  address?: string;
  street?: string;
  postal_code?: string;
  country?: string;
};

type TicketWithDevice = TicketRead & {
  device?: DeviceLite | null;
};

interface ModalTicketDetailsProps {
  ticket: TicketWithDevice;
}

const isClosed = (t: any) => t?.status === 2 || t?.status === 'closed' || t?.status === 'CLOSED';

const formatDateTime = (dateString?: string) => {
  if (!dateString) return 'N/D';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return 'N/D';
  return d.toLocaleString('it-IT', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

const relativeTime = (dateString?: string) => {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Oggi';
  if (days === 1) return 'Ieri';
  if (days < 7) return `${days} giorni fa`;
  if (days < 30) return `${Math.floor(days / 7)} settimane fa`;
  if (days < 365) return `${Math.floor(days / 30)} mesi fa`;
  return `${Math.floor(days / 365)} anni fa`;
};

export const ModalTicketDetails: React.FC<ModalTicketDetailsProps> = ({ ticket }) => {
  const dev = ticket?.device;
  const customer =
    dev?.customer ?? dev?.customer_name ?? (ticket as any)?.customer ?? 'N/D';
  const machineId = (ticket as any)?.machine ?? (ticket as any)?.device_id ?? 'N/D';
  const machineName = dev?.machine_name;

  const openedAt =
    (ticket as any)?.date_Time ||
    (ticket as any)?.date_time ||
    ticket?.created_at;

  const updatedAt = ticket?.updated_at;

  const openDescription =
    (ticket as any)?.open_Description ||
    (ticket as any)?.open_description ||
    ticket?.description ||
    '';

  const closeDescription =
    (ticket as any)?.close_Description ||
    (ticket as any)?.close_description ||
    '';

  const guaranteeList: string[] =
    (ticket as any)?.guanratee_status ||
    (ticket as any)?.guarantee_status ||
    [];

  return (
    <Modal
      size="lg"
      triggerButton={<SimpleButton size="bare" color="primary" variant="ghost" icon={Eye} />}
      cancelText="Chiudi"
      variant="primary"
    >
      <div className={styles.modalContent}>
        {/* HEADER */}
        <div className={styles.ticketHeader}>
          <div className={styles.iconSection}>
            <div className={styles.iconCircle}>
              <Monitor className={styles.headerIcon} />
            </div>
            <div className={styles.statusIndicator}>
              {isClosed(ticket) ? (
                <CheckCircle className={styles.statusIconActive} />
              ) : (
                <XCircle className={styles.statusIconInactive} />
              )}
            </div>
          </div>

          <div className={styles.ticketMainInfo}>
            <h3 className={styles.title}>
              Ticket #{ticket.id}{machineName ? ` – ${machineName}` : ''}
            </h3>
            <p className={styles.subTitle}>
              {customer} • {dev?.city || 'Luogo N/D'}
            </p>

            <div className={styles.badgesRow}>
              <span
                className={`${styles.statusBadge} ${isClosed(ticket) ? styles.statusClosed : styles.statusOpen}`}
              >
                {isClosed(ticket) ? 'Chiuso (2)' : 'Aperto'}
              </span>

              {dev?.ip_router && (
                <span className={styles.infoBadge}>
                  <Shield className={styles.badgeIcon} />
                  IP: {dev.ip_router}
                </span>
              )}

              {(dev as any)?.waste && (
                <span className={styles.infoBadge}>
                  <Badge className={styles.badgeIcon} />
                  {(dev as any).waste}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIEPILOGO */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <UserIcon className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Riepilogo</h4>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>ID Ticket</span>
              <span className={styles.infoValue}>
                <Hash size={12} style={{ marginRight: 6 }} />
                {ticket.id}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Cliente</span>
              <span className={styles.infoValue}>{customer}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Machine</span>
              <span className={styles.infoValue}>
                {machineName ? `${machineName} (#${machineId})` : `#${machineId}`}
              </span>
            </div>
            {(dev?.city || dev?.province) && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Luogo</span>
                <span className={styles.infoValue}>
                  {dev?.city}{dev?.province ? `, ${dev?.province}` : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* DATE */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Calendar className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Date</h4>
          </div>

          <div className={styles.dateGrid}>
            <div className={styles.dateCard}>
              <div className={styles.dateCardHeader}>
                <Calendar className={styles.dateIcon} />
                <span className={styles.dateCardTitle}>Apertura</span>
              </div>
              <div className={styles.dateCardContent}>
                <span className={styles.dateValue}>{formatDateTime(openedAt)}</span>
                <span className={styles.dateRelative}>{relativeTime(openedAt)}</span>
              </div>
            </div>

            <div className={styles.dateCard}>
              <div className={styles.dateCardHeader}>
                <Clock className={styles.dateIcon} />
                <span className={styles.dateCardTitle}>Ultimo Aggiornamento</span>
              </div>
              <div className={styles.dateCardContent}>
                <span className={styles.dateValue}>{formatDateTime(updatedAt)}</span>
                <span className={styles.dateRelative}>{relativeTime(updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DESCRIZIONI */}
        {openDescription && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText className={styles.sectionIcon} />
              <h4 className={styles.sectionTitle}>Descrizione Apertura</h4>
            </div>
            <div className={styles.textBlock}>
              <pre className={styles.pre}>{openDescription}</pre>
            </div>
          </div>
        )}

        {closeDescription && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <FileText className={styles.sectionIcon} />
              <h4 className={styles.sectionTitle}>Descrizione Chiusura</h4>
            </div>
            <div className={styles.textBlock}>
              <pre className={styles.pre}>{closeDescription}</pre>
            </div>
          </div>
        )}

        {/* GARANZIA */}
        {Array.isArray(guaranteeList) && guaranteeList.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Shield className={styles.sectionIcon} />
              <h4 className={styles.sectionTitle}>Garanzia</h4>
            </div>

            <div className={styles.guaranteeList}>
              {guaranteeList.map((g, idx) => (
                <span key={`${g}-${idx}`} className={styles.guaranteeChip}>
                  <Shield className={styles.guaranteeIcon} />
                  {g}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalTicketDetails;
