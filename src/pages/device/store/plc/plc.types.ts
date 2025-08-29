import type { ApiMeta, ApiResponse } from "@root/utils/genericApi";

/** Dati PLC - manteniamo flessibilità ma con tipi base */
export interface PlcData {
  id: number;
  [key: string]: string | number | boolean | null | undefined;
}

/** Input/Output PLC */
export interface PlcIo {
  id: number;
  [key: string]: string | number | boolean | null | undefined;
}

/** Status PLC */
export interface PlcStatus {
  id: number;
  [key: string]: string | number | boolean | null | undefined;
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
  // Filtri “di dominio” (se non li usi, lasciali vuoti)
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

/** Informazioni di paginazione (UI) */

/** Stato Redux per PLC */
export interface PlcState {
  items: PlcItem[];
  selected: PlcItem | null;
  isLoading: boolean;
  error: string | null;
  pagination: ApiMeta;
  filters: PlcFilters;
}

/** Payload per creazione PLC */
export type CreatePlcPayload = Partial<PlcItem>;

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

/** Statistiche PLC (se disponibili) */
export interface PlcStats {
  total: number;
  online: number;
  offline: number;
}
