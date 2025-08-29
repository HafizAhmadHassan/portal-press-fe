import type { PlcItem, TableKeyValueRow } from "./plc.types";

/** label leggibile da snake_case */
export function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(Plc|Io|Id|Cpu|Ram|Wifi)\b/gi, (m) => m.toUpperCase());
}

export function inferFieldType(
  key: string,
  value: any
): "text" | "number" | "boolean" {
  if (typeof value === "number" && (value === 0 || value === 1)) {
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
    if (booleanFields.some((f) => key.toLowerCase().includes(f)))
      return "boolean";
  }
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  return "text";
}

export function getFieldUnit(key: string): string | undefined {
  const k = key.toLowerCase();
  if (k.includes("pressure") || k.includes("pressione")) return "bar";
  if (k.includes("weight") || k.includes("peso")) return "kg";
  if (k.includes("temp")) return "°C";
  if (k.includes("voltage") || k.includes("volt")) return "V";
  if (k.includes("current") || k.includes("ampere")) return "A";
  if (k.includes("speed") || k.includes("velocit")) return "rpm";
  if (k.includes("time") || k.includes("tempo")) return "s";
  if (k.includes("percent") || k.includes("%")) return "%";
  return undefined;
}

/** obj -> righe tabellari key/value */
export function objectToTableRows(
  obj: Record<string, any> | null | undefined,
  startId: number = 1
): TableKeyValueRow[] {
  if (!obj) return [];
  const rows: TableKeyValueRow[] = [];
  const entries = Object.entries(obj);

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

  const restEntries = entries.filter(([k]) => k !== "id");
  restEntries
    .map<[string, any, string]>(([k, v]) => [k, v, humanizeKey(k)])
    .sort((a, b) => a[2].localeCompare(b[2], "it"))
    .forEach(([key, value, label], index) => {
      const type = inferFieldType(key, value);
      const unit = getFieldUnit(key);
      const processed =
        type === "boolean" && typeof value === "number"
          ? Boolean(value)
          : value;

      rows.push({
        id: startId + index + (idEntry ? 1 : 0),
        key,
        label: unit ? `${label} (${unit})` : label,
        type,
        value: processed,
        step: type === "number" && !Number.isInteger(value) ? 0.001 : 1,
      });
    });

  return rows;
}

/** righe tabellari -> obj */
export function tableRowsToObject(
  rows: TableKeyValueRow[]
): Record<string, any> {
  const result: Record<string, any> = {};
  rows.forEach((row) => {
    if (row.type === "boolean" && typeof row.value === "boolean") {
      result[row.key] = row.value ? 1 : 0;
    } else {
      result[row.key] = row.value;
    }
  });
  return result;
}

/** trova item PLC per ID in uno dei 3 blocchi */
export function findPlcItemById(items: PlcItem[], id: number): PlcItem | null {
  return (
    items.find(
      (item) =>
        item?.plc_data?.id === id ||
        item?.plc_io?.id === id ||
        item?.plc_status?.id === id
    ) || null
  );
}

/** online? */
export function isPlcOnline(item: PlcItem): boolean {
  return (
    item.plc_status?.online === true ||
    item.plc_status?.connected === 1 ||
    item.plc_data?.status === 1 ||
    item.plc_data?.online === 1
  );
}

/** problemi/errori? */
export function hasPlcIssues(item: PlcItem): boolean {
  return (
    item.plc_status?.error === true ||
    item.plc_status?.fault === 1 ||
    item.plc_status?.maintenance_mode === 1 ||
    item.plc_data?.fault === 1 ||
    item.plc_data?.error === 1
  );
}

/** filtro locale semplice */
export function filterPlcItems(
  items: PlcItem[],
  searchTerm: string
): PlcItem[] {
  if (!searchTerm.trim()) return items;
  const search = searchTerm.toLowerCase();

  const searchIn = (obj: Record<string, any>) =>
    Object.values(obj).some((v) => String(v).toLowerCase().includes(search));

  return items.filter(
    (item) =>
      searchIn(item.plc_data || {}) ||
      searchIn(item.plc_io || {}) ||
      searchIn(item.plc_status || {})
  );
}

/** diff per update parziale */
export function createUpdatePayload(
  original: PlcItem,
  updated: Partial<PlcItem>
): Partial<PlcItem> {
  const payload: Partial<PlcItem> = {};

  if (updated.plc_data && original.plc_data) {
    const c: any = {};
    Object.keys(updated.plc_data).forEach((k) => {
      if (updated.plc_data![k] !== original.plc_data![k])
        c[k] = updated.plc_data![k];
    });
    if (Object.keys(c).length > 0) payload.plc_data = c;
  }

  if (updated.plc_io && original.plc_io) {
    const c: any = {};
    Object.keys(updated.plc_io).forEach((k) => {
      if (updated.plc_io![k] !== original.plc_io![k]) c[k] = updated.plc_io![k];
    });
    if (Object.keys(c).length > 0) payload.plc_io = c;
  }

  if (updated.plc_status && original.plc_status) {
    const c: any = {};
    Object.keys(updated.plc_status).forEach((k) => {
      if (updated.plc_status![k] !== original.plc_status![k])
        c[k] = updated.plc_status![k];
    });
    if (Object.keys(c).length > 0) payload.plc_status = c;
  }

  return payload;
}

/** format display */
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
      const n =
        typeof value === "number"
          ? value.toFixed(3).replace(/\.?0+$/, "")
          : value;
      return unit ? `${n} ${unit}` : String(n);
    default:
      return String(value);
  }
}
