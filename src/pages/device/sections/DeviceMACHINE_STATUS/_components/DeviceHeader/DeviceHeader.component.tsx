import React from "react";
import { AlertTriangle, Power, Wifi } from "lucide-react";
import styles from "./DeviceHeader.module.scss";

export type DeviceStatus = "online" | "offline" | "unknown";

interface Props {
  deviceName: string;
  deviceStatus: DeviceStatus;
  imageUrl?: string;
}

export default function DeviceHeader({
  deviceName,
  deviceStatus,
  imageUrl,
}: Props) {
  const statusBadge = {
    online: {
      label: "Online",
      className: styles.badgeOnline,
      icon: <Wifi size={14} />,
    },
    offline: {
      label: "Offline",
      className: styles.badgeOffline,
      icon: <Power size={14} />,
    },
    unknown: {
      label: "Sconosciuto",
      className: styles.badgeUnknown,
      icon: <AlertTriangle size={14} />,
    },
  }[deviceStatus];

  return (
    <div className={styles.header}>
      <div className={styles.titleWrap}>
        <h1 className={styles.title}>{deviceName}</h1>
        <span className={[styles.badge, statusBadge.className].join(" ")}>
          {statusBadge.icon}
          <span>{statusBadge.label}</span>
        </span>
      </div>

      {imageUrl ? (
        <div className={styles.heroImg}>
          <img
            src={imageUrl}
            alt={deviceName}
            onError={(e) =>
              ((e.target as HTMLImageElement).style.display = "none")
            }
          />
        </div>
      ) : null}
    </div>
  );
}
