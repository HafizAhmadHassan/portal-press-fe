// DevicePLC_IO.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styles from "../_styles/DevicesPLC.module.scss";

import TableKeyValue, {
  type TableKeyValueRow,
} from "@components/shared/table-key-value/TableKeyValue.component";
import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";
import { useGetByIdQuery, useUpdateMutation } from "@store_device/plc/plc.api";
import {
  objectToTableRows,
  tableRowsToObject,
} from "@store_device/plc/plc.utils.ts";

export default function DevicePLC_IO() {
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
  } = useGetByIdQuery(currentId!, { skip: !currentId });

  const [updatePlc] = useUpdateMutation();

  const plcIo = plcDetail?.plc_io ?? null;

  // Inizializza righe quando cambiano i dati
  useEffect(() => {
    if (isLoading || isFetching) return;

    if (error) {
      console.error("[DevicePLC_IO] errore plc/:id →", error);
      setRows([]);
      setOriginal([]);
      return;
    }

    const built = objectToTableRows(plcIo);
    setRows(built);
    setOriginal(JSON.parse(JSON.stringify(built)));
  }, [plcIo, isLoading, isFetching, error]);

  const dirty = useMemo(
    () => JSON.stringify(rows) !== JSON.stringify(original),
    [rows, original]
  );

  const saveAll = useCallback(
    async (updated: TableKeyValueRow[]) => {
      if (!currentId) return;

      setSaving(true);
      try {
        const updatedPlcIo = tableRowsToObject(updated);

        await updatePlc({
          id: currentId,
          data: { plc_io: updatedPlcIo },
        }).unwrap();

        setOriginal(JSON.parse(JSON.stringify(updated)));
        setRows(updated);
        refetch();
      } catch (error) {
        console.error("[DevicePLC_IO] saveAll error:", error);
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
        const updatedPlcIo = tableRowsToObject(updatedRows);

        await updatePlc({
          id: currentId,
          data: { plc_io: updatedPlcIo },
        }).unwrap();

        setOriginal((prev) => {
          const copy = [...prev];
          copy[index] = JSON.parse(JSON.stringify(row));
          return copy;
        });

        refetch();
      } catch (error) {
        console.error("[DevicePLC_IO] saveRow error:", error);
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
              ? "Errore nel caricamento dei dati PLC I/O."
              : !plcIo || rows.length === 0
              ? "Nessun dato PLC (plc_io) trovato per questo device."
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
