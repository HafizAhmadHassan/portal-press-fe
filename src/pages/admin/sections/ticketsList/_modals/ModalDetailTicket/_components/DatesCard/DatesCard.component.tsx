import React from "react";
import { Calendar, Clock } from "lucide-react";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./DatesCard.module.scss";
import { formatDateTime, relativeTime } from "../../_utils/ticketHelpers";

import { DeviceFormGrid } from "@root/pages/device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";
import type { TicketWithDevice } from "@root/pages/admin/core/store/tickets/hooks/useTicketWithDevices";

type Props = { ticket: TicketWithDevice };

const DatesCard: React.FC<Props> = ({ ticket }) => {
  const openedAt =
    (ticket as any)?.date_Time ||
    (ticket as any)?.date_time ||
    (ticket as any)?.created_At;

  const updatedAt = (ticket as any)?.updated_At;

  return (
    <DeviceCard title="Date" icon={<Calendar size={18} />}>
      <DeviceFormGrid>
        <DeviceCard title="Apertura" icon={<Calendar size={12} />}>
          <span className={styles.value}>{formatDateTime(openedAt)}</span>
          <span className={styles.relative}>{relativeTime(openedAt)}</span>
        </DeviceCard>
        <DeviceCard title="Chiusura" icon={<Clock size={12} />}>
          <span className={styles.value}>{formatDateTime(updatedAt)}</span>
          <span className={styles.relative}>{relativeTime(updatedAt)}</span>
        </DeviceCard>
      </DeviceFormGrid>
    </DeviceCard>
  );
};

export default DatesCard;
