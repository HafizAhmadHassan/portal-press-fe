import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  useLocation,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import styles from "./DevicePLC_IO.module.scss";

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

/** Converte un record plc_io in TableKeyValueRow[] */
function buildRowsFromPlcIo(
  plcIo: Record<string, any> | null | undefined
): TableKeyValueRow[] {
  if (!plcIo) return [];

  const rows: TableKeyValueRow[] = [];
  const entries = Object.entries(plcIo);

  // ID per primo (read-only)
  const idEntry = entries.find(([k]) => k === "id");
  if (idEntry) {
    const [, v] = idEntry;
    rows.push({
      id: Number(v ?? 0),
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
      let type: TableKeyValueRow["type"];
      if (typeof v === "boolean") type = "boolean";
      else if (typeof v === "number") type = "number";
      else type = "text"; // stringhe tipo "default_"

      rows.push({
        id: rows.length + 1,
        key: k,
        label,
        type,
        value: v,
        ...(type === "number" ? { step: 1 } : {}),
      });
    });

  return rows;
}

export default function DevicePLC_IO() {
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId?: string }>();
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

  // === FETCH plc/${id} e prendi SOLO plc_io ===
  const currentId = deviceId ? Number(deviceId) : undefined;
  const {
    data: plcDetail,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPlcByIdQuery(currentId, { skip: !currentId });

  const plcIo = plcDetail?.plc_io ?? null;

  // Inizializza/aggiorna righe quando cambia plc_io
  useEffect(() => {
    const busy = isLoading || isFetching;
    setLoading(busy);

    if (busy) return;

    if (error) {
      console.error("[DevicePLC_IO] errore plc/:id →", error);
      setRows([]);
      setOriginal([]);
      return;
    }

    const built = buildRowsFromPlcIo(plcIo);
    setRows(built);
    setOriginal(JSON.parse(JSON.stringify(built)));
  }, [plcIo, isLoading, isFetching, error]);

  const dirty = useMemo(
    () => JSON.stringify(rows) !== JSON.stringify(original),
    [rows, original]
  );

  const saveAll = useCallback(
    async (updated: TableKeyValueRow[]) => {
      setSaving(true);
      try {
        // TODO: collega mutation reale (PUT /plc/:id) mappando rows -> plc_io
        console.log("[DevicePLC_IO] saveAll payload:", updated);
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
      console.log("[DevicePLC_IO] saveRow:", { index, row });
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

  /* const notFound = !loading && (!plcIo || (rows.length === 0 && !error)); */

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
              ? "Nessun dato PLC (plc_io) trovato per questo device."
              : undefined
          } */
          footerActions={{
            show: editable, // se non vuoi doppioni con l'action bar sotto: metti false
            cancelLabel: "Annulla",
            saveLabel: "Salva",
            cancelDisabled: !dirty || saving,
            saveDisabled: !dirty || saving,
          }}
        />
      </div>

      {/* ACTION BAR STICKY (come nella pagina edit) */}
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
