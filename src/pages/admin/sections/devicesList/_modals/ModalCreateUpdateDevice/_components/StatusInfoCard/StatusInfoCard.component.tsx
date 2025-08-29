import React from "react";
import { Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { Checkbox } from "@shared/checkbox/CheckBox.component";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./StatusInfoCard.module.scss";

type Values = {
  status_ready_d75_3_7: boolean;
  status_Machine_Blocked: boolean;
};

type Props = {
  values: Values;
  disabled?: boolean;
  onChange: (field: keyof Values, value: boolean) => void;
};

export default function StatusInfoCard({ values, disabled, onChange }: Props) {
  return (
    <DeviceCard
      title="Stati e Configurazioni"
      icon={<Shield size={18} />}
      info={<span className={styles.statusBadge}>Stati</span>}
      bodyClassName={styles.body}
    >
      <div className={styles.checkboxGrid}>
        <Checkbox
          label="Device Pronto D75_3_7"
          description="Indica se il device è pronto per l'operazione D75_3_7"
          checked={values.status_ready_d75_3_7}
          onChange={(checked) => onChange("status_ready_d75_3_7", checked)}
          disabled={disabled}
          color="success"
          icon={<CheckCircle size={16} />}
        />

        <Checkbox
          label="Macchina Bloccata"
          description="Indica se la macchina è attualmente bloccata"
          checked={values.status_Machine_Blocked}
          onChange={(checked) => onChange("status_Machine_Blocked", checked)}
          disabled={disabled}
          color="warning"
          icon={<AlertTriangle size={16} />}
        />
      </div>
    </DeviceCard>
  );
}
