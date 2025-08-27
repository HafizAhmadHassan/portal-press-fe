import styles from "../../../../_styles/Sections.module.scss";
import stylesDateHours from "./DateHours.module.scss";
import { Calendar, Clock } from "lucide-react";

export default function DateHoursInfo({
  formatDate,
  getRelativeTime,
  device,
}: {
  formatDate: any;
  getRelativeTime: any;
  device: any;
}) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Calendar className={styles.sectionIcon} />
        <h4 className={styles.sectionTitle}>Date e Orari</h4>
      </div>

      <div className={stylesDateHours.dateGrid}>
        <div className={stylesDateHours.dateCard}>
          <div className={stylesDateHours.dateCardHeader}>
            <Calendar className={stylesDateHours.dateIcon} />
            <span className={stylesDateHours.dateCardTitle}>
              Data Creazione
            </span>
          </div>
          <div className={stylesDateHours.dateCardContent}>
            <span className={stylesDateHours.dateValue}>
              {formatDate(device?.created_At)}
            </span>
            <span className={stylesDateHours.dateRelative}>
              {device?.created_At ? getRelativeTime(device?.created_At) : "N/A"}
            </span>
          </div>
        </div>

        <div className={stylesDateHours.dateCard}>
          <div className={stylesDateHours.dateCardHeader}>
            <Clock className={stylesDateHours.dateIcon} />
            <span className={stylesDateHours.dateCardTitle}>
              Ultimo Aggiornamento
            </span>
          </div>
          <div className={stylesDateHours.dateCardContent}>
            <span className={stylesDateHours.dateValue}>
              {formatDate(device?.updated_At)}
            </span>
            <span className={stylesDateHours.dateRelative}>
              {device?.updated_At
                ? getRelativeTime(device?.updated_At)
                : "Mai aggiornato"}
            </span>
          </div>
        </div>
      </div>

      <div className={stylesDateHours.availabilityGrid}>
        <div className={stylesDateHours.infoItem}>
          <span className={stylesDateHours.infoLabel}>Orario Inizio</span>
          <span className={stylesDateHours.infoValue}>
            {device?.start_Available || "Non specificato"}
          </span>
        </div>
        <div className={stylesDateHours.infoItem}>
          <span className={stylesDateHours.infoLabel}>Orario Fine</span>
          <span className={stylesDateHours.infoValue}>
            {device?.end_Available || "Non specificato"}
          </span>
        </div>
      </div>
    </div>
  );
}
