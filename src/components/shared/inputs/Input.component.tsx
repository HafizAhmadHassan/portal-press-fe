import React from "react";
import styles from "./Input.module.scss";
import { type LucideIcon, Mail } from "lucide-react";

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

// icona può essere componente (LucideIcon) OPPURE elemento React
type IconProp = LucideIcon | React.ReactNode;

type InputProps = {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "date" | "time" | "number";
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  disabled?: boolean;
  required?: boolean;
  icon?: IconProp;
  iconPosition?: "left" | "right";
  error?: string;
  multiline?: boolean;

  variant?: "default" | "pill";
  size?: "sm" | "md";
  hideLabel?: boolean;
  onKeyUp?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;

  /** nuove */
  containerClassName?: string; // classe extra sul container
  inputClassName?: string; // classe extra sul campo (input/textarea)
};

export const Input = ({
  label = "Input Default",
  name = "input-default",
  placeholder = "Inserisci il tuo testo qui",
  type = "text",
  value = "",
  onChange = (e) =>
    console.log("Input Default Changed!", (e.target as HTMLInputElement).value),
  disabled = false,
  required = false,
  icon = Mail,
  iconPosition = "left",
  error = "",
  multiline = false,

  variant = "default",
  size = "md",
  hideLabel = false,
  onKeyUp,
  onKeyDown,

  containerClassName,
  inputClassName,
}: InputProps) => {
  const errorId = error ? `${name}-error` : undefined;
  const labelId = `${name}-label`;

  const containerClass = cx(
    styles.inputContainer,
    variant === "pill" && styles.pill,
    size === "sm" && styles.sizeSm,
    hideLabel && styles.noMargin,
    error && styles.hasError,
    containerClassName
  );

  const wrapperClass = cx(
    styles.inputWrapper,
    iconPosition === "left" ? styles.iconLeft : styles.iconRight
  );

  const fieldClass = cx(styles.field, inputClassName);

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon; // già elemento
    const IconComp = icon as LucideIcon; // componente
    return <IconComp size={16} />;
    // NB: il colore viene dai CSS del wrapper (.inputIcon)
  };

  return (
    <div className={containerClass}>
      <label
        id={labelId}
        htmlFor={name}
        className={hideLabel ? styles.srOnly : styles.inputLabel}
      >
        {label}
      </label>

      <div className={wrapperClass}>
        {iconPosition === "left" && (
          <span className={styles.inputIcon}>{renderIcon()}</span>
        )}

        {multiline ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={fieldClass}
            aria-labelledby={labelId}
            aria-invalid={!!error}
            aria-describedby={errorId}
            rows={4}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={fieldClass}
            aria-labelledby={labelId}
            aria-invalid={!!error}
            aria-describedby={errorId}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
          />
        )}

        {iconPosition === "right" && (
          <span className={styles.inputIcon}>{renderIcon()}</span>
        )}
      </div>

      {error ? (
        <div id={errorId} className={styles.errorText}>
          {error}
        </div>
      ) : null}
    </div>
  );
};
