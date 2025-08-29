import type { TicketRead } from "@store_admin/tickets/ticket.types";

export type DeviceLite = {
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
} | null;

export type CloseTicketData = {
  id: number;
  status: number;
  customer_Name: string;
  open_Description: string;
  close_Description: string;
  problema: string[];
  guanratee_status: string[];
  date_Time: Date | string;
  machine: number;
};

export type TicketWithDevice = TicketRead & {
  device?: DeviceLite;
};
