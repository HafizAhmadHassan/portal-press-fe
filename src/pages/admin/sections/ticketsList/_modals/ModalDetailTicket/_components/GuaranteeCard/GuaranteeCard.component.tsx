import React from "react";
import { Shield } from "lucide-react";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./GuaranteeCard.module.scss";

type Props = {
  items: string[];
};

const GuaranteeCard: React.FC<Props> = ({ items }) => {
  return (
    <DeviceCard
      title="Garanzia"
      icon={<Shield size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.list}>
        {items.map((g, idx) => (
          <span key={`${g}-${idx}`} className={styles.chip}>
            <Shield className={styles.icon} />
            {g}
          </span>
        ))}
      </div>
    </DeviceCard>
  );
};

export default GuaranteeCard;
