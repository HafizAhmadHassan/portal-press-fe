import React from "react";
import { MapPin } from "lucide-react";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./GpsCoordsCard.module.scss";
import type { GpsDevice } from "@store_admin/gps/gps.types";

const toStr = (v: any) =>
  v !== null && v !== undefined && String(v).trim() ? String(v) : "N/A";

export const GpsCoordsCard: React.FC<{ device: GpsDevice }> = ({ device }) => {
  return (
    <DeviceCard title="Coordinate" icon={<MapPin size={18} />}>
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>gps_x (lat)</span>
          <span className={styles.infoValue}>{toStr(device.gps_x)}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>gps_y (lng)</span>
          <span className={styles.infoValue}>{toStr(device.gps_y)}</span>
        </div>
      </div>
    </DeviceCard>
  );
};
