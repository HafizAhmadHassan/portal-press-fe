import React, { useRef, useState } from "react";
import styles from "./TableKeyValue.module.scss";
import { Input } from "@components/shared/inputs/Input.component";
import Switch from "@root/components/shared/switch/Switch.component";
import { Check, Edit3, X } from "lucide-react";

/** === Row definition per nuovo formato === */
export type TableKeyValueObject = Record<
  string,
  {
    label: string;
    value: string | number | boolean;
    type?: "text" | "number" | "boolean" | "multiline" | "select";
    unit?: string;
    placeholder?: string;
    options?: Array<{ label: string; value: string }>;
    readOnly?: boolean;
    min?: number;
    max?: number;
    step?: number;
    validate?: (v: number) => string | undefined;
  }
>;

/** === Props === */
export type TableKeyValueProps = {
  title?: React.ReactNode;
  rows: TableKeyValueObject;
  onChange: (next: TableKeyValueObject) => void;
  onSave?: (rows: TableKeyValueObject) => void | Promise<void>;
  onCancel?: () => void;

  /** stati */
  loading?: boolean;
  saving?: boolean;

  /** layout */
  compact?: boolean;

  /** controllo globale */
  editable?: boolean;

  /** footer sticky */
  footerActions?: {
    show?: boolean;
    cancelLabel?: string;
    saveLabel?: string;
    cancelDisabled?: boolean;
    saveDisabled?: boolean;
  };

  /** azioni */
  showActionsColumn?: boolean;
  allowHeaderEditToggle?: boolean;

  /** callback opzionali */
  onRowSave?: (
    rowKey: string,
    rowData: TableKeyValueObject[string]
  ) => void | Promise<void>;
  onRowCancel?: (rowKey: string, rowData: TableKeyValueObject[string]) => void;
};

