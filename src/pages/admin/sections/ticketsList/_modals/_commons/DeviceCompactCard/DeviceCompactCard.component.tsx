import React from "react";
import styles from "./DeviceCompactCard.module.scss";
import type { Device } from "@store_admin/devices/devices.types";
import { FileText } from "lucide-react";

type Props = {
  device: Device;
  customer?: string;
  error?: string;
};

const DeviceCompactCard: React.FC<Props> = ({ device, customer, error }) => {
  return (
    <section className={styles.card}>
      <div className={styles.grid}>
        <div className={styles.item}>
          <strong>Customer:</strong>{" "}
          <span className={styles.readonlyChip}>{customer || "N/D"}</span>
        </div>
        <div className={styles.item}>
          <strong>Machine ID:</strong> {device.id}
        </div>
        {device.city && (
          <div className={styles.item}>
            <strong>City:</strong> {device.city}
          </div>
        )}
      </div>

      {error && (
        <div className={styles.error}>
          <FileText className={styles.errorIcon} />
          {error}
        </div>
      )}
    </section>
  );
};

export default DeviceCompactCard;
