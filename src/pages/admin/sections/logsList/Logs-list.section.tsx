import React, { useMemo, useState, useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { RefreshCw, Download } from "lucide-react";
import styles from "./_styles/Logs-list.module.scss";
import { getGroupedLogsOuterColumns } from "./_config/groupedLogsTableConfig";
import type { MachineLogsGroup } from "./_config/groupedLogsTableConfig";
import { getLogsColumns } from "./_config/logsTableConfig";
import { Divider } from "@shared/divider/Divider.component";
import logsListHeaderBtns from "./_config/logsListHeaderBtns";
import {
  useGetGroupedMachineLogsQuery,
  useGetMachineLogsQuery,
  useGetLogsQuery,
} from "../../core/store/logs/logs.api";
import type { LogItem, ApiMeta } from "../../core/store/logs/logs.types";
import { useListController } from "@root/hooks/useListController";
import { LogsFields } from "@root/utils/constants/logsFields.constants";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
// import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component"; // filters UI temporarily disabilitato

// Tipi spostati in groupedLogsTableConfig.tsx

type LogsViewMode = "grouped" | "flat";

export const LogsListSections: React.FC = () => {
  const [viewMode, setViewMode] = useState<LogsViewMode>("flat");
  const [flatMeta, setFlatMeta] = useState<ApiMeta | undefined>(undefined);
  const { meta, isLoading, refetch, buildTableConfig } = useListController<
    Record<string, string>,
    MachineLogsGroup
  >({
    listHook: useGetGroupedMachineLogsQuery,
    initialFilters: {
      [LogsFields.MACHINE_IP]: "",
      [LogsFields.CODE_ALARM]: "",
      [LogsFields.NAME_ALARM]: "",
      [LogsFields.DATE_FROM]: "",
      [LogsFields.DATE_TO]: "",
      [LogsFields.SEARCH]: "",
    },
    initialSort: { sortBy: "date_and_time", sortOrder: "desc" },
  });

  const onExportClick = () => console.log("Esporta logs");
  const onRefreshClick = () => refetch();

  /**
   * OUTER TABLE (aggregated by macchina)
   * Each item shape (from API example):
   * {
   *   info: { machine_ip: string; customer_Name: string },
   *   logs: { meta: {...}; data: Array< { id, name_alarm, code_alarm, date_and_time } > }
   * }
   */

  const outerColumns = useMemo(() => getGroupedLogsOuterColumns(), []);

  // Build outer table config + collapsible nested logs
  const tableConfig = useMemo(() => {
    const base = buildTableConfig(outerColumns, {
      // disabilita sorting generico se necessario mantenendo per machine_ip e total_logs
      sorting: {
        enabled: true,
        defaultSort: { key: "machine_ip", direction: "asc" },
      },
    });

    return {
      ...base,
      // Assicuriamo che la paginazione esterna resti abilitata se meta presente
      pagination: base.pagination
        ? { ...base.pagination, enabled: true }
        : undefined,
      /**
       * Collapsible: we use machine_ip as row key. By default we want rows COLLAPSED.
       * Current GenericTable logic treats keys in Set as collapsed => we inject all keys once (first mount).
       * For simplicity we compute them from data here; GenericTable initialiser runs only on first mount.
       * If data changes drastically, a manual remount (key prop) may be needed for a fresh collapsed state.
       */
      collapsible: {
        enabled: true,
        getRowKey: (item: MachineLogsGroup) =>
          item?.info?.machine_ip || Math.random(),
        // Nessuna initialCollapsedKeys => tutte le righe partono ESPANSE
        initialCollapsedKeys: [],
        exclusive: false,
        expandLabel: "Espandi logs macchina",
        collapseLabel: "Comprimi logs macchina",
        renderExpanded: (row: MachineLogsGroup) => (
          <NestedMachineLogs
            machineIp={row.info.machine_ip}
            initialPageData={row.logs}
          />
        ),
      },
    };
  }, [buildTableConfig, outerColumns]);

  // const filtersConfig = useMemo(
  //   () =>
  //     createLogsFilterConfig({
  //       filters,
  //       setFilter,
  //     }),
  //   [filters, setFilter]
  // );

  const toggleBtn = {
    component: (
      <div
        style={{
          display: "inline-flex",
          border: "1px solid var(--border-color)",
          borderRadius: 6,
          overflow: "hidden",
          background: "var(--bg-secondary)",
        }}
      >
        <button
          type="button"
          onClick={() => setViewMode("flat")}
          style={{
            padding: "6px 14px",
            fontSize: 12,
            cursor: viewMode === "flat" ? "default" : "pointer",
            background:
              viewMode === "flat" ? "var(--primary-color)" : "transparent",
            color: viewMode === "flat" ? "#fff" : "var(--text-primary)",
            fontWeight: 600,
            border: "none",
            outline: "none",
            position: "relative",
            transition: "background .15s, color .15s",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          aria-pressed={viewMode === "flat"}
          title="Vista piatta (tabella semplice)"
          disabled={viewMode === "flat"}
        >
          <span style={{ opacity: viewMode === "flat" ? 1 : 0.65 }}>
            Piatta
          </span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode("grouped")}
          style={{
            padding: "6px 14px",
            fontSize: 12,
            cursor: viewMode === "grouped" ? "default" : "pointer",
            background:
              viewMode === "grouped" ? "var(--primary-color)" : "transparent",
            color: viewMode === "grouped" ? "#fff" : "var(--text-primary)",
            fontWeight: 600,
            border: "none",
            outline: "none",
            position: "relative",
            transition: "background .15s, color .15s",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          aria-pressed={viewMode === "grouped"}
          title="Vista raggruppata per macchina"
          disabled={viewMode === "grouped"}
        >
          <span style={{ opacity: viewMode === "grouped" ? 1 : 0.65 }}>
            Raggruppata
          </span>
        </button>
      </div>
    ),
  } as const;

  return (
    <div className={styles["logs-list-page"]}>
      <SectionHeaderComponent
        title="Logs"
        subTitle={`Eventi di sistema (${
          viewMode === "flat" ? flatMeta?.total ?? 0 : meta?.total ?? 0
        } totali)`}
        buttons={[
          ...logsListHeaderBtns(
            onRefreshClick,
            RefreshCw,
            isLoading,
            onExportClick,
            Download
          ),
          toggleBtn,
        ]}
      />

      {/* <div className={styles["logs-list-page__filters"]}>
        <SectionFilterComponent
          isLoading={isLoading}
          filters={filtersConfig}
          onResetFilters={resetAll}
        />
      </div> */}

      <Divider />

      <div className={styles["logs-list-page__table-wrapper"]}>
        {viewMode === "grouped" ? (
          <GenericTableWithLogic
            key={`grouped-logs-${tableConfig.data.length}`}
            config={tableConfig}
          />
        ) : (
          <FlatLogsView onMeta={setFlatMeta} />
        )}
      </div>
    </div>
  );
};

// -----------------------------
// Flat logs view component (usa endpoint /logs normale)
// -----------------------------
const FlatLogsView: React.FC<{ onMeta?: (m: ApiMeta | undefined) => void }> = ({
  onMeta,
}) => {
  const { meta, isLoading, refetch, buildTableConfig } = useListController<
    Record<string, string>,
    LogItem
  >({
    listHook: useGetLogsQuery,
    initialFilters: {},
    initialSort: { sortBy: "date_and_time", sortOrder: "desc" },
  });

  useEffect(() => {
    onMeta?.(meta);
  }, [meta, onMeta]);

  const columns = useMemo(() => getLogsColumns(), []);

  const config = useMemo(() => {
    return buildTableConfig(columns, {
      sorting: {
        enabled: true,
        defaultSort: { key: "date_and_time", direction: "desc" },
      },
    });
  }, [buildTableConfig, columns]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <GenericTableWithLogic
        key={`flat-logs-${config.data.length}`}
        config={config}
      />
      {isLoading && (
        <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          Caricamento logs…
        </span>
      )}
      {meta && (
        <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
          Pagina {meta.page}/{meta.total_pages} • Totale {meta.total}
        </span>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => refetch()}
          style={{ fontSize: 11, padding: "4px 8px", cursor: "pointer" }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

// -----------------------------
// Component: Nested paginated logs per macchina
// -----------------------------
interface NestedMachineLogsProps {
  machineIp: string;
  initialPageData: MachineLogsGroup["logs"];
}

const NestedMachineLogs: React.FC<NestedMachineLogsProps> = ({
  machineIp,
  initialPageData,
}) => {
  const hasMeta = Boolean(initialPageData?.meta);
  const initialMeta = initialPageData.meta;
  const [page, setPage] = useState(hasMeta ? initialMeta.page : 1);
  const pageSize = hasMeta
    ? initialMeta.page_size
    : initialPageData.data.length;
  const [sortBy, setSortBy] = useState<string>("date_and_time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const toggleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      // toggle direction only
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // switch column and start from asc
      setSortBy(columnKey);
      setSortOrder("asc");
      if (hasMeta) setPage(1); // reset pagina solo cambio colonna
    }
  };

  // Se abbiamo meta, abilitiamo la paginazione lato server con endpoint per macchina
  const { data, isFetching } = useGetMachineLogsQuery(
    hasMeta && page > 1
      ? {
          machine_ip: machineIp,
          page,
          page_size: pageSize,
          sortBy,
          sortOrder,
        }
      : skipToken
  );

  const effective = hasMeta ? data ?? initialPageData : initialPageData;
  const rows = React.useMemo(() => {
    const base = effective.data || [];
    type RowShape = {
      id: string | number;
      code_alarm?: string;
      date_and_time?: string;
      name_alarm?: string;
      message?: string;
    };
    const normalized: RowShape[] = base as RowShape[];
    const dir = sortOrder === "asc" ? 1 : -1;
    return [...normalized].sort((a, b) => {
      if (sortBy === "code_alarm") {
        return (
          String(a.code_alarm || "").localeCompare(String(b.code_alarm || "")) *
          dir
        );
      }
      const da = new Date(a.date_and_time || 0).getTime();
      const db = new Date(b.date_and_time || 0).getTime();
      return (da - db) * dir;
    });
  }, [effective.data, sortBy, sortOrder]);
  const meta = hasMeta ? effective.meta : undefined;

  const goToPage = (p: number) => {
    if (!meta) return;
    if (p < 1 || p === page || p > meta.total_pages) return;
    setPage(p);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div></div>
        {/*   <strong>
          Logs macchina {machineIp}
          {meta
            ? ` (pagina ${meta.page}/${meta.total_pages}, tot: ${meta.total})`
            : ` (${rows.length})`}
        </strong> */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            onClick={() => {
              setSortBy("date_and_time");
              setSortOrder("desc");
              if (hasMeta) setPage(1);
            }}
            style={{ fontSize: 11, padding: "2px 6px", cursor: "pointer" }}
            title="Reset ordinamento (Data/Ora discendente)"
          >
            Reset
          </button>
          {isFetching && (
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              Caricamento…
            </span>
          )}
        </div>
      </div>
      {rows.length === 0 ? (
        <em style={{ fontSize: 12, color: "var(--text-secondary)" }}>
          Nessun log
        </em>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              tableLayout: "fixed",
            }}
          >
            <thead>
              <tr style={{ textAlign: "left" }}>
                <th
                  style={{
                    padding: "4px 6px",
                    fontSize: 12,
                    cursor: "pointer",
                    userSelect: "none",
                    width: 160,
                  }}
                  onClick={() => toggleSort("date_and_time")}
                  title="Ordina per Data/Ora"
                >
                  Data/Ora{" "}
                  {sortBy === "date_and_time"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </th>
                <th
                  style={{
                    padding: "4px 6px",
                    fontSize: 12,
                    cursor: "pointer",
                    userSelect: "none",
                    width: 110,
                  }}
                  onClick={() => toggleSort("code_alarm")}
                  title="Ordina per Codice"
                >
                  Codice{" "}
                  {sortBy === "code_alarm"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </th>
                <th style={{ padding: "4px 6px", fontSize: 12, width: "auto" }}>
                  Messaggio
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((log) => {
                const d = new Date(log.date_and_time);
                return (
                  <tr
                    key={log.id}
                    style={{ borderTop: "1px solid var(--border-color)" }}
                  >
                    <td
                      style={{
                        padding: "4px 6px",
                        fontSize: 12,
                        whiteSpace: "nowrap",
                        width: 160,
                      }}
                    >
                      {isNaN(d.getTime())
                        ? "—"
                        : `${d.toLocaleDateString(
                            "it-IT"
                          )} ${d.toLocaleTimeString("it-IT", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}`}
                    </td>
                    <td
                      style={{ padding: "4px 6px", fontSize: 12, width: 110 }}
                    >
                      <span
                        style={{
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: "var(--bg-secondary)",
                          border: "1px solid var(--border-color)",
                          fontFamily: "monospace",
                          display: "inline-block",
                          width: "100%",
                          boxSizing: "border-box",
                          textAlign: "center",
                        }}
                      >
                        {log.code_alarm || "—"}
                      </span>
                    </td>
                    <td style={{ padding: "4px 6px", fontSize: 12 }}>
                      {log.name_alarm || log.message || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {meta && (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {meta.total_pages > 1 ? (
            <>
              <button
                type="button"
                disabled={meta.page <= 1}
                onClick={() => goToPage(meta.page - 1)}
                style={{ fontSize: 12 }}
              >
                « Prev
              </button>
              <span style={{ fontSize: 12 }}>
                Pagina {meta.page} / {meta.total_pages} (page size{" "}
                {meta.page_size})
              </span>
              <button
                type="button"
                disabled={!meta.has_next}
                onClick={() => goToPage(meta.next_page || meta.page + 1)}
                style={{ fontSize: 12 }}
              >
                Next »
              </button>
            </>
          ) : (
            <span style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              Tutti i {meta.total} log in una sola pagina
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LogsListSections;
