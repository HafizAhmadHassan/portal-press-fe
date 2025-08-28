// ./_config/ticketsTableConfig.ts - VERSIONE CORRETTA
import React from "react";
import { PowerIcon } from "lucide-react";
import { StatusBadge } from "@shared/badges/StatusBadge.tsx";
import type { TicketRead } from "@store_admin/tickets/ticket.types";
import ModalTicketDetails from "../_modals/ModalDetailTicket/ModalTicketDetail";
import ModalCloseTicket from "../_modals/ModalCloseTIcket/ModalCloseTicket.component";

// Info del device collegato al ticket
type DeviceLite = {
  machine_Name?: string;
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

// Ticket con device opzionale
type TicketWithDevice = TicketRead & {
  device?: DeviceLite | null;
};

// Tipo per i dati di chiusura ticket
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

interface GetTicketsColumnsOptions {
  onEdit: (ticketData: {
    id: number | string;
    [key: string]: any;
  }) => Promise<any>;
  onDelete: (ticket: TicketRead) => Promise<void>;
  onClose: (data: CloseTicketData) => Promise<any>;
}

// Definizione chiavi per evitare problemi TypeScript
/* type TicketColumnKey =
  | keyof TicketRead
  | "machine"
  | "actions"
  | "open_Description"
  | "customer"
  | "date_Time"; */

const isClosed = (t: any) =>
  t?.status === 2 || t?.status === "closed" || t?.status === "CLOSED";

// PROBLEMA RISOLTO: Restituisci il tipo corretto
export const getTicketsColumns = ({ onClose }: GetTicketsColumnsOptions) => [
  // Colonna ID
  {
    key: "id",
    header: "ID",
    type: "text",
    width: "80px",
    sortable: true,
    textConfig: {
      overflow: "ellipsis",
      maxWidth: "60px",
      showTooltip: true,
    },
  },

  // Colonna Descrizione
  {
    key: "open_Description",
    header: "Descrizione",
    type: "text",
    width: "250px",
    sortable: true,
    textConfig: {
      overflow: "smart",
      maxLines: 3,
      maxWidth: "250px",
      showTooltip: true,
    },
    accessor: (ticket: TicketRead) => ticket.open_Description || "N/A",
  },

  // Colonna Stato con badge personalizzato
  {
    key: "status",
    header: "Stato",
    type: "custom",
    sortable: true,
    width: "120px",
    render: (_, ticket) => (
      <StatusBadge status={(ticket as TicketWithDevice).status as any} />
    ),
  },

  // Colonna Cliente
  {
    key: "customer",
    header: "Cliente",
    type: "text",
    sortable: true,
    width: "150px",
    textConfig: {
      overflow: "ellipsis",
      maxWidth: "130px",
      showTooltip: true,
    },
    accessor: (ticket: TicketRead) => {
      const t = ticket as TicketWithDevice;
      return (
        t.device?.customer_Name ||
        (t.device as any)?.customer ||
        ticket.customer_Name ||
        "N/A"
      );
    },
  },

  // Colonna Macchina personalizzata
  {
    key: "machine",
    header: "Macchina",
    type: "custom",
    width: "220px",
    sortable: true,
    render: (_, ticket) => {
      const t = ticket as TicketWithDevice;
      if (!t.device) {
        return (
          <span style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
            Macchina non trovata
          </span>
        );
      }

      return (
        <div>
          {t.device.machine_Name && (
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              {t.device.machine_Name}
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

  // Colonna Data Apertura
  {
    key: "date_Time",
    header: "Data Apertura",
    type: "custom",
    width: "200px",
    sortable: true,
    render: (_, ticket) => {
      const raw =
        ticket.date_Time ||
        ticket.date_time ||
        ticket.created_At ||
        ticket.createdAt;

      if (!raw)
        return <span style={{ color: "var(--text-secondary)" }}>N/A</span>;

      const date = new Date(raw);
      return (
        <div>
          <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>
            {date.toLocaleDateString("it-IT")}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
            {date.toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    },
  },

  // Colonna Azioni
  {
    key: "actions",
    header: "Azioni",
    type: "custom",
    width: "160px",
    render: (_, ticket) => {
      const t = ticket as TicketWithDevice;
      return (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          {isClosed(t) ? (
            <ModalTicketDetails ticket={t as any} />
          ) : (
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
                    color: "var(--text-primary)",
                  }}
                >
                  <PowerIcon size={14} />
                </button>
              }
            />
          )}
        </div>
      );
    },
  },
];
