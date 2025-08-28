// ./_config/ticketsFilterConfig.ts - VERSIONE CORRETTA SENZA HOOK
/* eslint-disable react-refresh/only-export-components */
import type { FilterConfig } from "@utils/types/filters.types";

export const TicketFields = {
  TITLE: "title",
  STATUS: "status",
  PRIORITY: "priority",
  CATEGORY: "category",
  ASSIGNED_TO: "assigned_to",
} as const;

export interface CreateTicketsFilterConfigProps {
  filters: Record<string, string | number | boolean | null | undefined>;
  setFilter: (
    key: string,
    value: string | number | boolean | null | undefined
  ) => void;
}

// Opzioni statiche (stabili, non si ricreano)
const STATUS_OPTIONS = [
  { label: "Tutti gli stati", value: "" },
  { label: "Aperto", value: "open" },
  { label: "In Corso", value: "in_progress" },
  { label: "Chiuso", value: "closed" },
];

const PRIORITY_OPTIONS = [
  { label: "Tutte le priorità", value: "" },
  { label: "Bassa", value: "low" },
  { label: "Media", value: "medium" },
  { label: "Alta", value: "high" },
  { label: "Critica", value: "critical" },
];

const CATEGORY_OPTIONS = [
  { label: "Tutte le categorie", value: "" },
  { label: "Bug", value: "bug" },
  { label: "Feature", value: "feature" },
  { label: "Miglioramento", value: "enhancement" },
  { label: "Performance", value: "performance" },
  { label: "Documentazione", value: "documentation" },
  { label: "Infrastruttura", value: "infrastructure" },
  { label: "Manutenzione", value: "maintenance" },
  { label: "Sicurezza", value: "security" },
];

// Funzione di configurazione semplice (nessun hook)
export const createTicketsFilterConfig = ({
  filters,
  setFilter,
}: CreateTicketsFilterConfigProps): FilterConfig[] => [
  {
    key: TicketFields.TITLE,
    type: "text",
    label: "Titolo/Descrizione",
    name: TicketFields.TITLE,
    placeholder: "Cerca per titolo o descrizione...",
    value: filters[TicketFields.TITLE] ?? "",
    onChange: (value: string | React.ChangeEvent<HTMLInputElement>) => {
      const stringValue =
        typeof value === "string" ? value : value.target.value;
      setFilter(TicketFields.TITLE, stringValue);
    },
  },
  {
    key: TicketFields.STATUS,
    type: "select",
    label: "Stato",
    name: TicketFields.STATUS,
    placeholder: "Tutti gli stati",
    value: filters[TicketFields.STATUS] ?? "",
    onChange: (value: string | number) => setFilter(TicketFields.STATUS, value),
    options: STATUS_OPTIONS,
  },
  {
    key: TicketFields.PRIORITY,
    type: "select",
    label: "Priorità",
    name: TicketFields.PRIORITY,
    placeholder: "Tutte le priorità",
    value: filters[TicketFields.PRIORITY] ?? "",
    onChange: (value: string | number) =>
      setFilter(TicketFields.PRIORITY, value),
    options: PRIORITY_OPTIONS,
  },
  {
    key: TicketFields.CATEGORY,
    type: "select",
    label: "Categoria",
    name: TicketFields.CATEGORY,
    placeholder: "Tutte le categorie",
    value: filters[TicketFields.CATEGORY] ?? "",
    onChange: (value: string | number) =>
      setFilter(TicketFields.CATEGORY, value),
    options: CATEGORY_OPTIONS,
  },
  {
    key: TicketFields.ASSIGNED_TO,
    type: "text",
    label: "Assegnato a",
    name: TicketFields.ASSIGNED_TO,
    placeholder: "Nome o email...",
    value: filters[TicketFields.ASSIGNED_TO] ?? "",
    onChange: (value: string | React.ChangeEvent<HTMLInputElement>) => {
      const stringValue =
        typeof value === "string" ? value : value.target.value;
      setFilter(TicketFields.ASSIGNED_TO, stringValue);
    },
  },
];
