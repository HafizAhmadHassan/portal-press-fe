import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import styles from "./DevicePLC_IO.module.scss";

import TableKeyValue, {
  type TableKeyValueRow,
} from "@components/shared/table-key-value/TableKeyValue.component";

import { Database } from "lucide-react";
import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";

export default function DevicePLC_IO() {
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId: string }>();
  const location = useLocation();
  const editable = useMemo(
    () => location.pathname.endsWith("/edit"),
    [location.pathname]
  );

  const [rows, setRows] = useState<TableKeyValueRow[]>([]);
  const [original, setOriginal] = useState<TableKeyValueRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    const mock: TableKeyValueRow[] = [
      {
        id: "id",
        key: "id",
        label: "ID Dispositivo",
        type: "number",
        value: Number(deviceId || 0),
        readOnly: true,
      },
      {
        id: "em_nok",
        key: "emergenza_nok",
        label: "Emergenza NOK",
        type: "number",
        value: 0,
        min: 0,
        max: 1,
      },
      {
        id: "err_hmi",
        key: "err_hmi",
        label: "Errore comunicazione con HMI",
        type: "number",
        value: 0,
        min: 0,
        max: 1,
      },
      {
        id: "a_peso",
        key: "an_peso_err",
        label: "Analogica Peso in errore",
        type: "boolean",
        value: false,
      },
      {
        id: "a_press",
        key: "an_press_err",
        label: "Analogica Pressione in errore",
        type: "boolean",
        value: false,
      },
      {
        id: "tout",
        key: "timeout_comm",
        label: "Timeout comunicazione",
        type: "number",
        value: 0,
        min: 0,
        max: 1,
      },
      {
        id: "press",
        key: "press_bar",
        label: "Pressione",
        type: "number",
        value: 0,
        step: 0.01,
        unit: "bar",
        validate: (v) => (v < 0 ? "Non può essere negativo" : undefined),
      },
      {
        id: "mode",
        key: "mode",
        label: "Modalità",
        type: "select",
        value: "auto",
        options: [
          { label: "Automatico", value: "auto" },
          { label: "Manuale", value: "man" },
        ],
      },
      {
        id: "note",
        key: "note",
        label: "Note",
        type: "multiline",
        value: "",
        placeholder: "Annotazioni…",
      },
    ];

    const t = setTimeout(() => {
      setRows(mock);
      setOriginal(JSON.parse(JSON.stringify(mock)));
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [deviceId]);

  const dirty = useMemo(
    () => JSON.stringify(rows) !== JSON.stringify(original),
    [rows, original]
  );

  const saveAll = useCallback(async (updated: TableKeyValueRow[]) => {
    setSaving(true);
    try {
      // TODO: mutation reale
      await new Promise((r) => setTimeout(r, 600));
      setOriginal(JSON.parse(JSON.stringify(updated)));
      setRows(updated);
    } finally {
      setSaving(false);
    }
  }, []);

  const cancelAll = useCallback(() => {
    setRows(JSON.parse(JSON.stringify(original)));
  }, [original]);

  const saveRow = useCallback(
    async (_row: TableKeyValueRow, index: number) => {
      // TODO: mutation singola riga
      await new Promise((r) => setTimeout(r, 250));
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

  return (
    <>
      <div className={styles.page}>
        <TableKeyValue
          title={
            <div className={styles.sectionHeader}>
              <Database size={16} />
              <span>Registri e Flag</span>
            </div>
          }
          rows={rows}
          onChange={setRows}
          onSave={saveAll}
          onCancel={cancelAll}
          saving={saving}
          loading={loading}
          compact
          editable={editable}
          showActionsColumn
          allowHeaderEditToggle
          showRowEditSwitch
          rowSwitchCancelBehavior="revert"
          onRowSave={saveRow}
          onRowCancel={cancelRow}
          footerActions={{
            show: editable, // se non vuoi doppioni con l'action bar sotto: metti false
            cancelLabel: "Annulla",
            saveLabel: "Salva",
            cancelDisabled: !dirty || saving,
            saveDisabled: !dirty || saving,
          }}
        />

        {/* ACTION BAR STICKY (come nella pagina edit) */}
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
          loading={saving}
          disabled={!dirty || saving}
        >
          Salva
        </SimpleButton>
      </div>
    </>
  );
}
