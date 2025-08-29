import React from "react";
import { Monitor, Activity } from "lucide-react";
import { Input } from "@shared/inputs/Input.component";
import { Select } from "@shared/select/Select.component";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "@root/pages/device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";
import styles from "./BaseInfoCard.module.scss";

type Values = {
  machine_Name: string;
  status: number;
  waste: string;
  linux_Version: string;
  start_Available: string;
  end_Available: string;
};

type Errors = Partial<Record<keyof Values, string>>;

type Props = {
  values: Values;
  errors: Errors;
  disabled?: boolean;
  onChange: (field: keyof Values, value: any) => void;
};

const statusOptions = [
  { value: 1, label: "Attivo" },
  { value: 0, label: "Inattivo" },
];

const wasteOptions = [
  { value: "", label: "Seleziona tipo rifiuto" },
  { value: "Plastica", label: "Plastica" },
  { value: "Secco", label: "Secco" },
  { value: "Umido", label: "Umido" },
  { value: "Vetro", label: "Vetro" },
  { value: "Indifferenziato", label: "Indifferenziato" },
  { value: "Carta", label: "Carta" },
  { value: "vpl", label: "VPL" },
];

export default function BaseInfoCard({
  values,
  errors,
  disabled,
  onChange,
}: Props) {
  return (
    <DeviceCard
      title="Informazioni Base"
      icon={<Monitor size={18} />}
      info={<span className={styles.reqBadge}>Obbligatorio</span>}
      bodyClassName={styles.body}
    >
      <DeviceFormGrid>
        <Input
          label="Nome Macchina"
          name="machine_Name"
          value={values.machine_Name}
          onChange={(e) => onChange("machine_Name", e.target.value)}
          placeholder="es. Device_001"
          icon={Monitor}
          disabled={disabled}
          required
          error={errors.machine_Name}
        />

        <Select
          label="Stato"
          name="status"
          value={values.status}
          onChange={(value) => onChange("status", Number(value))}
          options={statusOptions}
          disabled={disabled}
          required
          icon={Activity}
        />
      </DeviceFormGrid>

      <DeviceFormGrid>
        <Select
          label="Tipo Rifiuto"
          name="waste"
          value={values.waste}
          onChange={(value) => onChange("waste", value)}
          options={wasteOptions}
          disabled={disabled}
        />

        <Input
          label="Versione Linux"
          name="linux_Version"
          value={values.linux_Version}
          onChange={(e) => onChange("linux_Version", e.target.value)}
          placeholder="es. 2.1.0"
          disabled={disabled}
        />
      </DeviceFormGrid>

      <DeviceFormGrid>
        <Input
          label="Data Inizio Disponibilità"
          name="start_Available"
          type="date"
          value={values.start_Available}
          onChange={(e) => onChange("start_Available", e.target.value)}
          disabled={disabled}
        />

        <Input
          label="Data Fine Disponibilità"
          name="end_Available"
          type="date"
          value={values.end_Available}
          onChange={(e) => onChange("end_Available", e.target.value)}
          disabled={disabled}
        />
      </DeviceFormGrid>
    </DeviceCard>
  );
}
