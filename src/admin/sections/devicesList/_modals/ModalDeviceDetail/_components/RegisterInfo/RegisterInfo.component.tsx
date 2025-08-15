import styles from '../../../../_styles/Sections.module.scss';
import stylesRegister from './RegisterInfo.module.scss';
import { Badge } from 'lucide-react';

export default function RegisterInfo({ device }: { device: any }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Badge className={styles.sectionIcon} />
        <h4 className={styles.sectionTitle}>Codici e Matricole</h4>
      </div>

      <div className={stylesRegister.matricoleGrid}>
        <div className={stylesRegister.matricoleItem}>
          <div className={stylesRegister.matricoleHeader}>
            <Badge className={stylesRegister.matricoleIcon} />
            <span className={stylesRegister.matricoleTitle}>Matricola BTE</span>
          </div>
          <span className={stylesRegister.matricoleValue}>{device?.matricola_bte || 'N/A'}</span>
        </div>

        <div className={stylesRegister.matricoleItem}>
          <div className={stylesRegister.matricoleHeader}>
            <Badge className={stylesRegister.matricoleIcon} />
            <span className={stylesRegister.matricoleTitle}>Matricola KGN</span>
          </div>
          <span className={stylesRegister.matricoleValue}>{device?.matricola_kgn || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
}
