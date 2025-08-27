import React from "react";
import type { TicketRead } from "@store_admin/tickets/ticket.types";
import { StatusBadge } from "@shared/badges/StatusBadge.tsx";
import ModalCloseTicket from "../_modals/ModalCloseTIcket/ModalCloseTicket.component";
import { PowerIcon } from "lucide-react";
import ModalTicketDetails from "../_modals/ModalDetailTicket/ModalTicketDetail";

// Info minime del device collegate al ticket (arricchite dal join nell'hook)
type DeviceLite = {
  machine__Name?: string;
  city?: string;
  province?: string;
  customer_Name?: string;
  customer?: string;
  ip_Router?: string;
  waste?: string;
  address?: string;
  street?: string;
  postal_Code?: string;
  country?: string;
};

// Ticket che arriva in tabella con (eventuale) device
type TicketWithDevice = TicketRead & {
  device?: DeviceLite | null;
};

// Payload che il ModalCloseTicket manderà all'onSave
export type CloseTicketData = {
  ticketId: number | string;
  date?: Date;
  note?: string;
  info?: string;
  address?: string;
  inGaranzia?: boolean;
  fuoriGaranzia?: boolean;
  machine_retrival?: boolean;
  machine_not_repairable?: boolean;
};

interface TicketsTableConfigProps {
  tickets: TicketRead[];
  onEdit: (data: { id: number | string; [key: string]: any }) => Promise<any>;
  onDelete: (ticket: TicketRead) => void;
  onClose: (data: CloseTicketData) => Promise<any>; // handler chiusura
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string, order: "asc" | "desc") => void;
  pagination?: any;
}

const isClosed = (t: any) =>
  t?.status === 2 || t?.status === "closed" || t?.status === "CLOSED";

export const createTicketsTableConfig = ({
  tickets,
  onEdit,
  onDelete,
  onClose,
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
  pagination,
}: TicketsTableConfigProps) => ({
  columns: [
    {
      key: "id",
      header: "ID",
      type: "text" as const,
      width: "80px",
      sortable: true,
    },
    {
      key: "open_Description",
      header: "Descrizione",
      type: "text" as const,
      width: "250px",
      sortable: true,
      textConfig: {
        overflow: "smart" as const,
        maxLines: 3,
        maxWidth: "250px",
        showTooltip: true,
      },
    },
    {
      key: "status",
      header: "Stato",
      type: "custom" as const,
      sortable: true,
      width: "120px",
      render: (_: any, t: TicketWithDevice) => (
        <StatusBadge status={t.status as any} />
      ),
    },
    {
      key: "customer",
      header: "Cliente",
      type: "text" as const,
      sortable: true,
    },

    {
      key: "machine",
      header: "Macchina",
      type: "custom" as const,
      width: "220px",
      sortable: true,
      render: (_: any, t: TicketWithDevice) => {
        if (!t.device) {
          return (
            <span
              style={{ color: "var(--text-secondary)", fontStyle: "italic" }}
            >
              Macchina non trovata
            </span>
          );
        }

        return (
          <div>
            {t.device.machine__Name && (
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {t.device.machine__Name}
              </div>
            )}
            {(t.device.city || t.device.province) && (
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {t.device.city}
                {t.device.province ? `, ${t.device.province}` : ""}
              </div>
            )}
            {(t.device.customer_Name || (t.device as any).customer) && (
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {t.device.customer_Name || (t.device as any).customer}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "date_Time",
      header: "Data Apertura",
      type: "custom" as const,
      width: "200px",
      sortable: true,
      render: (_: any, t: TicketWithDevice) => {
        const raw =
          (t as any).date_Time || (t as any).date_time || (t as any).created_at;
        if (!raw)
          return <span style={{ color: "var(--text-secondary)" }}>N/A</span>;
        const d = new Date(raw);
        return (
          <div>
            <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>
              {d.toLocaleDateString("it-IT")}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              {d.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Azioni",
      type: "custom" as const,
      width: "160px",
      render: (_: any, t: TicketWithDevice) => (
        <div style={{ display: "flex", gap: "8px" }}>
          {isClosed(t) ? (
            // 👇 occhio: modale dettagli stile "utente"
            <ModalTicketDetails ticket={t as any} />
          ) : (
            // 👇 altrimenti: modale per CHIUDERE il ticket
            <ModalCloseTicket
              ticket={t as any}
              onSave={onClose}
              triggerButton={
                <button
                  type="button"
                  title="Chiudi ticket"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: "1px solid var(--border-color)",
                    background: "var(--surface-1)",
                    cursor: "pointer",
                  }}
                >
                  <PowerIcon size={14} />
                </button>
              }
            />
          )}
        </div>
      ),
    },
  ],
  data: tickets,
  loading: isLoading,
  pagination,
  sorting: {
    enabled: true,
    currentSort:
      sortBy && sortOrder ? { key: sortBy, direction: sortOrder } : undefined,
    onSort,
    defaultSort: { key: "date_Time", direction: "desc" as const },
  },
  emptyMessage: "Nessun ticket trovato.",
});
