import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import styles from "./PasswordFields.module.scss";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  icon?: React.ReactNode;
};

export default function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  icon,
}: Props) {
  const [show, setShow] = useState(false);
  return (
    <div className={styles.passwordField}>
      <Input
        label={label}
        name={name}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        error={error}
        icon={icon}
      />
      <button
        type="button"
        className={styles.passwordToggle}
        onClick={() => setShow((v) => !v)}
        aria-label={show ? "Nascondi password" : "Mostra password"}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
