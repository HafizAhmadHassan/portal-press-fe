// DevicePLC_STATUS.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styles from "../_styles/DevicesPLC.module.scss";

import TableKeyValue, {
  type TableKeyValueRow,
} from "@components/shared/table-key-value/TableKeyValue.component";

import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";
import {
  useGetPlcByIdQuery,
  useUpdatePlcMutation,
} from "@store_device/plc/plc.api";
import {
  objectToTableRows,
  tableRowsToObject,
} from "@store_device/plc/plc.utils";

/** Rileva stringhe numeriche e le converte in number */
function toNumberIfNumericString(value: any): any {
  if (typeof value === "string" && /^\s*-?\d+(\.\d+)?\s*$/.test(value)) {
    const num = Number(value.trim());
    return Number.isFinite(num) ? num : value;
  }
  return value;
}

/** Converte un record plc_status in TableKeyValueRow[] con logica specifica per status */
function buildRowsFromPlcStatus(
  plcStatus: Record<string, any> | null | undefined
): TableKeyValueRow[] {
  if (!plcStatus) return [];

  const rows: TableKeyValueRow[] = [];
  const entries = Object.entries(plcStatus);

  // ID per primo (read-only)
  const idEntry = entries.find(([k]) => k === "id");
  if (idEntry) {
    const [, value] = idEntry;
    rows.push({
      id: Number(value ?? 0),
      key: "id",
      label: "ID Dispositivo",
      type: "number",
      value: Number(value ?? 0),
      readOnly: true,
    });
  }

  // Resto dei campi con normalizzazione numerica
  const restEntries = entries.filter(([k]) => k !== "id");
  restEntries
    .map<[string, any, string]>(([k, v]) => [
      k,
      toNumberIfNumericString(v),
      k
        .replace(/_/g, " ")
        .replace(/\b([a-z])/g, (m) => m.toUpperCase())
        .replace(/\b(Plc|Io|Id)\b/gi, (m) => m.toUpperCase()),
    ])
    .sort((a, b) => a[2].localeCompare(b[2], "it"))
    .forEach(([key, value, label]) => {
      let type: TableKeyValueRow["type"];
      if (typeof value === "boolean") {
        type = "boolean";
      } else if (typeof value === "number") {
        type = "number";
      } else {
        type = "text";
      }

      const step = type === "number" && !Number.isInteger(value) ? 0.001 : 1;

      rows.push({
        id: rows.length + 1,
        key,
        label,
        type,
        value,
        ...(type === "number" ? { step } : {}),
      });
    });

  return rows;
}

export default function DevicePLC_STATUS() {
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId?: string }>();
  const [searchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "1";

  const [rows, setRows] = useState<TableKeyValueRow[]>([]);
  const [original, setOriginal] = useState<TableKeyValueRow[]>([]);
  const [saving, setSaving] = useState(false);

  // RTK Query hooks
  const currentId = deviceId ? Number(deviceId) : undefined;
  const {
    data: plcDetail,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetPlcByIdQuery(currentId!, { skip: !currentId });

  const [updatePlc] = useUpdatePlcMutation();

  const plcStatus = plcDetail?.plc_status ?? null;

  // Inizializza righe quando cambiano i dati
  useEffect(() => {
    if (isLoading || isFetching) return;

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
      if (!currentId) return;

      setSaving(true);
      try {
        const updatedPlcStatus = tableRowsToObject(updated);

        await updatePlc({
          id: currentId,
          data: { plc_status: updatedPlcStatus },
        }).unwrap();

        setOriginal(JSON.parse(JSON.stringify(updated)));
        setRows(updated);
        refetch();
      } catch (error) {
        console.error("[DevicePLC_STATUS] saveAll error:", error);
      } finally {
        setSaving(false);
      }
    },
    [currentId, updatePlc, refetch]
  );

  const cancelAll = useCallback(() => {
    setRows(JSON.parse(JSON.stringify(original)));
  }, [original]);

  const saveRow = useCallback(
    async (row: TableKeyValueRow, index: number) => {
      if (!currentId) return;

      try {
        const updatedRows = [...rows];
        updatedRows[index] = row;
        const updatedPlcStatus = tableRowsToObject(updatedRows);

        await updatePlc({
          id: currentId,
          data: { plc_status: updatedPlcStatus },
        }).unwrap();

        setOriginal((prev) => {
          const copy = [...prev];
          copy[index] = JSON.parse(JSON.stringify(row));
          return copy;
        });

        refetch();
      } catch (error) {
        console.error("[DevicePLC_STATUS] saveRow error:", error);
      }
    },
    [currentId, rows, updatePlc, refetch]
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

  if (!deviceId) {
    return (
      <div className={styles.page}>
        <div>Nessun device ID specificato.</div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.page}>
        <TableKeyValue
          rows={rows}
          onChange={setRows}
          onSave={saveAll}
          onCancel={cancelAll}
          saving={saving}
          loading={isLoading || isFetching}
          compact
          editable={isEdit}
          showActionsColumn
          allowHeaderEditToggle={false}
          onRowSave={saveRow}
          onRowCancel={cancelRow}
          emptyState={
            error
              ? "Errore nel caricamento dei dati PLC Status."
              : !plcStatus || rows.length === 0
              ? "Nessun dato PLC (plc_status) trovato per questo device."
              : undefined
          }
          footerActions={{
            show: isEdit,
            cancelLabel: "Annulla",
            saveLabel: "Salva",
            cancelDisabled: !dirty || saving,
            saveDisabled: !dirty || saving,
          }}
        />
      </div>

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
          disabled={!dirty || saving}
        >
          Salva
        </SimpleButton>
      </div>
    </>
  );
}
