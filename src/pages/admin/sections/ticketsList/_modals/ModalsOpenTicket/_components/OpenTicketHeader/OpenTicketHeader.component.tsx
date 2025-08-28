import React from "react";
import { Grid, Tag } from "lucide-react";
import styles from "./OpenTicketHeader.module.scss";
import type { Device } from "@store_admin/devices/devices.types";

type Props = {
  device: Device;
};

const OpenTicketHeader: React.FC<Props> = ({ device }) => {
  return (
    <header className={styles.header}>
      <div className={styles.main}>
        <div className={styles.left}>
          <div className={styles.deviceIcon}>
            <Grid />
          </div>
          <div className={styles.info}>
            <h3 className={styles.title}>{device.machine_Name}</h3>
            <div className={styles.subtitle}>
              {device.customer || "Cliente N/D"} • {device.city || "Luogo N/D"}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.tag}>
            <Tag size={14} />
            APERTURA TICKET
          </div>
          <div className={styles.date}>
            {new Date().toLocaleDateString("it-IT")}
          </div>
        </div>
      </div>
    </header>
  );
};

export default OpenTicketHeader;
