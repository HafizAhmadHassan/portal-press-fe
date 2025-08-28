import React from "react";

import { User as UserIcon } from "lucide-react";
import styles from "./PersonalInfoCard.module.scss";
import { Input } from "@shared/inputs/Input.component.tsx";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "@root/pages/device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";

type Values = { firstName: string; lastName: string; fullName: string };
type Props = {
  values: Values;
  disabled?: boolean;
  onChange: (field: keyof Values, value: string) => void;
};

export default function PersonalInfoCard({
  values,
  disabled,
  onChange,
}: Props) {
  const syncFullName = (fn: string, ln: string) =>
    `${fn} ${ln}`.trim().replace(/\s+/g, " ");

  return (
    <DeviceCard
      title="Informazioni Personali"
      icon={<UserIcon size={18} />}
      info={<span className={styles.optBadge}>Opzionale</span>}
    >
      <DeviceFormGrid>
        <Input
          label="Nome"
          name="firstName"
          value={values.firstName}
          onChange={(e) => {
            const v = e.target.value;
            onChange("firstName", v);
            onChange("fullName", syncFullName(v, values.lastName));
          }}
          placeholder="es. John"
          disabled={disabled}
        />
        <Input
          label="Cognome"
          name="lastName"
          value={values.lastName}
          onChange={(e) => {
            const v = e.target.value;
            onChange("lastName", v);
            onChange("fullName", syncFullName(values.firstName, v));
          }}
          placeholder="es. Doe"
          disabled={disabled}
        />
      </DeviceFormGrid>

      <Input
        label="Nome Completo"
        name="fullName"
        value={values.fullName}
        onChange={(e) => onChange("fullName", e.target.value)}
        placeholder="Generato automaticamente o inserisci manualmente"
        disabled={disabled}
      />
    </DeviceCard>
  );
}
