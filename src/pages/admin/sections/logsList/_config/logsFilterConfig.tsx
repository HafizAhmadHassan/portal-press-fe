// @sections_admin/logsList/config/logsFilterConfig.ts
import type { FilterConfig } from "@utils/types/filters.types";

export const LogsFields = {
  MACHINE_IP: "machine_ip",
  CODE_ALARM: "code_alarm",
  NAME_ALARM: "name_alarm",
  DATE_FROM: "date_from",
  DATE_TO: "date_to",
  SEARCH: "search",
} as const;

export const createLogsFilterConfig = ({
  filters,
  setFilter,
}: {
  filters: Record<string, any>;
  setFilter: (key: string, val: any) => void;
}): FilterConfig[] => [
  {
    key: LogsFields.MACHINE_IP,
    type: "text",
    label: "IP Macchina",
    name: LogsFields.MACHINE_IP,
    placeholder: "es. 10.20.1.49",
    value: filters[LogsFields.MACHINE_IP] || "",
    onChange: (e: any) =>
      setFilter(LogsFields.MACHINE_IP, e?.target?.value ?? e),
  },
  {
    key: LogsFields.CODE_ALARM,
    type: "text",
    label: "Codice allarme",
    name: LogsFields.CODE_ALARM,
    placeholder: "es. F07",
    value: filters[LogsFields.CODE_ALARM] || "",
    onChange: (e: any) =>
      setFilter(LogsFields.CODE_ALARM, e?.target?.value ?? e),
  },
  {
    key: LogsFields.NAME_ALARM,
    type: "text",
    label: "Nome allarme",
    name: LogsFields.NAME_ALARM,
    placeholder: "es. Porta Aperta",
    value: filters[LogsFields.NAME_ALARM] || "",
    onChange: (e: any) =>
      setFilter(LogsFields.NAME_ALARM, e?.target?.value ?? e),
  },
  {
    key: LogsFields.DATE_FROM,
    type: "text", // usa "text" per compat, inserisci ISO yyyy-mm-dd
    label: "Dal",
    name: LogsFields.DATE_FROM,
    placeholder: "yyyy-mm-dd",
    value: filters[LogsFields.DATE_FROM] || "",
    onChange: (e: any) =>
      setFilter(LogsFields.DATE_FROM, e?.target?.value ?? e),
  },
  {
    key: LogsFields.DATE_TO,
    type: "text",
    label: "Al",
    name: LogsFields.DATE_TO,
    placeholder: "yyyy-mm-dd",
    value: filters[LogsFields.DATE_TO] || "",
    onChange: (e: any) => setFilter(LogsFields.DATE_TO, e?.target?.value ?? e),
  },
  {
    key: LogsFields.SEARCH,
    type: "text",
    label: "Ricerca libera",
    name: LogsFields.SEARCH,
    placeholder: "cerca in oggetto/testo",
    value: filters[LogsFields.SEARCH] || "",
    onChange: (e: any) => setFilter(LogsFields.SEARCH, e?.target?.value ?? e),
  },
];
