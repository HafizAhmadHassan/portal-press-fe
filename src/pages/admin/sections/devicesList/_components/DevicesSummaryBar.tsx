import React from "react";
import type { Device } from "@store_admin/devices/devices.types";
import styles from "@sections_admin/devicesList/_styles/DevicesSummaryBar.module.scss";

interface DevicesSummaryBarProps {
  devices: Device[];
  statusFilter?: "tutti" | "attivi" | "disattivati";
  className?: string;
}

interface StatCardProps {
  number: number;
  label: string;
  variant:
    | "statCard--total"
    | "statCard--active"
    | "statCard--inactive"
    | "statCard--blocked"
    | "statCard--ready";
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  number,
  label,
  variant,
  className = "",
}) => (
  <div className={`${styles.statCard} ${styles[variant]} ${className}`}>
    <div className={styles.statNumber}>{number}</div>
    <div className={styles.statLabel}>{label}</div>
    {/* <div className={styles.statPercentage}>{percentage}%</div> */}
  </div>
);

export const DevicesSummaryBar: React.FC<DevicesSummaryBarProps> = ({
  devices,
  className = "",
}) => {
  const totalDevices = devices.length;
  const activeDevices = devices.filter((d) => d.status === 1).length;
  const inactiveDevices = devices.filter((d) => d.status === 0).length;
  const blockedDevices = devices.filter(
    (d) => d.status_Machine_Blocked === true
  ).length;
  const readyDevices = devices.filter(
    (d) => d.tatus_ready_d75_3_7 === true
  ).length;

  return (
    <div className={`${styles.devicesSummary} ${className}`}>
      {/* Mobile */}
      <div className={styles.mobileLayout}>
        <div className={styles.mobileHeader}>
          <h3 className={styles.mobileTitle}>Dashboard Dispositivi</h3>
          <div className={styles.mobileTotal}>
            <span className={styles.mobileTotalNumber}>{totalDevices}</span>
            <span className={styles.mobileTotalLabel}>dispositivi totali</span>
          </div>
        </div>

        <div className={styles.mobileStats}>
          <StatCard
            number={activeDevices}
            label="Attivi"
            variant="statCard--active"
          />
          <StatCard
            number={inactiveDevices}
            label="Inattivi"
            variant="statCard--inactive"
          />
          <StatCard
            number={blockedDevices}
            label="Bloccati"
            variant="statCard--blocked"
          />
          <StatCard
            number={readyDevices}
            label="Pronti"
            variant="statCard--ready"
          />
        </div>
      </div>

      {/* Desktop */}
      <div className={styles.desktopLayout}>
        <div className={styles.statsSection}>
          <StatCard
            number={totalDevices}
            label="Totali"
            variant="statCard--total"
          />

          <div className={styles.statDivider} />

          <StatCard
            number={activeDevices}
            label="Attivi"
            variant="statCard--active"
          />
          <StatCard
            number={inactiveDevices}
            label="Inattivi"
            variant="statCard--inactive"
          />

          <div className={styles.statDivider} />

          <StatCard
            number={blockedDevices}
            label="Bloccati"
            variant="statCard--blocked"
          />
          <StatCard
            number={readyDevices}
            label="Pronti"
            variant="statCard--ready"
          />
        </div>
      </div>
    </div>
  );
};
