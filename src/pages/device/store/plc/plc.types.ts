// @store_admin/plc/plc.types.ts

/** Meta/response generici (come per GPS) */
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

/** Per ora non tipizziamo i singoli campi: lasciamo any/Record */
export type PlcData = Record<string, any>;
export type PlcIo = Record<string, any>;
export type PlcStatus = Record<string, any>;

/** Item della lista PLC (3 blocchi separati) */
export interface PlcItem {
  plc_data: PlcData;
  plc_io: PlcIo;
  plc_status: PlcStatus;
}

/** Response principale /plc */
export interface PlcResponse extends ApiResponse<PlcItem> {
  data: PlcItem[];
}

/** Stato Redux PLC (in linea con GPS) */
export interface PlcState {
  items: PlcItem[];
  selected: PlcItem | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: {
    search: string;
    sortBy: string;
    sortOrder: "asc" | "desc";
  };
}

/** Query params base */
export interface PlcQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
