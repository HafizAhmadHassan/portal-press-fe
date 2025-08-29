// @store_admin/gps/gps.types.ts

export interface GpsDevice {
  id: number;
  codice: string;
  gps_x: string; // lat
  gps_y: string; // lng
  municipility: string; // (scritto così nel BE)
  customer_Name: string;
  waste: string;
  address: string;
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

export interface GpsResponse extends ApiResponse<GpsDevice> {
  data: GpsDevice[];
}

export interface GpsState {
  items: GpsDevice[];
  selected: GpsDevice | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    codice: string;
    municipility: string;
    customer_Name: string;
    waste: string;
    search: string; // opzionale, solo se il BE lo supporta
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}

export interface CreateGpsRequest extends Partial<GpsDevice> {
  codice: string;
  gps_x: string;
  gps_y: string;
  municipility: string;
  customer_Name: string;
  waste: string;
  address: string;
}

export interface UpdateGpsRequest {
  id: number | number;
  data: Partial<GpsDevice>;
}

export interface GpsQueryParams {
  page?: number;
  page_size?: number;
  codice?: string;
  municipility?: string;
  customer_Name?: string;
  waste?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface BulkActionRequest {
  ids: (string | number)[];
  action: "delete"; // manteniamo solo ciò che è certo
  data?: Partial<GpsDevice>;
}

export interface GpsStatsResponse {
  total: number;
  // aggiungi qui altri campi quando il BE li fornirà
}
