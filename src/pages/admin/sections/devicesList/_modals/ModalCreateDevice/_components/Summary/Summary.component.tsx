import styles from "./Summary.module.scss";
import { CheckCircle } from "lucide-react";

export default function Summary({ formData }: any) {
  return (
    <div className={styles.summarySection}>
      <div className={styles.summaryHeader}>
        <CheckCircle className={styles.summaryIcon} />
        <h4 className={styles.summaryTitle}>Riassunto Device</h4>
      </div>

      <div className={styles.sectionContent}>
        <div className={styles.summaryContent}>
          <div className={styles.summaryItem}>
            <strong>Nome Macchina:</strong>{" "}
            {formData.machineName || "Non specificato"}
          </div>
          <div className={styles.summaryItem}>
            <strong>Stato:</strong>{" "}
            {formData.status === 1 ? "Attivo" : "Inattivo"}
          </div>
          <div className={styles.summaryItem}>
            <strong>Tipo Rifiuto:</strong> {formData.waste || "Non specificato"}
          </div>
          <div className={styles.summaryItem}>
            <strong>Posizione:</strong>{" "}
            {formData.address ||
              `${formData.street} ${formData.city}`.trim() ||
              "Non specificata"}
          </div>
          <div className={styles.summaryItem}>
            <strong>Cliente:</strong>{" "}
            {formData.customerName || formData.customer || "Non specificato"}
          </div>
          <div className={styles.summaryItem}>
            <strong>IP Router:</strong>{" "}
            {formData.ip_Router || "Non specificato"}
          </div>
          <div className={styles.summaryItem}>
            <strong>Stati:</strong>
            {formData.statusReadyD75_3_7 && " Pronto D75_3_7"}
            {formData.statusMachineBlocked && " Bloccato"}
            {!formData.statusReadyD75_3_7 &&
              !formData.statusMachineBlocked &&
              " Nessuno stato particolare"}
          </div>
        </div>
      </div>
    </div>
  );
}
