// @store_device/plc/plc.constants.ts

/** Configurazioni API */
export const PLC_API_CONFIG = {
  POLLING_INTERVAL: 5000, // 5 secondi per real-time data
  CACHE_TIME: 60, // 60 secondi di cache
  RETRY_ATTEMPTS: 3,
  DEBOUNCE_DELAY: 300, // ms per debounce ricerca
} as const;

/** Limiti paginazione */
export const PLC_PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
} as const;

/** Campi che sono tipicamente boolean anche se numerici (0/1) */
export const BOOLEAN_FIELDS = [
  "online",
  "connected",
  "enabled",
  "active",
  "open",
  "closed",
  "fault",
  "error",
  "alarm",
  "maintenance",
  "reset",
  "tare",
  "door_open",
  "door_closed",
  "basket_in",
  "basket_out",
  "maintenance_mode",
  "restart_requested",
] as const;

/** Unità di misura per campi specifici */
export const FIELD_UNITS = {
  // Pressione
  pressure: "bar",
  pressione: "bar",

  // Peso
  weight: "kg",
  peso: "kg",

  // Temperatura
  temp: "°C",
  temperature: "°C",
  temperatura: "°C",

  // Elettrici
  voltage: "V",
  volt: "V",
  current: "A",
  ampere: "A",

  // Velocità
  speed: "rpm",
  velocit: "rpm",

  // Tempo
  time: "s",
  tempo: "s",

  // Percentuale
  percent: "%",
} as const;

/** Campi prioritari per ordinamento */
export const PRIORITY_FIELDS = [
  "basket",
  "door",
  "weight",
  "pressure",
  "temperature",
  "online",
  "status",
] as const;

/** Messaggi di errore standard */
export const ERROR_MESSAGES = {
  FETCH_ERROR: "Errore nel caricamento dei dati PLC",
  SAVE_ERROR: "Errore nel salvataggio dei dati PLC",
  DELETE_ERROR: "Errore nell'eliminazione del PLC",
  CREATE_ERROR: "Errore nella creazione del PLC",
  VALIDATION_ERROR: "Dati non validi",
  NETWORK_ERROR: "Errore di connessione",
  UNAUTHORIZED_ERROR: "Accesso non autorizzato",
  NOT_FOUND_ERROR: "PLC non trovato",
} as const;

/** Stati possibili del dispositivo */
export const DEVICE_STATUS = {
  ONLINE: "online",
  OFFLINE: "offline",
  UNKNOWN: "unknown",
  MAINTENANCE: "maintenance",
  ERROR: "error",
} as const;

/** Tipi di comando disponibili */
export const DEVICE_COMMANDS = {
  OPEN_DOOR: "open-door",
  CLOSE_DOOR: "close-door",
  TARE: "tare",
  MAINTENANCE: "maintenance",
  RESTART: "restart",
  RESET: "reset",
} as const;

/** Configurazione validazione */
export const VALIDATION_RULES = {
  ID_MIN: 1,
  ID_MAX: 999999,
  STRING_MAX_LENGTH: 255,
  NUMBER_MAX: 999999,
  NUMBER_MIN: -999999,
} as const;
