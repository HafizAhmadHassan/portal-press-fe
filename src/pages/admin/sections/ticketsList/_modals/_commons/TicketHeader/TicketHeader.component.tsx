import React from "react";
import styles from "./TicketHeader.module.scss";
import { Grid, Tag, Ticket as TicketIcon } from "lucide-react";
import type { Device } from "@store_admin/devices/devices.types";

type Props = {
  device?: Partial<Device> | null;
  ticketId?: number | string;
  /** "open" (default) | "close" per cambiare tag e icona */
  mode?: "open" | "close";
};

const TicketHeader: React.FC<Props> = ({ device, ticketId, mode = "open" }) => {
  const title = device?.machine_Name || `Ticket #${ticketId || ""}`;
  const subtitle = `${
    device?.customer || (device as any)?.customer_Name || "Cliente N/D"
  } • ${device?.city || "Luogo N/D"}`;

  const TagIcon = mode === "open" ? Tag : TicketIcon;
  const tagText = mode === "open" ? "APERTURA TICKET" : "CHIUSURA TICKET";

  return (
    <div className={styles.header}>
      <div className={styles.headerMain}>
        <div className={styles.headerLeft}>
          <div className={styles.deviceIcon}>
            <Grid />
          </div>
          <div className={styles.headerInfo}>
            <h3 className={styles.headerTitle}>{title}</h3>
            <div className={styles.headerSubtitle}>{subtitle}</div>
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.headerTag} data-mode={mode}>
            <TagIcon size={14} />
            {tagText}
          </div>
          <div className={styles.headerDate}>
            {new Date().toLocaleDateString("it-IT")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketHeader;
