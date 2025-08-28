import React from "react";
import { Hash, MapPin, User as UserIcon } from "lucide-react";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./SummaryCard.module.scss";
import type { TicketWithDevice } from "../../_types/TicketWithDevice.types";

type Props = { ticket: TicketWithDevice };

const SummaryCard: React.FC<Props> = ({ ticket }) => {
  const dev = ticket?.device || {};
  const customer =
    (dev as any)?.customer ??
    (dev as any)?.customer_Name ??
    (ticket as any)?.customer ??
    "N/D";
  const machineId =
    (ticket as any)?.machine ?? (ticket as any)?.device_id ?? "N/D";
  const machineName = (dev as any)?.machine_Name;
  const place =
    [(dev as any)?.city, (dev as any)?.province].filter(Boolean).join(", ") ||
    null;

  return (
    <DeviceCard
      title="Riepilogo"
      icon={<UserIcon size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.grid}>
        <div className={styles.item}>
          <span className={styles.label}>ID Ticket</span>
          <span className={styles.value}>
            <Hash size={12} style={{ marginRight: 6 }} />
            {ticket.id}
          </span>
        </div>

        <div className={styles.item}>
          <span className={styles.label}>Cliente</span>
          <span className={styles.value}>{customer}</span>
        </div>

        <div className={styles.item}>
          <span className={styles.label}>Machine</span>
          <span className={styles.value}>
            {machineName ? `${machineName} (#${machineId})` : `#${machineId}`}
          </span>
        </div>

        {place && (
          <div className={styles.item}>
            <span className={styles.label}>Luogo</span>
            <span className={styles.value}>
              <MapPin size={12} style={{ marginRight: 6 }} />
              {place}
            </span>
          </div>
        )}
      </div>
    </DeviceCard>
  );
};

export default SummaryCard;
