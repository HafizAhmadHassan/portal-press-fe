// @sections_admin/gpsList/config/gpsFilterConfig.ts
import type { FilterConfig } from "@utils/types/filters.types";

export const GpsFields = {
  CODICE: "codice",
  MUNICIPILITY: "municipility",
  CUSTOMER: "customer",
  WASTE: "waste",
} as const;

export const createGpsFilterConfig = ({
  filters,
  setFilter,
}): FilterConfig[] => [
  {
    key: GpsFields.CODICE,
    type: "text",
    label: "Codice",
    name: GpsFields.CODICE,
    placeholder: "es. 1304",
    value: filters[GpsFields.CODICE] || "",
    onChange: (e: any) => setFilter(GpsFields.CODICE, e.target?.value || e),
  },
  {
    key: GpsFields.MUNICIPILITY,
    type: "text",
    label: "Comune",
    name: GpsFields.MUNICIPILITY,
    placeholder: "es. RUBANO (PD)",
    value: filters[GpsFields.MUNICIPILITY] || "",
    onChange: (e: any) =>
      setFilter(GpsFields.MUNICIPILITY, e.target?.value || e),
  },
  {
    key: GpsFields.CUSTOMER,
    type: "text",
    label: "Cliente",
    name: GpsFields.CUSTOMER,
    placeholder: "es. etra",
    value: filters[GpsFields.CUSTOMER] || "",
    onChange: (e: any) => setFilter(GpsFields.CUSTOMER, e.target?.value || e),
  },
  {
    key: GpsFields.WASTE,
    type: "text",
    label: "Tipo rifiuto",
    name: GpsFields.WASTE,
    placeholder: "es. SECCO",
    value: filters[GpsFields.WASTE] || "",
    onChange: (e: any) => setFilter(GpsFields.WASTE, e.target?.value || e),
  },
];
