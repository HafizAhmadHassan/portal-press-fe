import React from "react";
import { FileText } from "lucide-react";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./DescriptionsCard.module.scss";

type Props = {
  title: string;
  text: string;
};

const DescriptionsCard: React.FC<Props> = ({ title, text }) => {
  return (
    <DeviceCard title={title} icon={<FileText size={18} />}>
      <div className={styles.textBlock}>
        <pre className={styles.pre}>{text}</pre>
      </div>
    </DeviceCard>
  );
};

export default DescriptionsCard;
