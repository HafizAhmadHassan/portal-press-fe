import React, { useRef, useState } from "react";
import styles from "./TableKeyValue.module.scss";
import { Input } from "@components/shared/inputs/Input.component";
import Switch from "@root/components/shared/switch/Switch.component";
import { Check, Edit3, X } from "lucide-react";

/** === Row definition (riutilizzabile ovunque) === */
export type TableKeyValueRow =
  | {
      id: number;
      key: string;
      label: string;
      type: "boolean";
      value: boolean;
      readOnly?: boolean;
    }
  | {
      id: number;
      key: string;
      label: string;
      type: "number";
      value: number;
      min?: number;
      max?: number;
      step?: number;
      unit?: string;
      readOnly?: boolean;
      validate?: (v: number) => string | undefined;
    }
  | {
      id: number;
      key: string;
      label: string;
      type: "text";
      value: string;
      placeholder?: string;
      readOnly?: boolean;
    }
  | {
      id: number;
      key: string;
      label: string;
      type: "multiline";
      value: string;
      placeholder?: string;
      readOnly?: boolean;
    }
  | {
      id: number;
      key: string;
      label: string;
      type: "select";
      value: string;
      options: Array<{ label: string; value: string }>;
      readOnly?: boolean;
    };

/** === Component props === */
export type TableKeyValueProps = {
  title?: React.ReactNode;
  rows: TableKeyValueRow[];
  onChange: (rows: TableKeyValueRow[]) => void;
  onSave?: (rows: TableKeyValueRow[]) => void | Promise<void>;
  onCancel?: () => void;

  /** stati */
  loading?: boolean;
  saving?: boolean;

  /** layout */
  compact?: boolean;

  /** controllo globale: se false la colonna Valori è read-only (a meno di azione per-riga) */
  editable?: boolean;

  /** footer sticky */
  footerActions?: {
    show?: boolean;
    cancelLabel?: string;
    saveLabel?: string;
    cancelDisabled?: boolean;
    saveDisabled?: boolean;
  };

  /** nuova colonna azioni + controlli header */
  showActionsColumn?: boolean;
  allowHeaderEditToggle?: boolean; // "Modifica tutti" in header

  /** callback opzionali per salvataggio/cancel della singola riga */
  onRowSave?: (row: TableKeyValueRow, index: number) => void | Promise<void>;
  onRowCancel?: (row: TableKeyValueRow, index: number) => void;
};

