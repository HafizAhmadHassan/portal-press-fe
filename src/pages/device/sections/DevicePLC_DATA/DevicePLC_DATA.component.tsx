import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  useLocation,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styles from "./DevicePLC_DATA.module.scss";

import TableKeyValue, {
  type TableKeyValueRow,
} from "@components/shared/table-key-value/TableKeyValue.component";

import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";

// RTK Query: dettaglio PLC /plc/:id
import { useGetPlcByIdQuery } from "@store_device/plc/hooks/usePlcApi";

/** Util: da snake_case a label leggibile */
function humanizeKey(k: string) {
  return k
    .replace(/_/g, " ")
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(Plc|Io|Id)\b/gi, (m) => m.toUpperCase());
}

/** Converte un record plc_data in TableKeyValueRow[] */
function buildRowsFromPlcData(
  plcData: Record<string, any> | null | undefined
): TableKeyValueRow[] {
  if (!plcData) return [];

  const rows: TableKeyValueRow[] = [];
  const entries = Object.entries(plcData);

  // ID per primo, in sola lettura
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

  // Tutto il resto in ordine alfabetico per label
  const rest = entries.filter(([k]) => k !== "id");
  rest
    .map<[string, any, string]>(([k, v]) => [k, v, humanizeKey(k)])
    .sort((a, b) => a[2].localeCompare(b[2], "it"))
    .forEach(([k, v, label]) => {
      const isBool = typeof v === "number" && (v === 0 || v === 1);
      const type: TableKeyValueRow["type"] = isBool
        ? "boolean"
        : typeof v === "number"
        ? "number"
        : "text";

      rows.push({
        id: k,
        key: k,
        label,
        type,
        value: isBool ? Boolean(v) : v,
        ...(type === "number" ? { step: 1 } : {}),
      });
    });

  return rows;
}

export default function DevicePLC_DATA() {
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

  // === FETCH plc/${id} e prendi SOLO plc_data ===
  const currentId = deviceId ?? "";
  const {
    data: plcDetail,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPlcByIdQuery(currentId, { skip: !currentId });

  const plcData = plcDetail?.plc_data ?? null;

  // Inizializza/aggiorna righe quando cambia plc_data
  useEffect(() => {
    const busy = isLoading || isFetching;
    setLoading(busy);

    if (busy) return;

    if (error) {
      console.error("[DevicePLC_DATA] errore plc/:id →", error);
      setRows([]);
      setOriginal([]);
      return;
    }

    const built = buildRowsFromPlcData(plcData);
    setRows(built);
    setOriginal(JSON.parse(JSON.stringify(built)));
  }, [plcData, isLoading, isFetching, error]);

  const dirty = useMemo(
    () => JSON.stringify(rows) !== JSON.stringify(original),
    [rows, original]
  );

  const saveAll = useCallback(
    async (updated: TableKeyValueRow[]) => {
      setSaving(true);
      try {
        // TODO: collega mutation reale (PUT /plc/:id) con payload mappato da rows -> plc_data
        console.log("[DevicePLC_DATA] saveAll payload:", updated);
        await new Promise((r) => setTimeout(r, 300));
        setOriginal(JSON.parse(JSON.stringify(updated)));
        setRows(updated);
        refetch(); // ricarica i dati dal backend
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
      console.log("[DevicePLC_DATA] saveRow:", { index, row });
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

  /* const notFound = !loading && (!plcData || (rows.length === 0 && !error)); */

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
          /*  emptyState={
            notFound
              ? "Nessun dato PLC (plc_data) trovato per questo device."
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
