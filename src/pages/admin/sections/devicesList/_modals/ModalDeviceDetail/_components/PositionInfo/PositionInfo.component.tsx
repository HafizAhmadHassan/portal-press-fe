import styles from "../../../../_styles/Sections.module.scss";
import stylesPosition from "./PositionInfo.module.scss";
import { MapPin } from "lucide-react";

export default function PositionInfo({ device }: any) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <MapPin className={styles.sectionIcon} />
        <h4 className={styles.sectionTitle}>Informazioni di Ubicazione</h4>
      </div>

      <div className={stylesPosition.infoGrid}>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>Indirizzo</span>
          <span className={stylesPosition.infoValue}>
            {device?.street || device?.address || "Non specificato"}
          </span>
        </div>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>Città</span>
          <span className={stylesPosition.infoValue}>
            {device?.city || "Non specificata"}
          </span>
        </div>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>Provincia</span>
          <span className={stylesPosition.infoValue}>
            {device?.province || "Non specificata"}
          </span>
        </div>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>CAP</span>
          <span className={stylesPosition.infoValue}>
            {device?.postal_Code || device?.postalCode || "Non specificato"}
          </span>
        </div>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>Paese</span>
          <span className={stylesPosition.infoValue}>
            {device?.country || "Non specificato"}
          </span>
        </div>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>Municipalità</span>
          <span className={stylesPosition.infoValue}>
            {device?.municipality || "Non specificata"}
          </span>
        </div>
      </div>
    </div>
  );
}