export default function TableKeyValue({
  title = "Parametri",
  rows,
  onChange,
  onSave,
  onCancel,
  loading = false,
  saving = false,
  compact = false,
  editable = true,
  footerActions,
  showActionsColumn = true,
  allowHeaderEditToggle = true,
  onRowSave,
  onRowCancel,
}: TableKeyValueProps) {
  /** forza edit di tutta la colonna valori da header */
  const [forceAll, setForceAll] = useState(false);

  /** righe in editing puntuale + snapshot valori originali per cancel */
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const originalsRef = useRef<Record<string, TableKeyValueRow | undefined>>({});

  const hasActions = showActionsColumn || allowHeaderEditToggle;

  const isRowEditableNow = (row: TableKeyValueRow) =>
    !row.readOnly && (editable || forceAll || editingRows.has(String(row.id)));

  const startRowEdit = (row: TableKeyValueRow) => {
    if (row.readOnly) return;
    if (!editingRows.has(String(row.id))) {
      // salva snapshot originale della riga
      originalsRef.current[row.id] = JSON.parse(JSON.stringify(row));
      const next = new Set(editingRows);
      next.add(String(row.id));
      setEditingRows(next);
    }
  };

  const cancelRowEdit = (row: TableKeyValueRow, index: number) => {
    const original = originalsRef.current[row.id];
    if (original) {
      const copy = [...rows];
      copy[index] = original;
      onChange(copy);
    }
    delete originalsRef.current[row.id];
    const next = new Set(editingRows);
    next.delete(String(row.id));
    setEditingRows(next);
    onRowCancel?.(row, index);
  };

  const saveRowEdit = async (row: TableKeyValueRow, index: number) => {
    try {
      await onRowSave?.(row, index);
    } finally {
      delete originalsRef.current[row.id];
      const next = new Set(editingRows);
      next.delete(String(row.id));
      setEditingRows(next);
    }
  };

  /** aggiornamento di un singolo valore */
  const handleValue = (idx: number, next: unknown) => {
    const copy = [...rows];
    const row = copy[idx];
    if (row.type === "number") {
      const n = Number(next);
      (row as any).value = Number.isNaN(n) ? 0 : n;
    } else if (row.type === "boolean") {
      (row as any).value = Boolean(next);
    } else {
      (row as any).value = String(next ?? "");
    }
    onChange(copy);
  };

  return (
    <div
      className={[
        styles.tableWrap,
        compact ? styles.compact : "",
        hasActions ? styles.withActions : "",
      ].join(" ")}
    >
      {title && <div className={styles.tableTitle}>{title}</div>}

      <div className={styles.table}>
        {/* head */}
        <div className={[styles.row, styles.head].join(" ")}>
          <div className={styles.colKey}>Key</div>
          <div className={styles.colParam}>Parametri</div>
          <div className={styles.colValue}>
            Valori
            {allowHeaderEditToggle && (
              <div className={styles.headerToggle}>
                <Switch
                  size="sm"
                  color="primary"
                  checked={forceAll}
                  onChange={setForceAll}
                  label={
                    <span className={styles.headerToggleLabel}>
                      Modifica tutti
                    </span>
                  }
                  labelPosition="right"
                  title="Rendi tutta la colonna editabile/readonly"
                />
              </div>
            )}
          </div>
          {hasActions && <div className={styles.colActions}>Azioni</div>}
        </div>

        {/* loading */}
        {loading && (
          <div className={[styles.row, styles.loadingRow].join(" ")}>
            <div className={styles.loadingSpinner} />
            <span>Caricamento…</span>
          </div>
        )}

        {/* body */}
        {!loading &&
          rows.map((r, i) => {
            const readonly = !isRowEditableNow(r);
            const errorMsg =
              r.type === "number" &&
              (r.validate?.(Number(r.value)) ?? undefined);

            return (
              <div key={r.id} className={styles.row}>
                {/* KEY */}
                <div className={styles.colKey}>
                  <span className={styles.keyBadge} title={r.key}>
                    {r.key}
                  </span>
                </div>

                {/* PARAM LABEL */}
                <div className={styles.colParam}>
                  <div className={styles.paramMain}>
                    <span className={styles.paramLabel} title={r.label}>
                      {r.label}
                    </span>
                  </div>
                </div>

                {/* VALUE CELL */}
                <div className={styles.colValue}>
                  {r.type === "boolean" ? (
                    readonly ? (
                      <span
                        className={[
                          styles.readonlyChip,
                          r.value ? styles.true : styles.false,
                        ].join(" ")}
                      >
                        {r.value ? <Check size={12} /> : <X size={12} />}
                        {r.value ? "True" : "False"}
                      </span>
                    ) : (
                      <Switch
                        size="md"
                        color="primary"
                        checked={r.value}
                        onChange={(on) => handleValue(i, on)}
                        label={null}
                      />
                    )
                  ) : r.type === "number" ? (
                    readonly ? (
                      <div className={styles.readonlyValue}>
                        {String(r.value)}{" "}
                        {r.unit ? (
                          <span className={styles.unit}>{r.unit}</span>
                        ) : null}
                      </div>
                    ) : (
                      <div className={styles.fieldInline}>
                        <Input
                          label="Valore"
                          hideLabel
                          name={`num-${r.id}`}
                          type="number"
                          value={String(r.value)}
                          onChange={(e) =>
                            handleValue(i, (e.target as HTMLInputElement).value)
                          }
                          /*  min={(r as any).min}
                          max={(r as any).max}
                          step={(r as any).step ?? "any"} */
                          size="sm"
                          containerClassName={styles.inputContainer}
                          inputClassName={styles.inputField}
                        />
                        {r.unit && (
                          <span className={styles.unit}>{r.unit}</span>
                        )}
                      </div>
                    )
                  ) : r.type === "multiline" ? (
                    readonly ? (
                      <div className={styles.readonlyMulti}>
                        {r.value || "—"}
                      </div>
                    ) : (
                      <textarea
                        className={styles.textarea}
                        value={r.value}
                        placeholder={r.placeholder}
                        onChange={(e) => handleValue(i, e.target.value)}
                        rows={3}
                      />
                    )
                  ) : r.type === "select" ? (
                    readonly ? (
                      <div className={styles.readonlyValue}>
                        {r.options.find((o) => o.value === r.value)?.label ??
                          r.value}
                      </div>
                    ) : (
                      <select
                        className={styles.select}
                        value={r.value}
                        onChange={(e) => handleValue(i, e.target.value)}
                      >
                        {r.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    )
                  ) : // text
                  readonly ? (
                    <div className={styles.readonlyValue}>{r.value || "—"}</div>
                  ) : (
                    <Input
                      label="Valore"
                      hideLabel
                      name={`txt-${r.id}`}
                      type="text"
                      value={r.value}
                      placeholder={r.placeholder}
                      onChange={(e) =>
                        handleValue(i, (e.target as HTMLInputElement).value)
                      }
                      size="sm"
                      containerClassName={styles.inputContainer}
                      inputClassName={styles.inputField}
                    />
                  )}

                  {/* error */}
                  {errorMsg && !readonly && (
                    <div className={styles.errorMsg}>{errorMsg}</div>
                  )}
                </div>

                {/* ACTIONS */}
                {hasActions && (
                  <div className={styles.colActions}>
                    {r.readOnly ? (
                      <span className={styles.actionHint}>—</span>
                    ) : editable || forceAll ? (
                      // quando tutta la colonna è editabile non ha senso l’azione per riga
                      <span className={styles.actionHint}>—</span>
                    ) : editingRows.has(r.id) ? (
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={[styles.iconBtn, styles.save].join(" ")}
                          title="Salva riga"
                          onClick={() => saveRowEdit(r, i)}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          className={[styles.iconBtn, styles.cancel].join(" ")}
                          title="Annulla modifiche riga"
                          onClick={() => cancelRowEdit(r, i)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={styles.iconBtn}
                        title="Modifica questa riga"
                        onClick={() => startRowEdit(r)}
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

        {/* footer actions (sticky) */}
        {footerActions?.show && (
          <div
            className={[styles.footer, saving ? styles.saving : ""].join(" ")}
          >
            <div className={styles.footerNote}>
              {saving ? "Salvataggio in corso…" : "Modifiche non salvate"}
            </div>
            <div className={styles.footerActions}>
              <button
                type="button"
                className={[styles.ftBtn, styles.ghost].join(" ")}
                onClick={onCancel}
                disabled={footerActions.cancelDisabled}
              >
                {footerActions.cancelLabel ?? "Annulla"}
              </button>
              <button
                type="button"
                className={[styles.ftBtn, styles.primary].join(" ")}
                onClick={() => onSave?.(rows)}
                disabled={footerActions.saveDisabled}
              >
                {footerActions.saveLabel ?? "Salva"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
