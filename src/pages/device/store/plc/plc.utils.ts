// @store_device/plc/plc.utils.ts
import type {
  PlcItem,
  PlcData,
  PlcIo,
  PlcStatus,
  TableKeyValueRow,
} from "./plc.types";

/**
 * Converte snake_case in label leggibile
 */
export function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(Plc|Io|Id|Cpu|Ram|Wifi)\b/gi, (m) => m.toUpperCase());
}

/**
 * Determina il tipo di campo in base al valore e al nome
 */
export function inferFieldType(
  key: string,
  value: any
): "text" | "number" | "boolean" {
  // Logica specifica per boolean (0/1)
  if (typeof value === "number" && (value === 0 || value === 1)) {
    // Campi che sono tipicamente boolean anche se numerici
    const booleanFields = [
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
    ];

    if (booleanFields.some((field) => key.toLowerCase().includes(field))) {
      return "boolean";
    }
  }

  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  return "text";
}

/**
 * Ottiene l'unità di misura basata sul nome del campo
 */
export function getFieldUnit(key: string): string | undefined {
  const lowerKey = key.toLowerCase();

  if (lowerKey.includes("pressure") || lowerKey.includes("pressione"))
    return "bar";
  if (lowerKey.includes("weight") || lowerKey.includes("peso")) return "kg";
  if (lowerKey.includes("temp")) return "°C";
  if (lowerKey.includes("voltage") || lowerKey.includes("volt")) return "V";
  if (lowerKey.includes("current") || lowerKey.includes("ampere")) return "A";
  if (lowerKey.includes("speed") || lowerKey.includes("velocit")) return "rpm";
  if (lowerKey.includes("time") || lowerKey.includes("tempo")) return "s";
  if (lowerKey.includes("percent") || lowerKey.includes("%")) return "%";

  return undefined;
}

/**
 * Converte un oggetto PLC (data/io/status) in TableKeyValueRow[]
 */
export function objectToTableRows(
  obj: Record<string, any> | null | undefined,
  startId: number = 1
): TableKeyValueRow[] {
  if (!obj) return [];

  const rows: TableKeyValueRow[] = [];
  const entries = Object.entries(obj);

  // ID sempre per primo e readonly
  const idEntry = entries.find(([k]) => k === "id");
  if (idEntry) {
    const [, value] = idEntry;
    rows.push({
      id: Number(value ?? 0),
      key: "id",
      label: "ID",
      type: "number",
      value: Number(value ?? 0),
      readOnly: true,
    });
  }

  // Resto dei campi ordinati
  const restEntries = entries.filter(([k]) => k !== "id");
  restEntries
    .map<[string, any, string]>(([k, v]) => [k, v, humanizeKey(k)])
    .sort((a, b) => a[2].localeCompare(b[2], "it"))
    .forEach(([key, value, label], index) => {
      const type = inferFieldType(key, value);
      const unit = getFieldUnit(key);

      // Converti 0/1 in boolean se rilevato come tale
      const processedValue =
        type === "boolean" && typeof value === "number"
          ? Boolean(value)
          : value;

      const step = type === "number" && !Number.isInteger(value) ? 0.001 : 1;

      rows.push({
        id: startId + index + (idEntry ? 1 : 0),
        key,
        label: unit ? `${label} (${unit})` : label,
        type,
        value: processedValue,
        step: type === "number" ? step : undefined,
      });
    });

  return rows;
}

/**
 * Converte TableKeyValueRow[] di nuovo in oggetto
 */
export function tableRowsToObject(
  rows: TableKeyValueRow[]
): Record<string, any> {
  const result: Record<string, any> = {};

  rows.forEach((row) => {
    if (row.type === "boolean" && typeof row.value === "boolean") {
      // Riconverti boolean in 0/1 se necessario per l'API
      result[row.key] = row.value ? 1 : 0;
    } else {
      result[row.key] = row.value;
    }
  });

  return result;
}

/**
 * Trova un PLC item per ID in qualsiasi dei 3 blocchi
 */
export function findPlcItemById(items: PlcItem[], id: number): PlcItem | null {
  return (
    items.find(
      (item) =>
        item?.plc_data?.id === id ||
        item?.plc_status?.id === id ||
        item?.plc_io?.id === id
    ) || null
  );
}

