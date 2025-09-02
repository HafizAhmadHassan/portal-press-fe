import React from "react";
import { Hash, MapPin, User as UserIcon } from "lucide-react";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./SummaryCard.module.scss";

import { DeviceFormGrid } from "@root/pages/device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";

type Props = { ticket: any };

const SummaryCard: React.FC<Props> = ({ ticket }) => {
  const dev = ticket?.device;
  const customer = ticket.customer_Name ?? "N/D";
  const machineId = ticket.machine ?? ticket.device_id ?? "N/D";
  const machineName = dev?.machine_Name;
  const place = [dev?.city, dev?.province].filter(Boolean).join(", ") || null;

  return (
    <DeviceCard title="Riepilogo" icon={<UserIcon size={18} />}>
      <DeviceFormGrid>
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
      </DeviceFormGrid>
    </DeviceCard>
  );
};

export default SummaryCard;
