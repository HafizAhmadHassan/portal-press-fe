import React from "react";
import { CheckCircle, XCircle, Monitor, Shield, Badge } from "lucide-react";
import styles from "./TicketHeader.module.scss";
import type { TicketWithDevice } from "../../../../_types/TicketWithDevice.types";
import { isClosed } from "../../_utils/ticketHelpers";

type Props = { ticket: TicketWithDevice };

const TicketHeader: React.FC<Props> = ({ ticket }) => {
  const dev = ticket?.device;
  const statusClosed = isClosed(ticket);
  const customer = ticket.customer_Name ?? "N/D";
  const machineId = ticket.machine ?? "N/D";
  const machineName = dev?.machine_Name;

  return (
    <div className={styles.header}>
      <div className={styles.iconSection}>
        <div className={styles.iconCircle}>
          <Monitor className={styles.headerIcon} />
        </div>
        <div className={styles.statusIndicator}>
          {statusClosed ? (
            <CheckCircle className={styles.statusIconActive} />
          ) : (
            <XCircle className={styles.statusIconInactive} />
          )}
        </div>
      </div>

      <div className={styles.mainInfo}>
        <h3 className={styles.title}>
          Ticket #{ticket.id}
          {machineName ? ` – ${machineName}` : ""}
        </h3>
        <p className={styles.subTitle}>
          {customer} • {(dev as any)?.city || "Luogo N/D"}
        </p>

        <div className={styles.badgesRow}>
          <span
            className={`${styles.statusBadge} ${
              statusClosed ? styles.statusClosed : styles.statusOpen
            }`}
          >
            {statusClosed ? "Chiuso (2)" : "Aperto (1)"}
          </span>

          {(dev as any)?.ip_Router && (
            <span className={styles.infoBadge}>
              <Shield className={styles.badgeIcon} />
              IP: {(dev as any).ip_Router}
            </span>
          )}

          {(dev as any)?.waste && (
            <span className={styles.infoBadge}>
              <Badge className={styles.badgeIcon} />
              {(dev as any).waste}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketHeader;
