import React from 'react';
import type { TicketRead } from '@store_admin/tickets/ticket.types';
import { CategoryBadge } from '@shared/badges/CategoryBadge.tsx';
import { StatusBadge } from '@shared/badges/StatusBadge.tsx';

type DeviceLite = {
  machine_name?: string;
  city?: string;
  province?: string;
  customer_name?: string;
};

type TicketWithDevice = TicketRead & {
  device?: DeviceLite | null;
};

interface TicketsTableConfigProps {
  tickets: TicketRead[];
  onEdit: (data: { id: number | string; [key: string]: any }) => Promise<any>;
  onDelete: (ticket: TicketRead) => void;
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  pagination?: any;
}

export const createTicketsTableConfig = ({
  tickets,
  onEdit,
  onDelete,
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
  pagination,
}: TicketsTableConfigProps) => ({
  columns: [
    { key: 'id', header: 'ID', type: 'text' as const, width: '80px', sortable: true },
    { 
      key: 'description', 
      header: 'Descrizione', 
      type: 'text' as const, 
      width: '250px',
      sortable: true,
      textConfig: {
        overflow: 'smart' as const,
        maxLines: 3,
        maxWidth: '250px',
        showTooltip: true
      }
    },
    { 
      key: 'alarm', 
      header: 'Stato', 
      type: 'custom' as const, 
      sortable: true, 
      width: '120px',
      render: (_: any, t: TicketWithDevice) => <StatusBadge status={t.alarm as any} /> 
    },
    { key: 'category', header: 'Categoria', type: 'text' as const, sortable: true },
    { 
      key: 'type', 
      header: 'Tipo', 
      width: '240px',
      type: 'custom' as const, 
      render: (_: any, t: TicketWithDevice) => (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {(t?.type ?? []).map((cat: any, i: number) => 
            <CategoryBadge key={i} category={cat?.key ?? String(cat)} />
          )}
        </div>
      )
    },
    {
      key: 'machine',
      header: 'Macchina',
      type: 'custom' as const,
      width: '220px',
      sortable: true,
      render: (_: any, t: TicketWithDevice) => {
        if (!t.device) {
          return <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Macchina non trovata</span>;
        }
        
        return (
          <div>
            {t.device.machine_name && (
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {t.device.machine_name}
              </div>
            )}
            {(t.device.city || t.device.province) && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {t.device.city}{t.device.province ? `, ${t.device.province}` : ''}
              </div>
            )}
            {t.device.customer_name && (
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {t.device.customer_name}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'date_Time',
      header: 'Data Apertura',
      type: 'custom' as const,
      width: '200px',
      sortable: true,
      render: (_: any, t: TicketWithDevice) => {
        const raw = (t as any).date_Time || (t as any).date_time || (t as any).created_at;
        if (!raw) return <span style={{ color: 'var(--text-secondary)' }}>N/A</span>;
        const d = new Date(raw);
        return (
          <div>
            <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
              {d.toLocaleDateString('it-IT')}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        );
      },
    },
    { 
      key: 'actions', 
      header: 'Azioni', 
      type: 'custom' as const, 
      width: '120px',
      render: (_: any, t: TicketWithDevice) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* Qui puoi montare modali/bottoni azione */}
        </div>
      )
    },
  ],
  data: tickets,
  loading: isLoading,
  pagination,
  sorting: { 
    enabled: true, 
    currentSort: (sortBy && sortOrder) ? { key: sortBy, direction: sortOrder } : undefined, 
    onSort,
    defaultSort: { key: 'date_Time', direction: 'desc' as const },
  },
  emptyMessage: 'Nessun ticket trovato.',
});