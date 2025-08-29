import React from "react";
import { ZapIcon } from "lucide-react";
import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";
import { ModalDeviceDetails } from "@sections_admin/devicesList/_modals/ModalDeviceDetail/ModalDeviceDetail.component";
import styles from "./DevicesBoxHeader.module.scss";
import type { Device } from "@store_admin/devices/devices.types";

interface DevicesBoxHeaderProps {
  device: Device;
  isActive: boolean;
  getWasteColorVar: (wasteType: string | null | undefined) => string;
}

export const DevicesBoxHeader: React.FC<DevicesBoxHeaderProps> = ({
  device,
  isActive,
  getWasteColorVar,
}) => {
  return (
    <div className={styles.header}>
      <div
        className={`${styles.statusDot} ${
          isActive ? styles.isActive : styles.isInactive
        }`}
      />

      <div
        className={styles.wasteBadge}
        style={{
          backgroundColor: getWasteColorVar(device.waste),
          color: "var(--white)",
        }}
      >
        {device.customer_Name || "N/A"}
      </div>

      <div
        className={styles.wasteBadge}
        style={{
          backgroundColor: getWasteColorVar(device.waste),
          color: "var(--white)",
        }}
      >
        {device.waste || "N/A"}
      </div>

      <div className={styles.actions}>
        <ModalDeviceDetails
          device={device}
          triggerButton={
            <SimpleButton variant="ghost" size="sm" color="warning">
              <ZapIcon size={12} />
            </SimpleButton>
          }
        />
      </div>
    </div>
  );
};
