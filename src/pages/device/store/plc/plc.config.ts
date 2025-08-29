import {
  PLC_API_CONFIG,
  PLC_PAGINATION,
} from "@root/pages/device/store/plc/plc.constants";
import type { PlcQueryParams } from "./plc.types";

/** Configurazione paginazione di default */
export const defaultPaginationConfig = {
  page: 1,
  page_size: PLC_PAGINATION.DEFAULT_PAGE_SIZE,
};

/** Parametri query di default */
export const defaultQueryParams: PlcQueryParams = {
  ...defaultPaginationConfig,
  sortBy: "id",
  sortOrder: "asc",
  search: "",
};

/** Configurazione filtri avanzati (se servono) */
export const filterConfig = {
  searchableFields: [
    "machine_name",
    "codice",
    "municipility",
    "customer",
    "notes",
  ] as const,
  numericFields: [
    "id",
    "pressure",
    "weight",
    "temperature",
    "sequence",
  ] as const,
  booleanFields: [
    "online",
    "connected",
    "fault",
    "error",
    "maintenance_mode",
  ] as const,
};

/** Configurazione real-time */
export const realtimeConfig = {
  pollingInterval: PLC_API_CONFIG.POLLING_INTERVAL,
  realtimeFields: [
    "pressure",
    "weight",
    "temperature",
    "online",
    "connected",
    "basket_in",
    "basket_out",
  ] as const,
  staleTimeThresholds: {
    critical: 30_000,
    warning: 60_000,
    normal: 300_000,
  },
};

/** Configurazione export (se usata in UI) */
export const exportConfig = {
  supportedFormats: ["csv", "xlsx", "json"] as const,
  csvConfig: {
    delimiter: ",",
    encoding: "utf-8",
    includeHeaders: true,
  },
};

/** Configurazione UI */
export const uiConfig = {
  searchDebounce: PLC_API_CONFIG.DEBOUNCE_DELAY,
  table: {
    rowHeight: 48,
    compactRowHeight: 36,
    maxVisibleRows: 50,
  },
};