export default function TableKeyValue2({
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
  const [forceAll, setForceAll] = useState(false);
  const [editingRows, setEditingRows] = useState<Set<string>>(new Set());
  const originalsRef = useRef<Record<string, TableKeyValueObject[string]>>({});

  const hasActions = showActionsColumn || allowHeaderEditToggle;

  const isRowEditableNow = (rowKey: string, row: TableKeyValueObject[string]) =>
    !row.readOnly && (editable || forceAll || editingRows.has(String(rowKey)));

  const startRowEdit = (rowKey: string, row: TableKeyValueObject[string]) => {
    if (row.readOnly) return;
    if (!editingRows.has(rowKey)) {
      originalsRef.current[rowKey] = JSON.parse(JSON.stringify(row));
      const next = new Set(editingRows);
      next.add(rowKey);
      setEditingRows(next);
    }
  };

  const cancelRowEdit = (rowKey: string, row: TableKeyValueObject[string]) => {
    const original = originalsRef.current[rowKey];
    if (original) {
      const copy = { ...rows, [rowKey]: original };
      onChange(copy);
    }
    delete originalsRef.current[rowKey];
    const next = new Set(editingRows);
    next.delete(rowKey);
    setEditingRows(next);
    onRowCancel?.(rowKey, row);
  };

  const saveRowEdit = async (
    rowKey: string,
    row: TableKeyValueObject[string]
  ) => {
    try {
      await onRowSave?.(rowKey, row);
    } finally {
      delete originalsRef.current[rowKey];
      const next = new Set(editingRows);
      next.delete(rowKey);
      setEditingRows(next);
    }
  };

  const handleValue = (rowKey: string, next: unknown) => {
    const copy = { ...rows };
    const row = copy[rowKey];
    if (!row) return;

    if (row.type === "number") {
      const n = Number(next);
      row.value = Number.isNaN(n) ? 0 : n;
    } else if (row.type === "boolean") {
      row.value = Boolean(next);
    } else {
      row.value = String(next ?? "");
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
          <div className={styles.colUnit}>Unit</div>
          {hasActions && editable && (
            <div className={styles.colActions}>Azioni</div>
          )}
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
          Object.entries(rows).map(([rowKey, r]) => {
            const readonly = !isRowEditableNow(rowKey, r);
            const errorMsg =
              r.type === "number" &&
              (r.validate?.(Number(r.value)) ?? undefined);

            return (
              <div key={rowKey} className={styles.row}>
                {/* KEY */}
                <div className={styles.colKey}>
                  <span className={styles.keyBadge} title={rowKey}>
                    {rowKey}
                  </span>
                </div>

                {/* LABEL */}
                <div className={styles.colParam}>
                  <div className={styles.paramMain}>
                    <span className={styles.paramLabel} title={r.label}>
                      {r.label}
                    </span>
                  </div>
                </div>

                {/* VALUE */}
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
                        checked={Boolean(r.value)}
                        onChange={(on) => handleValue(rowKey, on)}
                        label={null}
                      />
                    )
                  ) : r.type === "number" ? (
                    readonly ? (
                      <div className={styles.readonlyValue}>
                        {String(r.value)}
                      </div>
                    ) : (
                      <div className={styles.fieldInline}>
                        <Input
                          label="Valore"
                          hideLabel
                          name={`num-${rowKey}`}
                          type="number"
                          value={String(r.value)}
                          onChange={(e) =>
                            handleValue(
                              rowKey,
                              (e.target as HTMLInputElement).value
                            )
                          }
                          size="sm"
                          containerClassName={styles.inputContainer}
                          inputClassName={styles.inputField}
                        />
                      </div>
                    )
                  ) : r.type === "multiline" ? (
                    readonly ? (
                      <div className={styles.readonlyMulti}>
                        {String(r.value) || "—"}
                      </div>
                    ) : (
                      <textarea
                        className={styles.textarea}
                        value={String(r.value)}
                        placeholder={r.placeholder}
                        onChange={(e) => handleValue(rowKey, e.target.value)}
                        rows={3}
                      />
                    )
                  ) : r.type === "select" && r.options ? (
                    readonly ? (
                      <div className={styles.readonlyValue}>
                        {r.options.find((o) => o.value === r.value)?.label ??
                          String(r.value)}
                      </div>
                    ) : (
                      <select
                        className={styles.select}
                        value={String(r.value)}
                        onChange={(e) => handleValue(rowKey, e.target.value)}
                      >
                        {r.options.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    )
                  ) : readonly ? (
                    <div className={styles.readonlyValue}>
                      {String(r.value) || "—"}
                    </div>
                  ) : (
                    <div className={styles.fieldInline}>
                      <Input
                        label="Valore"
                        hideLabel
                        name={`txt-${rowKey}`}
                        type="text"
                        value={String(r.value)}
                        placeholder={r.placeholder}
                        onChange={(e) =>
                          handleValue(
                            rowKey,
                            (e.target as HTMLInputElement).value
                          )
                        }
                        size="sm"
                        containerClassName={styles.inputContainer}
                        inputClassName={styles.inputField}
                      />
                    </div>
                  )}
                  {errorMsg && !readonly && (
                    <div className={styles.errorMsg}>{errorMsg}</div>
                  )}
                </div>

                {/* UNIT */}
                <div className={styles.colUnit}>
                  {r.unit ? <span className={styles.unit}>{r.unit}</span> : "—"}
                </div>

                {/* ACTIONS */}
                {hasActions && editable && (
                  <div className={styles.colActions}>
                    {r.readOnly ? (
                      <span className={styles.actionHint}>—</span>
                    ) : editable || forceAll ? (
                      <span className={styles.actionHint}>—</span>
                    ) : editingRows.has(rowKey) ? (
                      <div className={styles.rowActions}>
                        <button
                          type="button"
                          className={[styles.iconBtn, styles.save].join(" ")}
                          title="Salva riga"
                          onClick={() => saveRowEdit(rowKey, r)}
                        >
                          <Check size={14} />
                        </button>
                        <button
                          type="button"
                          className={[styles.iconBtn, styles.cancel].join(" ")}
                          title="Annulla modifiche riga"
                          onClick={() => cancelRowEdit(rowKey, r)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className={styles.iconBtn}
                        title="Modifica questa riga"
                        onClick={() => startRowEdit(rowKey, r)}
                      >
                        <Edit3 size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

        {/* footer actions */}
        {footerActions?.show && editable && (
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
