import type { TableColumn } from "@components/shared/table/types/GenericTable.types";
import type { LogItem } from "@store_admin/logs/logs.types";

/** Calcolo severità dal nome/codice allarme */
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
  ) {
    return "error";
  }
  if (name.includes("porta") || name.includes("superati")) return "warning";
  return "info";
}

interface FlatLogRow extends Partial<LogItem> {
  id: number | string;
  machine_detail?: {
    matricola_Kgn?: string;
    matricola_kgn?: string;
    matricola_Bte?: string;
    matricola_bte?: string;
  } | null;
}
export const getLogsColumns = (options?: {
  includeMachineDetail?: boolean;
}): Array<TableColumn<FlatLogRow>> => {
  const tPrimary = "var(--text-primary)";
  const tSecondary = "var(--text-secondary)";

  const cols: Array<TableColumn<FlatLogRow>> = [
    {
      key: "date_and_time",
      header: "Data/Ora",
      type: "custom",
      width: "180px",
      sortable: true,
      render: (_v, row) => {
        if (!row.date_and_time)
          return <span style={{ color: tSecondary }}>N/A</span>;
        const d = new Date(row.date_and_time);
        if (isNaN(d.getTime()))
          return <span style={{ color: tSecondary }}>N/D</span>;
        return (
          <div>
            <div style={{ fontSize: 14, color: tPrimary }}>
              {d.toLocaleDateString("it-IT")}
            </div>
            <div style={{ fontSize: 12, color: tSecondary }}>
              {d.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },
    {
      key: "machine_detail",
      header: "Matricola Macchina",
      type: "custom",
      width: "220px",
      sortable: true,
      render: (_, logs) => {
        return (
          <div>
            <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>
              BTE: {logs.machine_detail.matricola_Bte || "N/A"}
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>
              KGN: {logs.machine_detail.matricola_Kgn || "N/A"}
            </div>
          </div>
        );
      },
    },
    {
      key: "address",
      header: "Indirizzo",
      type: "custom",
      width: "200px",
      sortable: true,
      render: (_v, row) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: tPrimary }}>
            {(row as any).gps.address || "—"}
          </div>
          <div style={{ fontSize: 12, color: tSecondary }}>
            {(row as any).gps.municipility || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "alarm",
      header: "Messaggio",
      type: "custom",
      width: "360px",
      sortable: false,
      render: (_v, row) => {
        const sev = computeSeverity(row.name_alarm, row.code_alarm);
        const sevColor =
          sev === "error"
            ? "var(--error-color)"
            : sev === "warning"
            ? "var(--warning-color)"
            : "var(--primary-color)";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              aria-hidden
              style={{
                minWidth: 8,
                height: 8,
                borderRadius: 999,
                background: sevColor,
                display: "inline-block",
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                minWidth: 0,
              }}
            >
              <span
                title={row.name_alarm || ""}
                style={{
                  fontWeight: 600,
                  color: tPrimary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.name_alarm || "—"}
              </span>
              {row.message && (
                <span
                  title={row.message}
                  style={{
                    fontSize: 12,
                    color: tSecondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.message}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "code_alarm",
      header: "Codice Log",
      type: "custom",
      width: "160px",
      sortable: true,
      render: (_v, row) => (
        <span
          style={{
            padding: "2px 6px",
            borderRadius: 4,
            fontSize: 12,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: tSecondary,
          }}
        >
          {row.code_alarm || "—"}
        </span>
      ),
    },
    {
      key: "machine_ip",
      header: "IP",
      type: "custom",
      width: "160px",
      sortable: true,
      render: (_v, row) => <span>{row.machine_ip || "—"}</span>,
    },
    {
      key: "customer_Name",
      header: "Cliente",
      type: "custom",
      width: "160px",
      sortable: true,
      render: (_v, row) => <span>{row.customer_Name || "—"}</span>,
    },
  ];

  if (options?.includeMachineDetail) {
    cols.splice(4, 0, {
      key: "machine_detail",
      header: "Matricola Macchina",
      type: "custom",
      width: "220px",
      sortable: false,
      render: (_val, row: FlatLogRow) => {
        const detail = row?.machine_detail;
        if (!detail) {
          return (
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              N/D
            </span>
          );
        }
        const kgn = detail?.matricola_Kgn || detail?.matricola_kgn || "—";
        const bte = detail?.matricola_Bte || detail?.matricola_bte || "—";
        return (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 12 }}>KGN: {kgn}</span>
            <span style={{ fontSize: 12 }}>BTE: {bte}</span>
          </div>
        );
      },
    });
  }

  return cols;
};

export default getLogsColumns;
