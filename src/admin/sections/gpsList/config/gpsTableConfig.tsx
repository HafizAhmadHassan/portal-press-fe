// @sections_admin/gpsList/config/gpsTableConfig.tsx
import React from 'react';
import type { GpsDevice } from '@store_admin/gps/gps.types';
import { ModalEditGps } from '@sections_admin/gpsList/_modals/ModalEditGps.component';
import { ModalDetailsGps } from '@sections_admin/gpsList/_modals/ModalDetailsGps.component';

export const createGpsTableConfig = ({
  gps,
  onView,
  onEdit,
  onDelete,
  isLoading = false,
}: {
  gps: GpsDevice[];
  onView: (d: GpsDevice) => void;
  onEdit: (d: Partial<GpsDevice> & { id: string | number }) => void;
  onDelete: (d: GpsDevice) => void;
  isLoading?: boolean;
}) => {
  const tPrimary = 'var(--text-primary)';
  const tSecondary = 'var(--text-secondary)';

  return {
    columns: [
      { key: 'codice', header: 'Codice', type: 'text' as const, width: '110px', sortable: true },
      {
        key: 'address',
        header: 'Indirizzo',
        type: 'custom' as const,
        width: '320px',
        sortable: true,
        render: (_: any, d: GpsDevice) => (
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: tPrimary }}>{d.address}</div>
            <div style={{ fontSize: 12, color: tSecondary }}>{d.municipility}</div>
          </div>
        ),
      },
      { key: 'customer', header: 'Cliente', type: 'text' as const, width: '140px', sortable: true },
      { key: 'waste', header: 'Rifiuto', type: 'text' as const, width: '120px', sortable: true },
      {
        key: 'coords',
        header: 'Coordinate',
        type: 'custom' as const,
        width: '160px',
        render: (_: any, d: GpsDevice) => (
          <div style={{ fontSize: 12, color: tPrimary }}>
            X: {d.gps_x ?? '—'}<br />Y: {d.gps_y ?? '—'}
          </div>
        ),
      },
      {
        key: 'actions',
        header: 'Azioni',
        type: 'custom' as const,
        width: '130px',
        render: (_: any, d: GpsDevice) => (
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <ModalDetailsGps device={d} />
            <ModalEditGps device={d} onSave={onEdit} />
           {/*  <ModalDeleteGpsConfirm device={d} onConfirm={onDelete} /> */}
          </div>
        ),
      },
    ],
    data: gps,
    loading: isLoading,
    pagination: { enabled: true, pageSize: 10, currentPage: 1 },
    sorting: { enabled: true, defaultSort: { key: 'codice', direction: 'asc' as const } },
    selection: { enabled: false, selectedItems: [], idField: 'id' },
    emptyMessage: 'Nessun GPS trovato. Modifica i filtri.',
    className: 'gps-table',
  };
};
