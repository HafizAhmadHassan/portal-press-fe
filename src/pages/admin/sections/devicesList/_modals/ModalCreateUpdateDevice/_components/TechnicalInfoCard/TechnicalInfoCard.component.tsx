import React from "react";
import { Settings, Wifi, Users, FileText } from "lucide-react";
import { Input } from "@shared/inputs/Input.component";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "@root/pages/device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";
import styles from "./TechnicalInfoCard.module.scss";

type Values = {
  ip_Router: string;
  codice_Gps: string;
  sheet_Name: string;
  matricola_Bte: string;
  matricola_Kgn: string;
  customer_Name: string;
  customer: string;
  note: string;
};

type Errors = Partial<Record<keyof Values, string>>;

type Props = {
  values: Values;
  errors: Errors;
  disabled?: boolean;
  onChange: (field: keyof Values, value: string) => void;
};

export default function TechnicalInfoCard({
  values,
  errors,
  disabled,
  onChange,
}: Props) {
  return (
    <DeviceCard
      title="Informazioni Tecniche"
      icon={<Settings size={18} />}
      info={<span className={styles.optionalBadge}>Opzionale</span>}
      bodyClassName={styles.body}
    >
      <DeviceFormGrid>
        <Input
          label="IP Router"
          name="ip_Router"
          value={values.ip_Router}
          onChange={(e) => onChange("ip_Router", e.target.value)}
          placeholder="es. 192.168.1.1"
          disabled={disabled}
          error={errors.ip_Router}
          icon={Wifi}
        />
        <Input
          label="Codice GPS"
          name="codice_Gps"
          value={values.codice_Gps}
          onChange={(e) => onChange("codice_Gps", e.target.value)}
          placeholder="es. GPS001"
          disabled={disabled}
        />
      </DeviceFormGrid>

      <DeviceFormGrid>
        <Input
          label="Nome Foglio"
          name="sheet_Name"
          value={values.sheet_Name}
          onChange={(e) => onChange("sheet_Name", e.target.value)}
          placeholder="es. Foglio_001"
          disabled={disabled}
          icon={FileText}
        />
        <Input
          label="Matricola BTE"
          name="matricola_Bte"
          value={values.matricola_Bte}
          onChange={(e) => onChange("matricola_Bte", e.target.value)}
          placeholder="es. BTE123456"
          disabled={disabled}
        />
      </DeviceFormGrid>

      <DeviceFormGrid>
        <Input
          label="Matricola KGN"
          name="matricola_Kgn"
          value={values.matricola_Kgn}
          onChange={(e) => onChange("matricola_Kgn", e.target.value)}
          placeholder="es. KGN123456"
          disabled={disabled}
        />
        <Input
          label="Nome Cliente"
          name="customer_Name"
          value={values.customer_Name}
          onChange={(e) => onChange("customer_Name", e.target.value)}
          placeholder="es. Cliente SpA"
          disabled={disabled}
          icon={Users}
        />
      </DeviceFormGrid>

      <div className={styles.fullWidth}>
        <Input
          label="Cliente"
          name="customer"
          value={values.customer}
          onChange={(e) => onChange("customer", e.target.value)}
          placeholder="es. cliente_001"
          disabled={disabled}
          icon={Users}
        />
      </div>

      <div className={styles.fullWidth}>
        <Input
          label="Note"
          name="note"
          value={values.note}
          onChange={(e) => onChange("note", e.target.value)}
          placeholder="Note aggiuntive..."
          disabled={disabled}
          multiline
          rows={3}
        />
      </div>
    </DeviceCard>
  );
}
