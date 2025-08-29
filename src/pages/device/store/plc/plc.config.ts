// @store_device/plc/plc.config.ts
import type { PlcQueryParams } from "./plc.types";
import { PLC_API_CONFIG, PLC_PAGINATION } from "./plc.constants";

/** Configurazione per RTK Query */
export const plcApiConfig = {
  // Tag types per cache invalidation
  tagTypes: ["PLC_ITEM", "PLC_LIST", "PLC_STATS"] as const,

  // Configurazione cache
  keepUnusedDataFor: PLC_API_CONFIG.CACHE_TIME,

  // Configurazione retry
  retry: PLC_API_CONFIG.RETRY_ATTEMPTS,

  // Headers di default
  defaultHeaders: {
    "Content-Type": "application/json",
  },
};

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

/** Configurazione filtri avanzati */
export const filterConfig = {
  // Campi su cui è possibile fare ricerca testuale
  searchableFields: [
    "machine_name",
    "codice",
    "municipility",
    "customer",
    "notes",
  ] as const,

  // Campi numerici per range filtering
  numericFields: [
    "id",
    "pressure",
    "weight",
    "temperature",
    "sequence",
  ] as const,

  // Campi boolean per filtering
  booleanFields: [
    "online",
    "connected",
    "fault",
    "error",
    "maintenance_mode",
  ] as const,
};

/** Configurazione per real-time updates */
export const realtimeConfig = {
  // Campi che richiedono aggiornamenti frequenti
  realtimeFields: [
    "pressure",
    "weight",
    "temperature",
    "online",
    "connected",
    "basket_in",
    "basket_out",
  ] as const,

  // Intervallo di polling per dati real-time
  pollingInterval: PLC_API_CONFIG.POLLING_INTERVAL,

  // Soglie per considerare i dati "stale"
  staleTimeThresholds: {
    critical: 30000, // 30 secondi
    warning: 60000, // 1 minuto
    normal: 300000, // 5 minuti
  },
};

/** Configurazione validazione campi */
export const validationConfig = {
  // Regole per validazione ID
  id: {
    min: 1,
    max: 999999,
    required: true,
  },

  // Regole per campi numerici
  pressure: {
    min: 0,
    max: 100,
    step: 0.1,
    unit: "bar",
  },

  weight: {
    min: -1000,
    max: 10000,
    step: 0.01,
    unit: "kg",
  },

  temperature: {
    min: -50,
    max: 200,
    step: 0.1,
    unit: "°C",
  },

  // Regole per campi stringa
  stringFields: {
    maxLength: 255,
    minLength: 0,
  },
};

/** Configurazione per export/import */
export const exportConfig = {
  // Formati supportati per export
  supportedFormats: ["csv", "xlsx", "json"] as const,

  // Campi da includere nell'export
  exportFields: {
    basic: ["id", "online", "pressure", "weight"] as const,
    full: [
      "id",
      "online",
      "pressure",
      "weight",
      "temperature",
      "fault",
      "error",
    ] as const,
    custom: [] as string[],
  },

  // Configurazione CSV
  csvConfig: {
    delimiter: ",",
    encoding: "utf-8",
    includeHeaders: true,
  },
};

/** Configurazione notifiche/alerts */
export const alertConfig = {
  // Soglie per alert automatici
  thresholds: {
    pressure: {
      min: 0.5,
      max: 8.0,
      critical: 9.0,
    },
    temperature: {
      min: 5,
      max: 80,
      critical: 100,
    },
    weight: {
      min: -500,
      max: 5000,
      critical: 6000,
    },
  },

  // Durata alert
  alertDuration: 5000, // 5 secondi

  // Tipi di alert
  alertTypes: {
    info: "info",
    warning: "warning",
    error: "error",
    success: "success",
  } as const,
};

/** Configurazione UI/UX */
export const uiConfig = {
  // Debounce per ricerca
  searchDebounce: PLC_API_CONFIG.DEBOUNCE_DELAY,

  // Animazioni
  animations: {
    enabled: true,
    duration: 200,
  },

  // Temi
  theme: {
    colors: {
      online: "#22c55e",
      offline: "#ef4444",
      warning: "#f59e0b",
      unknown: "#6b7280",
    },
  },

  // Dimensioni tabella
  table: {
    rowHeight: 48,
    compactRowHeight: 36,
    maxVisibleRows: 50,
  },
};

/** Configurazione completa - merge di tutte le configurazioni */
export const plcConfig = {
  api: plcApiConfig,
  pagination: defaultPaginationConfig,
  query: defaultQueryParams,
  filters: filterConfig,
  realtime: realtimeConfig,
  validation: validationConfig,
  export: exportConfig,
  alerts: alertConfig,
  ui: uiConfig,
} as const;

export default plcConfig;
