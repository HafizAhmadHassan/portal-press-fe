// @store_device/plc/plc.types.ts

/** Meta informazioni per paginazione API */
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

/** Response generica API con meta e data */
export interface ApiResponse<T> {
  meta: ApiMeta;
  data: T[];
}

/** Dati PLC - mantenendo flessibilità ma con tipi base */
export interface PlcData {
  id: number;
  [key: string]: any; // Mantiene flessibilità per campi dinamici
}

/** Input/Output PLC */
export interface PlcIo {
  id: number;
  [key: string]: any; // Mantiene flessibilità per campi dinamici
}

/** Status PLC */
export interface PlcStatus {
  id: number;
  [key: string]: any; // Mantiene flessibilità per campi dinamici
}

/** Item completo PLC con i 3 blocchi */
export interface PlcItem {
  plc_data: PlcData;
  plc_io: PlcIo;
  plc_status: PlcStatus;
}

/** Response lista PLC */
export interface PlcResponse extends ApiResponse<PlcItem> {
  data: PlcItem[];
}

/** Parametri per query PLC */
export interface PlcQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  // Aggiungi altri filtri specifici se necessari
  codice?: string;
  municipility?: string;
  customer?: string;
  waste?: string;
}

/** Filtri disponibili per PLC */
export interface PlcFilters {
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  codice: string;
  municipility: string;
  customer: string;
  waste: string;
}

/** Informazioni di paginazione */
export interface PlcPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Stato Redux per PLC */
export interface PlcState {
  items: PlcItem[];
  selected: PlcItem | null;
  isLoading: boolean;
  error: string | null;
  pagination: PlcPagination;
  filters: PlcFilters;
}

/** Payload per creazione PLC */
export type CreatePlcPayload = Partial<
  Omit<PlcItem, "plc_data" | "plc_io" | "plc_status">
> & {
  plc_data?: Partial<PlcData>;
  plc_io?: Partial<PlcIo>;
  plc_status?: Partial<PlcStatus>;
};

/** Payload per aggiornamento PLC */
export type UpdatePlcPayload = {
  id: number;
  data: Partial<PlcItem>;
};

/** Tipi per TableKeyValue component */
export interface TableKeyValueRow {
  id: number;
  key: string;
  label: string;
  type: "text" | "number" | "boolean";
  value: any;
  readOnly?: boolean;
  step?: number;
}

/** Opzioni per ricerca PLC */
export interface PlcSearchOptions {
  query: string;
  limit?: number;
}

/** Statistiche PLC se disponibili */
export interface PlcStats {
  total: number;
  online: number;
  offline: number;
  // Aggiungi altre statistiche se necessarie
}
