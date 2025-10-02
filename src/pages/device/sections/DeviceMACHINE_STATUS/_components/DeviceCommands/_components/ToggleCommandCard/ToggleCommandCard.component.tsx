import React, { useCallback, useMemo } from "react";
import { Power, Loader2 } from "lucide-react";
import styles from "./ToggleCommandCard.module.scss";

export interface ToggleCommandDescriptor {
  /** Unique id of the toggle (ex: door, list) */
  id: string;
  /** Label shown as title (ex: Serranda, Lista) */
  label: string;
  /** Current active state coming from PLC aggregated value */
  isActive: boolean | undefined;
  /** True while a command (open or close) is currently executing */
  isExecuting?: boolean;
  /** Command key to use to turn ON / open */
  onCommandKey: string;
  /** Command key to use to turn OFF / close */
  offCommandKey: string;
  /** Optional textual status override */
  statusDescription?: string;
}

export interface ToggleCommandCardProps {
  descriptor: ToggleCommandDescriptor;
  /** Generic executor coming from usePlcCommands */
  execute: (commandKey: string) => Promise<boolean> | boolean;
  /** Disable card interaction */
  disabled?: boolean;
  /** Compact visual (reduced spacing & font) */
  compact?: boolean;
}

/**
 * UI Card that merges two legacy commands (open/close) into one toggle surface.
 * Shows a power icon button (left), main label (center) and dynamic state text (bottom).
 */
export const ToggleCommandCard: React.FC<ToggleCommandCardProps> = ({
  descriptor,
  execute,
  disabled,
  compact,
}) => {
  const { label, isActive, isExecuting, onCommandKey, offCommandKey, statusDescription } = descriptor;

  const nextActionIsOn = !isActive; // if currently not active we will send the ON command
  const targetCommandKey = nextActionIsOn ? onCommandKey : offCommandKey;

  const handleToggle = useCallback(() => {
    if (disabled || isExecuting) return;
    execute(targetCommandKey);
  }, [disabled, isExecuting, targetCommandKey, execute]);

  const statusLabel = useMemo(() => {
    if (isExecuting) {
      if (nextActionIsOn) {
        return /serranda/i.test(label)
          ? "Apertura serranda…"
          : /lista/i.test(label)
          ? "Apertura lista…"
          : `${label}: attivazione…`;
      }
      return /serranda/i.test(label)
        ? "Chiusura serranda…"
        : /lista/i.test(label)
        ? "Chiusura lista…"
        : `${label}: disattivazione…`;
    }
    if (statusDescription) return statusDescription; // external computed text
    if (isActive === undefined) return `${label}: stato sconosciuto`;
    return isActive ? `${label} aperta` : `${label} chiusa`;
  }, [isExecuting, isActive, label, nextActionIsOn, statusDescription]);

  return (
    <div
      className={[styles.card, compact ? styles.compact : ""].join(" ")}
      data-active={isActive ? "true" : "false"}
    >
      <button
        type="button"
        className={styles.powerBtn}
        onClick={handleToggle}
        disabled={disabled || isExecuting}
        aria-label={nextActionIsOn ? `Attiva ${label}` : `Disattiva ${label}`}
      >
        {isExecuting ? <Loader2 size={18} className={styles.spin} /> : <Power size={18} />}
      </button>
      <div className={styles.meta}>
        <div className={styles.title}>{label}</div>
        <div className={styles.status}>
          {statusLabel}
          {isExecuting && (
            <Loader2
              size={12}
              className={[styles.spin, styles.inlineSpinner].join(" ")}
              aria-label="loading"
            />
          )}
        </div>
      </div>
      <div className={styles.actionChip} data-on={nextActionIsOn ? "true" : "false"}>
        {isExecuting ? "..." : nextActionIsOn ? "ON" : "OFF"}
      </div>
    </div>
  );
};

export default ToggleCommandCard;
