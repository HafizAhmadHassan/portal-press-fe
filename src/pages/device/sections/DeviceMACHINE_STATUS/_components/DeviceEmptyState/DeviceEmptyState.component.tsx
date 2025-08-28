import React from "react";
import { AlertTriangle } from "lucide-react";
import styles from "./DeviceEmptyState.module.scss";
import DeviceCard from "../../../_components/DeviceCard/DeviceCard.component";

export default function EmptyState() {
  return (
    <section className={styles.wrapper}>
      <DeviceCard
        title={
          <>
            <AlertTriangle size={16} />
            <span>Nessun device selezionato</span>
          </>
        }
      >
        <div className={styles.body}>
          Apri un device dalla lista per vedere l’overview.
        </div>
      </DeviceCard>
    </section>
  );
}
