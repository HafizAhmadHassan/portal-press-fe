import { useEffect, useMemo, useState, useCallback } from "react";
import {
  useLocation,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styles from "./DevicePLC_STATUS.module.scss";

import TableKeyValue, {
  type TableKeyValueRow,
} from "@components/shared/table-key-value/TableKeyValue.component";

import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";
import { useGetPlcByIdQuery } from "@store_device/plc/hooks/usePlcApi";

/** Util: da snake_case a label leggibile */
function humanizeKey(k: string) {
  return k
    .replace(/_/g, " ")
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(Plc|Io|Id)\b/gi, (m) => m.toUpperCase());
}

/** Rileva stringhe numeriche e le converte in number */
function toNumberIfNumericString(v: any): any {
  if (typeof v === "string" && /^\s*-?\d+(\.\d+)?\s*$/.test(v)) {
    const n = Number(v.trim());
    return Number.isFinite(n) ? n : v;
  }
  return v;
}

/** Converte un record plc_status in TableKeyValueRow[] */
function buildRowsFromPlcStatus(
  plcStatus: Record<string, any> | null | undefined
): TableKeyValueRow[] {
  if (!plcStatus) return [];

  const rows: TableKeyValueRow[] = [];
  const entries = Object.entries(plcStatus);

  // ID per primo (read-only)
  const idEntry = entries.find(([k]) => k === "id");
  if (idEntry) {
    const [, v] = idEntry;
    rows.push({
      id: "id",
      key: "id",
      label: "ID Dispositivo",
      type: "number",
      value: Number(v ?? 0),
      readOnly: true,
    });
  }

  // resto dei campi (ordinati alfabeticamente per label)
  const rest = entries.filter(([k]) => k !== "id");
  rest
    .map<[string, any, string]>(([k, v]) => [k, v, humanizeKey(k)])
    .sort((a, b) => a[2].localeCompare(b[2], "it"))
    .forEach(([k, v, label]) => {
      const normalized = toNumberIfNumericString(v);

      let type: TableKeyValueRow["type"];
      if (typeof normalized === "boolean") type = "boolean";
      else if (typeof normalized === "number") type = "number";
      else type = "text";

      const step =
        type === "number" && !Number.isInteger(normalized) ? 0.001 : 1;

      rows.push({
        id: k,
        key: k,
        label,
        type,
        value: normalized,
        ...(type === "number" ? { step } : {}),
      });
    });

  return rows;
}

export default function DevicePLC_STATUS() {
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId: string }>();
  const location = useLocation();
  const editable = useMemo(
    () => location.pathname.endsWith("/edit"),
    [location.pathname]
  );

  const [rows, setRows] = useState<TableKeyValueRow[]>([]);
  const [original, setOriginal] = useState<TableKeyValueRow[]>([]);
  const [, /* loading */ setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "1";

  // === FETCH plc/${id} e prendi SOLO plc_status ===
  const currentId = deviceId ?? "";
  const {
    data: plcDetail,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPlcByIdQuery(currentId, { skip: !currentId });

  const plcStatus = plcDetail?.plc_status ?? null;

  // Inizializza/aggiorna righe quando cambia plc_status
  useEffect(() => {
    const busy = isLoading || isFetching;
    setLoading(busy);

    if (busy) return;

    if (error) {
      console.error("[DevicePLC_STATUS] errore plc/:id →", error);
      setRows([]);
      setOriginal([]);
      return;
    }

    const built = buildRowsFromPlcStatus(plcStatus);
    setRows(built);
    setOriginal(JSON.parse(JSON.stringify(built)));
  }, [plcStatus, isLoading, isFetching, error]);

  const dirty = useMemo(
    () => JSON.stringify(rows) !== JSON.stringify(original),
    [rows, original]
  );

  const saveAll = useCallback(
    async (updated: TableKeyValueRow[]) => {
      setSaving(true);
      try {
        // TODO: collega mutation reale (PUT /plc/:id) mappando rows -> plc_status
        console.log("[DevicePLC_STATUS] saveAll payload:", updated);
        await new Promise((r) => setTimeout(r, 300));
        setOriginal(JSON.parse(JSON.stringify(updated)));
        setRows(updated);
        refetch(); // ricarica dal backend
      } finally {
        setSaving(false);
      }
    },
    [refetch]
  );

  const cancelAll = useCallback(() => {
    setRows(JSON.parse(JSON.stringify(original)));
  }, [original]);

  const saveRow = useCallback(
    async (row: TableKeyValueRow, index: number) => {
      // TODO: mutation row-level se disponibile
      console.log("[DevicePLC_STATUS] saveRow:", { index, row });
      await new Promise((r) => setTimeout(r, 150));
      setOriginal((prev) => {
        const copy = [...prev];
        copy[index] = JSON.parse(JSON.stringify(rows[index]));
        return copy;
      });
    },
    [rows]
  );

  const cancelRow = useCallback(
    (_row: TableKeyValueRow, index: number) => {
      setRows((prev) => {
        const copy = [...prev];
        copy[index] = JSON.parse(JSON.stringify(original[index]));
        return copy;
      });
    },
    [original]
  );

  /* const notFound = !loading && (!plcStatus || (rows.length === 0 && !error)); */

  return (
    <>
      <div className={styles.page}>
        <TableKeyValue
          rows={rows}
          onChange={setRows}
          onSave={saveAll}
          onCancel={cancelAll}
          saving={saving}
          // loading={loading}
          compact
          editable={isEdit}
          showActionsColumn
          allowHeaderEditToggle={false}
          onRowSave={saveRow}
          onRowCancel={cancelRow}
          /* emptyState={
            notFound
              ? "Nessun dato PLC (plc_status) trovato per questo device."
              : undefined
          } */
          footerActions={{
            show: editable,
            cancelLabel: "Annulla",
            saveLabel: "Salva",
            cancelDisabled: !dirty || saving,
            saveDisabled: !dirty || saving,
          }}
        />
      </div>

      {/* ACTION BAR STICKY */}
      <div className={styles.actionBar}>
        <SimpleButton
          size="sm"
          variant="ghost"
          color="secondary"
          onClick={() =>
            deviceId ? navigate(`/device/${deviceId}`) : navigate(-1)
          }
          disabled={saving}
        >
          Annulla
        </SimpleButton>
        <SimpleButton
          size="sm"
          color="primary"
          onClick={() => saveAll(rows)}
          // loading={saving}
          disabled={!dirty || saving}
        >
          Salva
        </SimpleButton>
      </div>
    </>
  );
}
