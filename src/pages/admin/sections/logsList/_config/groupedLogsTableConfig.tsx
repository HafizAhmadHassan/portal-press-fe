import type { TableColumn } from "@components/shared/table/types/GenericTable.types";

// Types for grouped logs outer table
export interface NestedLogItem {
  id: number;
  name_alarm?: string;
  code_alarm?: string;
  date_and_time?: string;
  message?: string;
}

export interface NestedLogsMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
}

export interface MachineLogsGroup {
  info: {
    machine_ip: string;
    customer_Name: string;
  };
  logs: {
    meta: NestedLogsMeta;
    data: NestedLogItem[];
  };
}

/** Build columns for the outer grouped-by-machine table */
export const getGroupedLogsOuterColumns = (): Array<
  TableColumn<MachineLogsGroup>
> => {
  const tPrimary = "var(--text-primary)";
  const tSecondary = "var(--text-secondary)";
  return [
    {
      key: "machine_ip",
      header: "Macchina (IP)",
      type: "custom",
      sortable: true,
      width: "180px",
      render: (_v, row) => (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: 600 }}>
            {row?.info?.machine_ip || "N/D"}
          </span>
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
            Cliente: {row?.info?.customer_Name || "—"}
          </span>
        </div>
      ),
    },
    {
      key: "total_logs",
      header: "# Logs",
      type: "custom",
      sortable: true,
      width: "100px",
      render: (_v, row) => (
        <span style={{ fontWeight: 500 }}>{row?.logs?.meta?.total ?? 0}</span>
      ),
    },
    {
      key: "machine_detail",
      header: "Matricola Macchina",
      type: "custom",
      width: "220px",
      sortable: true,
      render: (_, row) => {
        return (
          <div>
            <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>
              BTE: {row.info.matricola_Bte || "N/A"}
            </div>
            <div style={{ fontSize: "14px", color: "var(--text-primary)" }}>
              KGN: {row.info.matricola_Kgn || "N/A"}
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
            {row.info.gps.address || "—"}
          </div>
          <div style={{ fontSize: 12, color: tSecondary }}>
            {row.info.gps.municipility || "—"}
          </div>
        </div>
      ),
    },
    {
      key: "last_event",
      header: "Ultimo evento",
      type: "custom",
      sortable: false,
      width: "200px",
      render: (_v, row) => {
        const latest = row?.logs?.data?.[0];
        if (!latest)
          return <span style={{ color: "var(--text-secondary)" }}>—</span>;
        const d = new Date(latest.date_and_time || 0);
        if (isNaN(d.getTime())) return <span>—</span>;
        return (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 12, color: "var(--text-primary)" }}>
              {d.toLocaleDateString("it-IT")}
            </span>
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {d.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        );
      },
    },
  ];
};

export default getGroupedLogsOuterColumns;
