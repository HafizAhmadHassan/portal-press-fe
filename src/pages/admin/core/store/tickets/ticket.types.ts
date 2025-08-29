// === STATUS / PRIORITY / CATEGORY (legacy) ===
export type TicketStatus = 1 | 2;
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type TicketCategory = "ELECTRIC" | "DATABASE" | "MECHANIC" | "HYDRAULIC";

// === UTENTI / DEVICE (tipi snelli per lista) ===
export interface UserInfo {
  id: number;
  fullName?: string | null;
  email?: string | null;
  username: string;
}

export interface DeviceInfo {
  id: number;
  machine_Name: string;
  city?: string | null;
  customer?: string | null;
  status: number;
}

// === TICKET BASE/READ (compat con liste già esistenti) ===
export interface TicketBase {
  title: string;
  description?: string | null;
  status?: TicketStatus;
  priority?: TicketPriority | null;
  category?: TicketCategory[];
  due_date?: string | null; // ISO date string
}

export interface TicketRead extends TicketBase {
  id: number;
  device_id: number;
  opened_by_user_id: number;
  created_by_user_id: number;
  assigned_to_user_id?: number | null;
  created_At: string;
  updated_At: string;
  closed_at?: string | null;
  customer_Name?: string | null;
  open_Description?: string | null;
  close_Description?: string | null;

  // backend "messages": campo per join device
  machine: number;

  // opzionali/arricchiti
  device?: DeviceInfo;
  opened_by?: UserInfo;
  created_by?: UserInfo;
  assigned_to?: UserInfo | null;
}

export interface TicketReadWithRelations extends TicketRead {
  device: DeviceInfo;
}

// === QUERY PARAMS LISTA ===
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

// === Nuovi tipi apertura "messages/" ===
export type ProblemCategory =
  | "DATA_BASE"
  | "IDRAULICO"
  | "ELETTRICO"
  | "MECCANICO";

export interface MessageCreate {
  machine: number;
  problema: ProblemCategory[];
  status: 1 | 2;
  open_Description: string;
  customer_Name: string;
}

export type CreateTicketRequest = MessageCreate;

export interface TicketUpdate {
  title?: string;
  description?: string | null;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory[];
  assigned_to_user_id?: number | null;
  due_date?: string | null;
  close_Description?: string | null;
  open_Description?: string | null;
  guarantee_status?: string[] | null;
  extra?: string[] | null;
}

export interface UpdateTicketRequest {
  id: number;
  data: TicketUpdate;
}

export interface BulkActionRequest {
  action: string;
  ticketIds: (string | number)[];
}

// === Response generica con meta ===
export interface ApiMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next?: boolean;
  has_prev?: boolean;
  next_page?: number | null;
  prev_page?: number | null;
}

export interface ApiResponse<T> {
  meta: ApiMeta;
  data: T[];
}
