// --- STATUS / PRIORITY / CATEGORY (legacy) ---
export type TicketStatus = "open" | "in_progress" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketCategory = "ELECTRIC" | "DATABASE" | "MECHANIC" | "HYDRAULIC";

// --- UTENTI / DEVICE ---
export interface UserInfo {
  id: number;
  fullName?: string | null;
  email?: string | null;
  username: string;
}

export interface DeviceInfo {
  id: number;
  machine__Name: string;
  city?: string | null;
  customer?: string | null;
  status: number;
}

// --- TICKET BASE/READ (compat con liste già esistenti) ---
export interface TicketBase {
  title: string;
  description?: string | null;
  status?: TicketStatus;
  priority?: TicketPriority | null;
  category?: TicketCategory[];
  due_date?: string | null; // ISO date string
}

// NB: Questi campi sono legacy per la parte "tickets", non per /messages/
export interface TicketRead extends TicketBase {
  id: number;
  device_id: number;
  opened_by_user_id: number;
  created_by_user_id: number;
  assigned_to_user_id?: number | null;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
  closed_at?: string | null;

  device?: DeviceInfo;
  opened_by?: UserInfo;
  created_by?: UserInfo;
  assigned_to?: UserInfo | null;

  // campo lato backend "messages" che usiamo per fare il join device
  machine: number;
}

export interface TicketReadWithRelations extends TicketRead {
  device: DeviceInfo;
  opened_by: UserInfo;
  created_by: UserInfo;
  assigned_to?: UserInfo | null;
}

// --- QUERY PARAMS LISTA ---
export interface TicketsQueryParams {
  page?: number;
  page_size?: number;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignee?: number | string;
  category?: TicketCategory | TicketCategory[];
  due_date?: string | null;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ===========================
// 🔹 Nuovi tipi per apertura "messages/"
// ===========================
export type ProblemCategory =
  | "DATA_BASE"
  | "IDRAULICO"
  | "ELETTRICO"
  | "MECCANICO";

export interface MessageCreate {
  machine: number; // id macchina
  problema: ProblemCategory[]; // costanti IT richieste
  status: 1 | 2; // 1 o 2
  open_Description: string; // descrizione apertura
  customer: string; // cliente
}

// Alias usato dai thunks per la creazione
export type CreateTicketRequest = MessageCreate;

// --- UPDATE (ancora per endpoint /tickets/...) ---
export interface TicketUpdate {
  title?: string;
  description?: string | null;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory[];
  assigned_to_user_id?: number | null;
  due_date?: string | null;
}

// Payload per update
export interface UpdateTicketRequest {
  id: string | number;
  data: TicketUpdate;
}

export interface BulkActionRequest {
  action: string;
  ticketIds: (string | number)[];
}
