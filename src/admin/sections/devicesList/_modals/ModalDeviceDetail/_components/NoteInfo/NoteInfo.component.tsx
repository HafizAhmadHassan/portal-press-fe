import styles from '../../../../_styles/Sections.module.scss';
import stylesNote from './NoteInfo.module.scss';
import { Settings } from 'lucide-react';

export default function NoteInfo({ device }: { device: any }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Settings className={styles.sectionIcon} />
        <h4 className={styles.sectionTitle}>Note</h4>
      </div>

      <div className={stylesNote.notesContainer}>
        <p className={stylesNote.notesText}>{device?.note}</p>
      </div>
    </div>
  );
}
