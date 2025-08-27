import styles from "../../../../_styles/Sections.module.scss";
import { Shield } from "lucide-react";
import { Checkbox } from "@shared/checkbox/CheckBox.component";

export default function StatusInfo({
  formData,
  isLoading,
  handleInputChange,
}: any) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Shield className={styles.sectionIcon} />
        <h4 className={styles.sectionTitle}>Stati e Configurazioni</h4>
      </div>

      <div className={styles.sectionContent}>
        <div className={styles.privilegesGrid}>
          <Checkbox
            label="Device Pronto D75_3_7"
            description="Indica se il device è pronto per l'operazione D75_3_7"
            checked={formData.tatus_ready_d75_3_7}
            onChange={(checked) =>
              handleInputChange("tatus_ready_d75_3_7", checked)
            }
            disabled={isLoading}
            color="success"
          />

          <Checkbox
            label="Macchina Bloccata"
            description="Indica se la macchina è attualmente bloccata"
            checked={formData.status_Machine_Blocked}
            onChange={(checked) =>
              handleInputChange("status_Machine_Blocked", checked)
            }
            disabled={isLoading}
            color="warning"
          />
        </div>
      </div>
    </div>
  );
}
