import React from "react";
import { MapPinIcon, WifiIcon } from "lucide-react";
import styles from "./DevicesBoxContent.module.scss";
import type { Device } from "@store_admin/devices/devices.types";

interface DevicesBoxContentProps {
  device: Device;
  isActive: boolean;
  imageUrl: string;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  getFullAddress: () => string;
}

export const DevicesBoxContent: React.FC<DevicesBoxContentProps> = ({
  device,
  isActive,
  imageUrl,
  onImageError,
  getFullAddress,
}) => {
  return (
    <div className={styles.content}>
      {/* Thumbnail del dispositivo */}
      <div className={styles.deviceThumb}>
        <img
          src={imageUrl}
          alt="Device"
          onError={onImageError}
          loading="lazy"
        />
        <div
          className={`${styles.wifiIndicator} ${
            isActive ? styles.isActive : styles.isInactive
          }`}
        >
          <WifiIcon size={10} />
        </div>
      </div>

      {/* Informazioni del dispositivo */}
      <div className={styles.deviceInfo}>
        <div className={styles.location}>
          <MapPinIcon size={12} />
          <span>{getFullAddress()}</span>
        </div>

        <div className={styles.technical}>
          {device.ip_Router && (
            <span className={styles.techDetail}>IP: {device.ip_Router}</span>
          )}
          {device.codice_Gps && (
            <span className={styles.techDetail}>GPS: {device.codice_Gps}</span>
          )}
        </div>

        <div
          className={`${styles.statusText} ${
            isActive ? styles.isActive : styles.isInactive
          }`}
        >
          {isActive ? "Operativo" : "Non Operativo"}
        </div>
      </div>
    </div>
  );
};
