import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./Summary.module.scss";
import { CheckCircle, Shield, XCircle } from "lucide-react";

export default function Summary({ device }: { device: any }) {
  const isActive = device?.status === 1;
  const blocked =
    device?.status_Machine_Blocked ?? device?.status_Machine_Blocked ?? false;
  const ready =
    device?.status_READY_D75_3_7 ?? device?.tatus_ready_d75_3_7 ?? false;

  return (
    <DeviceCard title="Riassunto Stati" icon={<Shield />}>
      <div className={styles.statusList}>
        <div
          className={`${styles.statusItem} ${
            isActive ? styles.statusActive : styles.statusInactive
          }`}
        >
          {isActive ? (
            <CheckCircle className={styles.statusIcon} />
          ) : (
            <XCircle className={styles.statusIcon} />
          )}
          <span>Dispositivo {isActive ? "Attivo" : "Inattivo"}</span>
        </div>

        <div
          className={`${styles.statusItem} ${
            blocked ? styles.statusInactive : styles.statusActive
          }`}
        >
          {blocked ? (
            <XCircle className={styles.statusIcon} />
          ) : (
            <CheckCircle className={styles.statusIcon} />
          )}
          <span>Macchina {blocked ? "Bloccata" : "Libera"}</span>
        </div>

        <div
          className={`${styles.statusItem} ${
            ready ? styles.statusActive : styles.statusInactive
          }`}
        >
          {ready ? (
            <CheckCircle className={styles.statusIcon} />
          ) : (
            <XCircle className={styles.statusIcon} />
          )}
          <span>Status Ready {ready ? "Abilitato" : "Disabilitato"}</span>
        </div>
      </div>
    </DeviceCard>
  );
}
