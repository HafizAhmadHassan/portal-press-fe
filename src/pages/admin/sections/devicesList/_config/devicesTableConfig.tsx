import type { Device } from '@store_admin/devices/devices.types';
import { WasteBadge } from '@shared/waste-badge/WasteBadge.component';
import { ModalDeviceDetails } from '@sections_admin/devicesList/_modals/ModalDeviceDetail/ModalDeviceDetail.component';
import { ModalEditDevice } from '@sections_admin/devicesList/_modals/ModalEditDevice/ModalEditDevice.component';
import { ModalRiActiveDevice } from '@sections_admin/devicesList/_modals/ModalRiActivateDevice/ModalRiActiveDevice.component';
import { SimpleButton } from '@shared/simple-btn/SimpleButton.component';
import { ModalDeleteDevicesConfirm } from '@sections_admin/devicesList/_modals/ModalDeleteDevicesConfirm/ModalDeleteDevicesConfirm.component';
import styles from '../_styles/DevicesTableConfig.module.scss';

interface DevicesTableConfigProps {
  devices: Device[];
  onEdit: (deviceId: string, updatedData: any) => Promise<void>;
  onDelete: (device: Device) => void;
  onToggleStatus: (device: Device) => void;
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  pagination?: any;
}

export const createDevicesTableConfig = ({
  devices,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
  pagination,
}: DevicesTableConfigProps) => {
  return {
    columns: [
      {
        key: 'machine_name',
        header: 'Nome Macchina',
        type: 'custom' as const,
        width: '200px',
        sortable: true,
        render: (_: any, device: Device) => (
          <div className={styles.nameCell}>
            {device.machine_name || `Device ${device.id}`}
          </div>
        ),
      },
      {
        key: 'status',
        header: 'Stato',
        type: 'custom' as const,
        width: '110px',
        sortable: true,
        render: (_: any, device: Device) => (
          <span
            className={`${styles.badge} ${device.status === 1 ? styles['badge--ok'] : styles['badge--ko']}`}
          >
            {device.status === 1 ? 'Attivo' : 'Inattivo'}
          </span>
        ),
      },
      {
        key: 'waste',
        header: 'Tipo Rifiuto',
        type: 'custom' as const,
        width: '130px',
        sortable: true,
        render: (_: any, device: Device) => (
          <div className={styles.wasteCell}>
            <WasteBadge waste={device.waste} />
          </div>
        ),
      },
      {
        key: 'city',
        header: 'Città',
        type: 'text' as const,
        width: '150px',
        sortable: true,
        render: (_: any, device: Device) => device.city || 'N/A',
      },
      {
        key: 'customer', // il backend accetta 'customer'; in render fallback a customer_name
        header: 'Cliente',
        type: 'text' as const,
        width: '180px',
        sortable: true,
        render: (_: any, device: Device) => device.customer || (device as any).customer_name || 'N/A',
      },
      {
        key: 'status_machine_blocked',
        header: 'Blocco',
        type: 'custom' as const,
        width: '110px',
        sortable: true,
        render: (_: any, device: Device) => (
          <span
            className={`${styles.badge} ${device.status_machine_blocked ? styles['badge--danger'] : styles['badge--ok']}`}
          >
            {device.status_machine_blocked ? 'Bloccato' : 'Libero'}
          </span>
        ),
      },
      {
        key: 'created_at',
        header: 'Data Creazione',
        type: 'custom' as const,
        width: '150px',
        sortable: true,
        render: (_: any, device: Device) => {
          if (!device.created_at) return <span className={styles.muted}>N/A</span>;
          const date = new Date(device.created_at);
          return (
            <div className={styles.dateCell}>
              <div className={styles.datePrimary}>{date.toLocaleDateString('it-IT')}</div>
              <div className={styles.dateSecondary}>
                {date.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        },
      },
      {
        key: 'actions',
        header: 'Azioni',
        type: 'custom' as const,
        width: '220px',
        render: (_: any, device: Device) => (
          <div className={styles.actionsRow}>
            {device.status === 1 ? (
              <SimpleButton variant="filled" color="secondary" size="sm" disabled>
                Attivo
              </SimpleButton>
            ) : (
              <ModalRiActiveDevice
                device={device}
                triggerButton={
                  <SimpleButton variant="filled" color="success" size="sm">
                    Riattiva
                  </SimpleButton>
                }
              />
            )}

            <ModalDeviceDetails device={device} />

            <ModalEditDevice
              device={device}
              onSave={async (updatedData) => {
                if (!updatedData) throw new Error('Updated device data is required');
                await onEdit(device.id, updatedData);
              }}
            />

            <ModalDeleteDevicesConfirm device={device} onConfirm={onDelete} />
          </div>
        ),
      },
    ],
    data: devices,
    loading: isLoading,
    pagination: pagination || { enabled: true, pageSize: 10, currentPage: 1 },
    sorting: {
      enabled: true,
      currentSort: sortBy ? { key: sortBy, direction: sortOrder || 'asc' } : null,
      onSort,
    },
    selection: {
      enabled: false,
      selectedItems: [],
      idField: 'id',
    },
    emptyMessage: 'Nessun dispositivo trovato. Prova a modificare i filtri di ricerca.',
    className: 'devices-table',
  };
};
