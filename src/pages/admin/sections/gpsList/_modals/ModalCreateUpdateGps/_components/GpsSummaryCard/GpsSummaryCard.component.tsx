import React from "react";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import { ClipboardList } from "lucide-react";
import styles from "./GpsSummaryCard.module.scss";

type Props = {
  codice: string;
  customer_Name: string;
  waste: string;
  gps_x: string | number;
  gps_y: string | number;
  address: string;
  municipility: string;
};

const GpsSummaryCard: React.FC<Props> = ({
  codice,
  customer_Name,
  waste,
  gps_x,
  gps_y,
  address,
  municipility,
}) => {
  return (
    <DeviceCard
      title="Riepilogo"
      icon={<ClipboardList size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.label}>Codice GPS</span>
          <span className={styles.value}>{codice || "—"}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Cliente</span>
          <span className={styles.value}>{customer_Name || "—"}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Rifiuto</span>
          <span className={styles.value}>{waste || "—"}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>gps_x</span>
          <span className={styles.value}>{gps_x?.toString() || "—"}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>gps_y</span>
          <span className={styles.value}>{gps_y?.toString() || "—"}</span>
        </div>
        <div className={styles.itemWide}>
          <span className={styles.label}>Indirizzo</span>
          <span className={styles.value}>
            {address || "—"} {municipility ? `• ${municipility}` : ""}
          </span>
        </div>
      </div>
    </DeviceCard>
  );
};

export default GpsSummaryCard;
