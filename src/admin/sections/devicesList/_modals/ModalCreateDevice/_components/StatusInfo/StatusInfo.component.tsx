import styles from '../../../../_styles/Sections.module.scss';
import { Shield } from 'lucide-react';
import { Checkbox } from '@shared/checkbox/CheckBox.component';

export default function StatusInfo({ formData, isLoading, handleInputChange }: any) {
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
          checked={formData.statusReadyD75_3_7}
          onChange={(checked) => handleInputChange('statusReadyD75_3_7', checked)}
          disabled={isLoading}
          color="success"
        />

        <Checkbox
          label="Macchina Bloccata"
          description="Indica se la macchina è attualmente bloccata"
          checked={formData.statusMachineBlocked}
          onChange={(checked) => handleInputChange('statusMachineBlocked', checked)}
          disabled={isLoading}
          color="warning"
        />
      </div>
      </div>
    </div>
  );
}
