import React from "react";

import { Lock, Mail, User as UserIcon } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";

import styles from "./CredentialsCard.module.scss";
import PasswordStrengthBar from "../PasswordStrengthBar/PasswordStrengthBar.component";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import PasswordField from "../PasswordFields/PasswordFields.component";
import { DeviceFormGrid } from "@root/pages/device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";

type Values = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
type Errors = Partial<Record<keyof Values, string>>;

type Props = {
  values: Values;
  errors: Errors;
  disabled?: boolean;
  onChange: (field: keyof Values, value: string) => void;
};

export default function CredentialsCard({
  values,
  errors,
  disabled,
  onChange,
}: Props) {
  return (
    <DeviceCard
      title="Credenziali di Accesso"
      icon={<Lock size={18} />}
      info={<span className={styles.reqBadge}>Obbligatorio</span>}
      bodyClassName={styles.body}
    >
      <DeviceFormGrid>
        <Input
          label="Username"
          name="username"
          value={values.username}
          onChange={(e) => onChange("username", e.target.value)}
          placeholder="es. john_doe"
          icon={UserIcon}
          disabled={disabled}
          required
          error={errors.username}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="es. john@example.com"
          icon={Mail}
          disabled={disabled}
          required
          error={errors.email}
        />
      </DeviceFormGrid>

      <DeviceFormGrid>
        <PasswordField
          label="Password"
          name="password"
          value={values.password}
          onChange={(v) => onChange("password", v)}
          placeholder="Inserisci password sicura"
          disabled={disabled}
          error={errors.password}
          icon={<Lock size={16} />}
        />
        <PasswordField
          label="Conferma Password"
          name="confirmPassword"
          value={values.confirmPassword}
          onChange={(v) => onChange("confirmPassword", v)}
          placeholder="Ripeti la password"
          disabled={disabled}
          error={errors.confirmPassword}
          icon={<Lock size={16} />}
        />
      </DeviceFormGrid>

      {values.password && <PasswordStrengthBar password={values.password} />}
    </DeviceCard>
  );
}
