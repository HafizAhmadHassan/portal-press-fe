// DevicePLC_STATUS.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styles from "../_styles/DevicesPLC.module.scss";

import TableKeyValue, {
  type TableKeyValueRow,
} from "@components/shared/table-key-value/TableKeyValue.component";

// ✅ usa gli hook re-exportati dal tuo store PLC
import { useGetByIdQuery, useUpdateMutation } from "@store_device/plc";

import { tableRowsToObject } from "@store_device/plc/plc.utils";
import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";

/** Converte stringhe numeriche in number (se possibile) */
function toNumberIfNumericString(value: any): any {
  if (typeof value === "string" && /^\s*-?\d+(\.\d+)?\s*$/.test(value)) {
    const num = Number(value.trim());
    return Number.isFinite(num) ? num : value;
  }
  return value;
}

/** Normalizza label (snake_case → "Snake Case", acronimi comuni in maiuscolo) */
function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(Plc|Io|Id|Cpu|Ram|Wifi)\b/gi, (m) => m.toUpperCase());
}

/** Costruisce le righe per TableKeyValue a partire da plc_status */
function buildRowsFromPlcStatus(
  plcStatus: Record<string, any> | null | undefined
): TableKeyValueRow[] {
  if (!plcStatus) return [];

  const rows: TableKeyValueRow[] = [];
  let rowId = 1;

  // ID in testa (read-only) se presente
  if (plcStatus.id !== undefined) {
    rows.push({
      id: rowId++,
      key: "id",
      label: "ID Dispositivo",
      type: "number",
      value: Number(plcStatus.id ?? 0),
      readOnly: true,
    });
  }

  // Resto dei campi
  Object.entries(plcStatus)
    .filter(([k]) => k !== "id")
    .map<[string, any, string]>(([k, v]) => [
      k,
      toNumberIfNumericString(v),
      humanizeKey(k),
    ])
    .sort((a, b) => a[2].localeCompare(b[2], "it"))
    .forEach(([key, value, label]) => {
      let type: TableKeyValueRow["type"];
      if (typeof value === "boolean") type = "boolean";
      else if (typeof value === "number") type = "number";
      else type = "text";

      const step = type === "number" && !Number.isInteger(value) ? 0.001 : 1;

      rows.push({
        id: rowId++,
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

  const deviceIdNum = deviceId ? Number(deviceId) : undefined;

  const [rows, setRows] = useState<TableKeyValueRow[]>([]);
  const [original, setOriginal] = useState<TableKeyValueRow[]>([]);
  const [saving, setSaving] = useState(false);

  // ✅ Hook corretti
  const {
    data: plcDetail,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetByIdQuery(deviceIdNum as number, {
    skip: !deviceIdNum,
  });

  const [updatePlc] = useUpdateMutation();

  const plcStatus = plcDetail?.plc_status ?? null;

  // Inizializza righe quando arrivano i dati
  useEffect(() => {
    if (!deviceIdNum || isLoading || isFetching) return;

    if (error) {
      console.error("[DevicePLC_STATUS] errore plc/:id →", error);
      setRows([]);
      setOriginal([]);
      return;
    }

    const built = buildRowsFromPlcStatus(plcStatus);
    setRows(built);
    setOriginal(JSON.parse(JSON.stringify(built)));
  }, [deviceIdNum, plcStatus, isLoading, isFetching, error]);

  const dirty = useMemo(
    () => JSON.stringify(rows) !== JSON.stringify(original),
    [rows, original]
  );

  const saveAll = useCallback(
    async (updated: TableKeyValueRow[]) => {
      if (!deviceIdNum) return;

      setSaving(true);
      try {
        const updatedPlcStatus = tableRowsToObject(updated);

        await updatePlc({
          id: deviceIdNum,
          data: { plc_status: updatedPlcStatus },
        }).unwrap();

        setOriginal(JSON.parse(JSON.stringify(updated)));
        setRows(updated);
        refetch();
      } catch (err) {
        console.error("[DevicePLC_STATUS] saveAll error:", err);
      } finally {
        setSaving(false);
      }
    },
    [deviceIdNum, updatePlc, refetch]
  );

  const cancelAll = useCallback(() => {
    setRows(JSON.parse(JSON.stringify(original)));
  }, [original]);

  const saveRow = useCallback(
    async (row: TableKeyValueRow, index: number) => {
      if (!deviceIdNum) return;
      try {
        const updatedRows = [...rows];
        updatedRows[index] = row;

        const updatedPlcStatus = tableRowsToObject(updatedRows);

        await updatePlc({
          id: deviceIdNum,
          data: { plc_status: updatedPlcStatus },
        }).unwrap();

        // aggiorna l'originale solo per quella riga
        setOriginal((prev) => {
          const copy = [...prev];
          copy[index] = JSON.parse(JSON.stringify(row));
          return copy;
        });

        refetch();
      } catch (err) {
        console.error("[DevicePLC_STATUS] saveRow error:", err);
      }
    },
    [deviceIdNum, rows, updatePlc, refetch]
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

  if (!deviceIdNum) {
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

      {isEdit && (
        <div className={styles.actionBar}>
          <SimpleButton
            size="sm"
            variant="ghost"
            color="secondary"
            onClick={() =>
              deviceIdNum ? navigate(`/device/${deviceIdNum}`) : navigate(-1)
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
      )}
    </>
  );
}
