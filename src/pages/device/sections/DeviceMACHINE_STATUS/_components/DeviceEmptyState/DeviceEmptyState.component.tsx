import React from "react";
import { AlertTriangle } from "lucide-react";
import styles from "./DeviceEmptyState.module.scss";

export function DeviceEmptyState() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitle}>
            <AlertTriangle size={16} />
            <span>Nessun device selezionato</span>
          </div>
        </div>
        <div style={{ padding: "1rem" }}>
          Apri un device dalla lista per vedere l’overview.
        </div>
      </div>
    </section>
  );
}
