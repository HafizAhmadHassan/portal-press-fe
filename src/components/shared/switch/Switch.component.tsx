import React, { useCallback } from "react";
import { Loader2 } from "lucide-react";
import styles from "./Switch.module.scss";

type SwitchColor = "primary" | "secondary" | "success" | "warning" | "danger";
type SwitchSize = "sm" | "md" | "lg";
type LabelPosition = "left" | "right";

export type SwitchProps = {
  /** Stato ON/OFF */
  checked: boolean;
  /** Callback al toggle */
  onChange: (checked: boolean) => void;

  /** Testo/elemento etichetta (opzionale) */
  label?: React.ReactNode;
  /** Posizione etichetta (default: right) */
  labelPosition?: LabelPosition;

  /** Dimensione (default: md) */
  size?: SwitchSize;
  /** Colore (default: primary) */
  color?: SwitchColor;

  /** Icona dentro il thumb quando ON */
  iconOn?: React.ReactNode;
  /** Icona dentro il thumb quando OFF */
  iconOff?: React.ReactNode;

  /** Disabilita interazione */
  disabled?: boolean;
  /** Stato caricamento (mostra spinner nel thumb) */
  loading?: boolean;

  /** Title/tooltip */
  title?: string;

  /** Classi/Style extra */
  className?: string;
  style?: React.CSSProperties;

  /** id/accessibilità */
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  labelPosition = "right",
  size = "md",
  color = "primary",
  iconOn,
  iconOff,
  disabled,
  loading,
  title,
  className,
  style,
  id,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
}) => {
  const toggle = useCallback(() => {
    if (!disabled && !loading) onChange(!checked);
  }, [checked, disabled, loading, onChange]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onChange(!checked);
    }
  };

  const rootClasses = [
    styles.switch,
    styles[`size-${size}`],
    styles[`color-${color}`],
    checked ? styles.checked : "",
    disabled ? styles.disabled : "",
    loading ? styles.loading : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label className={styles.wrapper} style={style}>
      {label && labelPosition === "left" && (
        <span className={styles.label}>{label}</span>
      )}

      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled || loading || undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        className={rootClasses}
        onClick={toggle}
        onKeyDown={onKeyDown}
        title={title}
        disabled={disabled}
      >
        <span className={styles.track} />
        <span className={styles.thumb}>
          {loading ? (
            <Loader2 className={styles.loader} size={14} />
          ) : checked ? (
            iconOn ?? null
          ) : (
            iconOff ?? null
          )}
        </span>
      </button>

      {label && labelPosition === "right" && (
        <span className={styles.label}>{label}</span>
      )}
    </label>
  );
};

export default Switch;
