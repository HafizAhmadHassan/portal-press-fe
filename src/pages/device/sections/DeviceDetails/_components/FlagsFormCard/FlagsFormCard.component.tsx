import { Settings } from "lucide-react";
import styles from "./FlagsFormCard.module.scss";
import { Checkbox } from "@shared/checkbox/CheckBox.component.tsx";
import DeviceCard from "../../../_components/DeviceCard/DeviceCard.component";

type Props = {
  formData: {
    tatus_ready_d75_3_7: boolean;
    status_Machine_Blocked: boolean;
  };
  isSaving: boolean;
  onChange: (field: string, value: any) => void;
};

export default function FlagsFormCard({ formData, isSaving, onChange }: Props) {
  return (
    <DeviceCard
      title="Stati e Flag"
      icon={<Settings size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.checkboxGrid}>
        <Checkbox
          label="Status Ready D75_3_7"
          description="Indica se il dispositivo è pronto per l'uso"
          checked={formData.tatus_ready_d75_3_7}
          onChange={(checked) => onChange("tatus_ready_d75_3_7", checked)}
          disabled={isSaving}
          color="success"
        />
        <Checkbox
          label="Macchina Bloccata"
          description="Indica se la macchina è bloccata"
          checked={formData.status_Machine_Blocked}
          onChange={(checked) => onChange("status_Machine_Blocked", checked)}
          disabled={isSaving}
          color="danger"
        />
      </div>
    </DeviceCard>
  );
}
