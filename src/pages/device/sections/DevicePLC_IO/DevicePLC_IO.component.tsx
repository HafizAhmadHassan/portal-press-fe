import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import styles from "../_styles/DevicesPLC.module.scss";

import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";
import {
  useUpdatePlcMutation,
  useGetPlcIoQuery,
} from "@store_device/plc/plc.api";
import type { TableKeyValueObject } from "@root/components/shared/table-key-value/TableKeyValue2.component";
import TableKeyValue2 from "@root/components/shared/table-key-value/TableKeyValue2.component";
import { useSession } from "@root/pages/admin/core/store/auth/hooks/useSession";
import { UserRoles } from "@root/utils/constants/userRoles";

export default function DevicePLC_IO() {
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId?: string }>();
  const [searchParams] = useSearchParams();
  const { user } = useSession();
  const [rows, setRows] = useState<TableKeyValueObject>({});
  const [original, setOriginal] = useState<TableKeyValueObject>({});
  const [saving, setSaving] = useState(false);

  const isSuperAdmin = user?.role === UserRoles.SUPER_ADMIN;
  console.log("User role:", user?.role, "isSuperAdmin:", isSuperAdmin);
  const isEdit = searchParams.get("edit") === "1" && isSuperAdmin;
  console.log("isEdit:", isEdit);

  // RTK Query
  const currentId = deviceId ? Number(deviceId) : undefined;
  console.log("DevicePLC_IO: deviceId=", deviceId, "currentId=", currentId);

  const {
    data: plcIoResponse,
    isLoading: isLoadingPlcIo,
    error: errorPlcIo,
  } = useGetPlcIoQuery(currentId!, { skip: !currentId });

  useEffect(() => {
    if (isLoadingPlcIo) return;
    if (errorPlcIo) {
      console.error("[DevicePLC_IO] errore plc_io/:id →", errorPlcIo);
      setRows({});
      setOriginal({});
      return;
    }
    if (plcIoResponse) {
      // Transform PlcIo to TableKeyValueObject
      const tableRows: TableKeyValueObject = {};
      Object.entries(plcIoResponse.plc_io).forEach(([key, value]) => {
        if (
          value !== null &&
          typeof value === "object" &&
          "label" in value &&
          "value" in value &&
          "unit" in value &&
          typeof (value as any).label === "string"
        ) {
          tableRows[key] = value as {
            label: string;
            value: string | number | boolean;
            type?: "number" | "boolean" | "text" | "multiline" | "select";
            unit?: string;
            placeholder?: string;
            options?: { label: string; value: string }[];
            validate?: (v: number) => string;
          };
        }
      });
      setRows(tableRows);
      setOriginal(JSON.parse(JSON.stringify(tableRows)));
      console.log("[DevicePLC_IO] plc_io →", plcIoResponse, tableRows);
    }
  }, [plcIoResponse, isLoadingPlcIo, errorPlcIo]);

  const [updatePlc] = useUpdatePlcMutation();

  const dirty = useMemo(
    () => JSON.stringify(rows) !== JSON.stringify(original),
    [rows, original]
  );

  const saveAll = useCallback(
    async (updated: TableKeyValueObject) => {
      if (!currentId) return;
      setSaving(true);

      try {
        await updatePlc({
          id: currentId,
          data: { plc_io: updated },
        }).unwrap();

        setOriginal(JSON.parse(JSON.stringify(updated)));
        setRows(updated);
      } catch (error) {
        console.error("[DevicePLC_IO] saveAll error:", error);
      } finally {
        setSaving(false);
      }
    },
    [currentId, updatePlc]
  );

  const cancelAll = useCallback(() => {
    setRows(JSON.parse(JSON.stringify(original)));
  }, [original]);

  const saveRow = useCallback(
    async (rowKey: string, rowData: TableKeyValueObject[string]) => {
      if (!currentId) return;

      try {
        const updated = { ...rows, [rowKey]: rowData };

        await updatePlc({
          id: currentId,
          data: { plc_io: updated },
        }).unwrap();

        setOriginal((prev) => ({
          ...prev,
          [rowKey]: JSON.parse(JSON.stringify(rowData)),
        }));
      } catch (error) {
        console.error("[DevicePLC_IO] saveRow error:", error);
      }
    },
    [currentId, rows, updatePlc]
  );

  const cancelRow = useCallback(
    (rowKey: string) => {
      setRows((prev) => ({
        ...prev,
        [rowKey]: JSON.parse(JSON.stringify(original[rowKey])),
      }));
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
        <TableKeyValue2
          rows={rows}
          onChange={setRows}
          onSave={saveAll}
          onCancel={cancelAll}
          saving={saving}
          loading={isLoadingPlcIo}
          compact
          editable={isEdit}
          showActionsColumn
          allowHeaderEditToggle={false}
          onRowSave={saveRow}
          onRowCancel={cancelRow}
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
