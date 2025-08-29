import { Settings, Monitor } from "lucide-react";
import styles from "./GeneralInfoFormCard.module.scss";
import { Input } from "@shared/inputs/Input.component.tsx";
import DeviceCard from "../../../device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "../../../device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";

type Props = {
  formData: {
    machine_Name: string;
    waste: string;
    status: number;
    linuxVersion: string;
    startAvailable: string;
    endAvailable: string;
  };
  isSaving: boolean;
  onChange: (field: string, value: any) => void;
};

export default function GeneralInfoFormCard({
  formData,
  isSaving,
  onChange,
}: Props) {
  return (
    <DeviceCard title="Informazioni Generali" icon={<Settings size={18} />}>
      <DeviceFormGrid>
        <Input
          label="Nome Macchina"
          name="machine_Name"
          value={formData.machine_Name}
          onChange={(e) => onChange("machine_Name", e.target.value)}
          placeholder="Inserisci nome macchina"
          icon={Monitor}
          disabled={isSaving}
        />

        <div className={styles.selectGroup}>
          <label className={styles.selectLabel}>Tipo Rifiuto</label>
          <select
            className={styles.selectInput}
            value={formData.waste}
            onChange={(e) => onChange("waste", e.target.value)}
            disabled={isSaving}
          >
            <option value="">Seleziona tipo</option>
            <option value="Plastica">Plastica</option>
            <option value="Secco">Secco</option>
            <option value="Umido">Umido</option>
            <option value="Vetro">Vetro</option>
            <option value="Indifferenziato">Indifferenziato</option>
            <option value="Carta">Carta</option>
            <option value="vpl">VPL</option>
          </select>
        </div>
      </DeviceFormGrid>

      <DeviceFormGrid>
        <div className={styles.selectGroup}>
          <label className={styles.selectLabel}>Stato</label>
          <select
            className={styles.selectInput}
            value={formData.status}
            onChange={(e) => onChange("status", parseInt(e.target.value))}
            disabled={isSaving}
          >
            <option value={0}>Inattivo</option>
            <option value={1}>Attivo</option>
          </select>
        </div>

        <Input
          label="Versione Linux"
          name="linuxVersion"
          value={formData.linuxVersion}
          onChange={(e) => onChange("linuxVersion", e.target.value)}
          placeholder="es. Ubuntu 22.04"
          disabled={isSaving}
        />
      </DeviceFormGrid>

      <DeviceFormGrid>
        <Input
          label="Orario Inizio"
          name="startAvailable"
          type="time"
          value={formData.startAvailable}
          onChange={(e) => onChange("startAvailable", e.target.value)}
          disabled={isSaving}
        />
        <Input
          label="Orario Fine"
          name="endAvailable"
          type="time"
          value={formData.endAvailable}
          onChange={(e) => onChange("endAvailable", e.target.value)}
          disabled={isSaving}
        />
      </DeviceFormGrid>
    </DeviceCard>
  );
}
