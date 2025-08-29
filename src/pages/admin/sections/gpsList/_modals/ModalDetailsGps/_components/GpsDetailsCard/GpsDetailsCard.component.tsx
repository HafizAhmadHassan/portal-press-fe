import React from "react";
import { Satellite } from "lucide-react";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./GpsDetailsCard.module.scss";
import type { GpsDevice } from "@store_admin/gps/gps.types";

const toStr = (v: any) =>
  v !== null && v !== undefined && String(v).trim() ? String(v) : "N/A";

export const GpsDetailsCard: React.FC<{ device: GpsDevice }> = ({ device }) => {
  return (
    <DeviceCard title="Dettagli dispositivo" icon={<Satellite size={18} />}>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Codice</span>
          <span className={styles.infoValue}>{toStr(device.codice)}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Cliente</span>
          <span className={styles.infoValue}>
            {toStr(device.customer_Name)}
          </span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Rifiuto</span>
          <span className={styles.infoValue}>{toStr(device.waste)}</span>
        </div>

        <div className={styles.infoItemWide}>
          <span className={styles.infoLabel}>Indirizzo</span>
          <span className={styles.infoValue}>{toStr(device.address)}</span>
        </div>

        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Comune</span>
          <span className={styles.infoValue}>{toStr(device.municipility)}</span>
        </div>
      </div>
    </DeviceCard>
  );
};
