// @store_admin/logs/logs.types.ts

export interface LogItem {
  id: number | string;
  machine_ip: string;
  customer_Name: string;
  name_alarm: string;
  code_alarm: string;
  date_and_time: string; // ISO string
  message?: string;
}

export interface ApiMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
}

export interface ApiResponse<T> {
  meta: ApiMeta;
  data: T[];
}

export interface LogsResponse extends ApiResponse<LogItem> {
  data: LogItem[];
}

export interface LogsState {
  items: LogItem[];
  selected: LogItem | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    // filtri lato UI / querystring
    machine_ip: string;
    code_alarm: string;
    name_alarm: string;
    date_from: string; // ISO (yyyy-mm-dd) o ISO datetime
    date_to: string; // ISO
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}

export interface LogsQueryParams {
  page?: number;
  page_size?: number;
  machine_ip?: string;
  code_alarm?: string;
  name_alarm?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
