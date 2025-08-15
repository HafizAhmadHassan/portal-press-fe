export type TicketStatus = 'open' | 'in_progress' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';
export type TicketCategory = 'ELECTRIC' | 'DATABASE' | 'MECHANIC' | 'HYDRAULIC';

export interface UserInfo {
  id: number;
  full_name?: string | null;
  email?: string | null;
  username: string;
}

export interface DeviceInfo {
  id: number;
  machine_name: string;
  city?: string | null;
  customer?: string | null;
  status: number;
}

// Base fields for creating or reading tickets
export interface TicketBase {
  title: string;
  description?: string | null;
  status?: TicketStatus;
  priority?: TicketPriority | null;
  category?: TicketCategory[];
  due_date?: string | null; // ISO date string
}

// Payload when creating a new ticket
export interface TicketCreate extends TicketBase {
  device_id: number;
  opened_by_user_id: number;
  created_by_user_id?: number | null;
  assigned_to_user_id?: number | null;
}

// Payload when updating an existing ticket
export interface TicketUpdate {
  title?: string;
  description?: string | null;
  status?: TicketStatus;
  priority?: TicketPriority;
  category?: TicketCategory[];
  assigned_to_user_id?: number | null;
  due_date?: string | null;
}

// Ticket as returned by the API (without relations)
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

  machine: number;
}

// Extended ticket with all relations required
export interface TicketReadWithRelations extends TicketRead {
  device: DeviceInfo;
  opened_by: UserInfo;
  created_by: UserInfo;
  assigned_to?: UserInfo | null;
}

// Query params for listing tickets
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
  sortOrder?: 'asc' | 'desc';
}

// Payload types for RTK Query endpoints
export type CreateTicketRequest = TicketCreate;
export interface UpdateTicketRequest {
  id: string | number;
  data: TicketUpdate;
}

export interface BulkActionRequest {
  action: string;
  ticketIds: (string | number)[];
}
