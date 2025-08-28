import React from "react";
import { Calendar, Clock } from "lucide-react";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./DatesCard.module.scss";
import { formatDateTime, relativeTime } from "../../_utils/ticketHelpers";
import type { TicketWithDevice } from "../../_types/TicketWithDevice.types";

type Props = { ticket: TicketWithDevice };

const DatesCard: React.FC<Props> = ({ ticket }) => {
  const openedAt =
    (ticket as any)?.date_Time ||
    (ticket as any)?.date_time ||
    (ticket as any)?.created_At;

  const updatedAt = (ticket as any)?.updated_At;

  return (
    <DeviceCard
      title="Date"
      icon={<Calendar size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Calendar className={styles.icon} />
            <span className={styles.title}>Apertura</span>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.value}>{formatDateTime(openedAt)}</span>
            <span className={styles.relative}>{relativeTime(openedAt)}</span>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Clock className={styles.icon} />
            <span className={styles.title}>Ultimo Aggiornamento</span>
          </div>
          <div className={styles.cardContent}>
            <span className={styles.value}>{formatDateTime(updatedAt)}</span>
            <span className={styles.relative}>{relativeTime(updatedAt)}</span>
          </div>
        </div>
      </div>
    </DeviceCard>
  );
};

export default DatesCard;
