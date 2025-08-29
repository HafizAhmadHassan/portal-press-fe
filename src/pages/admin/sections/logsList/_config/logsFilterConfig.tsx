import { LogsFields } from "@root/utils/constants/logsFields.constants";
import type { FilterConfig } from "@utils/types/filters.types";

type Params = {
  filters: Record<string, any>;
  setFilter: (key: string, value: any) => void;
};

export const createLogsFilterConfig = ({
  filters,
  setFilter,
}: Params): FilterConfig[] => [
  {
    key: LogsFields.MACHINE_IP,
    type: "text",
    label: "IP Macchina",
    name: LogsFields.MACHINE_IP,
    placeholder: "Es. 192.168.1.10",
    value: filters[LogsFields.MACHINE_IP] || "",
    onChange: (e: any) =>
      setFilter(LogsFields.MACHINE_IP, e.target?.value ?? e),
  },
  {
    key: LogsFields.CODE_ALARM,
    type: "text",
    label: "Codice Allarme",
    name: LogsFields.CODE_ALARM,
    placeholder: "Es. E23",
    value: filters[LogsFields.CODE_ALARM] || "",
    onChange: (e: any) =>
      setFilter(LogsFields.CODE_ALARM, e.target?.value ?? e),
  },
  {
    key: LogsFields.NAME_ALARM,
    type: "text",
    label: "Nome Allarme",
    name: LogsFields.NAME_ALARM,
    placeholder: "Es. Overheat",
    value: filters[LogsFields.NAME_ALARM] || "",
    onChange: (e: any) =>
      setFilter(LogsFields.NAME_ALARM, e.target?.value ?? e),
  },
  {
    key: LogsFields.DATE_FROM,
    type: "date",
    label: "Da",
    name: LogsFields.DATE_FROM,
    value: filters[LogsFields.DATE_FROM] || "",
    onChange: (value: string) => setFilter(LogsFields.DATE_FROM, value),
  },
  {
    key: LogsFields.DATE_TO,
    type: "date",
    label: "A",
    name: LogsFields.DATE_TO,
    value: filters[LogsFields.DATE_TO] || "",
    onChange: (value: string) => setFilter(LogsFields.DATE_TO, value),
  },
  {
    key: LogsFields.SEARCH,
    type: "text",
    label: "Ricerca",
    name: LogsFields.SEARCH,
    placeholder: "Cerca testo messaggio…",
    value: filters[LogsFields.SEARCH] || "",
    onChange: (e: any) => setFilter(LogsFields.SEARCH, e.target?.value ?? e),
  },
];