/**
 * Determina se un PLC è online basandosi sui suoi dati
 */
export function isPlcOnline(item: PlcItem): boolean {
  return (
    item.plc_status?.online === true ||
    item.plc_status?.connected === 1 ||
    item.plc_data?.status === 1 ||
    item.plc_data?.online === 1
  );
}

/**
 * Determina se un PLC ha problemi/errori
 */
export function hasPlcIssues(item: PlcItem): boolean {
  return (
    item.plc_status?.error === true ||
    item.plc_status?.fault === 1 ||
    item.plc_status?.maintenance_mode === 1 ||
    item.plc_data?.fault === 1 ||
    item.plc_data?.error === 1
  );
}

/**
 * Filtra items PLC basandosi su un termine di ricerca
 */
export function filterPlcItems(
  items: PlcItem[],
  searchTerm: string
): PlcItem[] {
  if (!searchTerm.trim()) return items;

  const search = searchTerm.toLowerCase();

  return items.filter((item) => {
    const searchInObject = (obj: Record<string, any>) =>
      Object.values(obj).some((value) =>
        String(value).toLowerCase().includes(search)
      );

    return (
      searchInObject(item.plc_data || {}) ||
      searchInObject(item.plc_io || {}) ||
      searchInObject(item.plc_status || {})
    );
  });
}

/**
 * Valida un payload PLC prima dell'invio
 */
export function validatePlcPayload(payload: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validazioni base
  if (!payload) {
    errors.push("Payload non può essere vuoto");
    return { isValid: false, errors };
  }

  // Valida plc_data se presente
  if (payload.plc_data) {
    if (typeof payload.plc_data !== "object") {
      errors.push("plc_data deve essere un oggetto");
    }
    if (payload.plc_data.id && typeof payload.plc_data.id !== "number") {
      errors.push("plc_data.id deve essere un numero");
    }
  }

  // Valida plc_io se presente
  if (payload.plc_io) {
    if (typeof payload.plc_io !== "object") {
      errors.push("plc_io deve essere un oggetto");
    }
  }

  // Valida plc_status se presente
  if (payload.plc_status) {
    if (typeof payload.plc_status !== "object") {
      errors.push("plc_status deve essere un oggetto");
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Crea un payload per update parziale mantenendo solo i campi modificati
 */
export function createUpdatePayload(
  original: PlcItem,
  updated: Partial<PlcItem>
): Partial<PlcItem> {
  const payload: Partial<PlcItem> = {};

  // Confronta ogni blocco
  if (updated.plc_data && original.plc_data) {
    const dataChanges = Object.keys(updated.plc_data).reduce((acc, key) => {
      if (updated.plc_data![key] !== original.plc_data![key]) {
        acc[key] = updated.plc_data![key];
      }
      return acc;
    }, {} as any);

    if (Object.keys(dataChanges).length > 0) {
      payload.plc_data = dataChanges;
    }
  }

  if (updated.plc_io && original.plc_io) {
    const ioChanges = Object.keys(updated.plc_io).reduce((acc, key) => {
      if (updated.plc_io![key] !== original.plc_io![key]) {
        acc[key] = updated.plc_io![key];
      }
      return acc;
    }, {} as any);

    if (Object.keys(ioChanges).length > 0) {
      payload.plc_io = ioChanges;
    }
  }

  if (updated.plc_status && original.plc_status) {
    const statusChanges = Object.keys(updated.plc_status).reduce((acc, key) => {
      if (updated.plc_status![key] !== original.plc_status![key]) {
        acc[key] = updated.plc_status![key];
      }
      return acc;
    }, {} as any);

    if (Object.keys(statusChanges).length > 0) {
      payload.plc_status = statusChanges;
    }
  }

  return payload;
}

/**
 * Formatta un valore per display nell'UI
 */
export function formatDisplayValue(
  value: any,
  type: string,
  unit?: string
): string {
  if (value === null || value === undefined) return "N/A";

  switch (type) {
    case "boolean":
      return value ? "Attivo" : "Inattivo";
    case "number":
      const formatted =
        typeof value === "number"
          ? value.toFixed(3).replace(/\.?0+$/, "")
          : value;
      return unit ? `${formatted} ${unit}` : formatted;
    default:
      return String(value);
  }
}
