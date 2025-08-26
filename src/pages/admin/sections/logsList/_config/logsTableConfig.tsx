// @sections_admin/logsList/config/logsTableConfig.tsx
import type { LogItem } from "@store_admin/logs/logs.types";

function computeSeverity(
  name_alarm?: string,
  code_alarm?: string
): "info" | "warning" | "error" {
  const name = (name_alarm || "").toLowerCase();
  if (code_alarm?.startsWith("F")) return "error";
  if (
    name.includes("errore") ||
    name.includes("mancanza") ||
    name.includes("allarme") ||
    name.includes("bloccante")
  )
    return "error";
  if (name.includes("porta") || name.includes("superati")) return "warning";
  return "info";
}

const fmtDate = (iso?: string) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("it-IT", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return iso;
  }
};

export const createLogsTableConfig = ({
  logs,
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
}: {
  logs: LogItem[];
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string, direction?: "asc" | "desc") => void;
}) => {
  const tPrimary = "var(--text-primary)";
  const tSecondary = "var(--text-secondary)";

  return {
    columns: [
      {
        key: "date_and_time",
        header: "Data/Ora",
        type: "custom" as const,
        width: "180px",
        sortable: true,

        render: (_: any, d: LogItem) => {
          if (!d.date_and_time)
            return <span style={{ color: tSecondary }}>N/A</span>;
          const date = new Date(d.date_and_time);
          return (
            <div>
              <div style={{ fontSize: "14px", color: tPrimary }}>
                {date.toLocaleDateString("it-IT")}
              </div>
              <div style={{ fontSize: "12px", color: tSecondary }}>
                {date.toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        },
      },

      {
        key: "alarm",
        header: "Allarme",
        type: "custom" as const,
        width: "360px",
        sortable: false,
        render: (_: any, d: LogItem) => {
          const sev = computeSeverity(d.name_alarm, d.code_alarm);
          const color =
            sev === "error"
              ? "var(--danger-500)"
              : sev === "warning"
              ? "var(--warning-600)"
              : "var(--info-600)";
          return (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: color,
                    display: "inline-block",
                  }}
                /> */}
                <span style={{ fontWeight: 600, color: tPrimary }}>
                  {d.name_alarm}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        key: "code_alarm",
        header: "Codice Allarme",
        type: "custom" as const,
        width: "160px",
        sortable: true,
        render: (_: any, d: LogItem) => {
          return (
            <span
              style={{
                marginLeft: 6,
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 12,
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: tSecondary,
              }}
            >
              {d.code_alarm}
            </span>
          );
        },
      },
      {
        key: "machine_ip",
        header: "IP",
        type: "text" as const,
        width: "160px",
        sortable: true,
      },
      {
        key: "customer_Name",
        header: "Cliente",
        type: "text" as const,
        width: "160px",
        sortable: true,
      },
    ],
    data: logs,
    loading: isLoading,
    emptyMessage: "Nessun log trovato. Modifica i filtri.",
    pagination: { enabled: true, pageSize: 10, currentPage: 1 },
    sorting: {
      enabled: true,
      defaultSort: { key: "date_and_time", direction: "desc" as const },
      currentSortKey: sortBy,
      currentSortDirection: sortOrder,
      onSort,
    },
    selection: { enabled: false, selectedItems: [], idField: "id" },
    className: "logs-table",
  };
};
