// DevicePLC_DATA.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styles from "../_styles/DevicesPLC.module.scss";

import TableKeyValue, {
  type TableKeyValueRow,
} from "@components/shared/table-key-value/TableKeyValue.component";
import type { PlcData } from "@store_device/plc/plc.types";

import {
  useGetPlcByIdQuery,
  useUpdatePlcMutation,
} from "@store_device/plc/plc.api";
import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";

/** Util: da snake_case a label leggibile */
function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b([a-z])/g, (m) => m.toUpperCase())
    .replace(/\b(Plc|Io|Id)\b/gi, (m) => m.toUpperCase());
}

/** Converte un record plc_data in TableKeyValueRow[] */
function buildRowsFromPlcData(
  plcData: PlcData | null | undefined
): TableKeyValueRow[] {
  if (!plcData) return [];

  const rows: TableKeyValueRow[] = [];
  const entries = Object.entries(plcData);

  // ID per primo, in sola lettura
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

  // Resto dei campi ordinati alfabeticamente per label
  const restEntries = entries.filter(([k]) => k !== "id");
  restEntries
    .map<[string, any, string]>(([k, v]) => [k, v, humanizeKey(k)])
    .sort((a, b) => a[2].localeCompare(b[2], "it"))
    .forEach(([key, value, label]) => {
      const isBool = typeof value === "number" && (value === 0 || value === 1);
      const type: TableKeyValueRow["type"] = isBool
        ? "boolean"
        : typeof value === "number"
        ? "number"
        : "text";

      rows.push({
        id: rows.length + 1,
        key,
        label,
        type,
        value: isBool ? Boolean(value) : value,
        ...(type === "number" ? { step: 1 } : {}),
      });
    });

  return rows;
}

/** Converte TableKeyValueRow[] di nuovo in PlcData */
function rowsToPlcData(rows: TableKeyValueRow[]): PlcData {
  const result: PlcData = { id: 0 };

  rows.forEach((row) => {
    if (row.key === "id") {
      result.id = Number(row.value);
    } else {
      // Riconverti boolean in number se necessario (0/1)
      if (row.type === "boolean") {
        result[row.key] = row.value ? 1 : 0;
      } else {
        result[row.key] = row.value;
      }
    }
  });

  return result;
}

export default function DevicePLC_DATA() {
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

  const plcData = plcDetail?.plc_data ?? null;

  // Inizializza/aggiorna righe quando cambiano i dati
  useEffect(() => {
    if (isLoading || isFetching) return;

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
      if (!currentId) return;

      setSaving(true);
      try {
        const updatedPlcData = rowsToPlcData(updated);

        await updatePlc({
          id: currentId,
          data: { plc_data: updatedPlcData },
        }).unwrap();

        setOriginal(JSON.parse(JSON.stringify(updated)));
        setRows(updated);
        refetch();
      } catch (error) {
        console.error("[DevicePLC_DATA] saveAll error:", error);
        // Qui potresti mostrare un toast di errore
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
        // Per il salvataggio singola riga, aggiorna solo quella riga
        const updatedRows = [...rows];
        updatedRows[index] = row;
        const updatedPlcData = rowsToPlcData(updatedRows);

        await updatePlc({
          id: currentId,
          data: { plc_data: updatedPlcData },
        }).unwrap();

        setOriginal((prev) => {
          const copy = [...prev];
          copy[index] = JSON.parse(JSON.stringify(row));
          return copy;
        });

        refetch();
      } catch (error) {
        console.error("[DevicePLC_DATA] saveRow error:", error);
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
              ? "Errore nel caricamento dei dati PLC."
              : !plcData || rows.length === 0
              ? "Nessun dato PLC (plc_data) trovato per questo device."
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
          disabled={!dirty || saving}
        >
          Salva
        </SimpleButton>
      </div>
    </>
  );
}
