import React from "react";
import { Gauge, CheckCircle2, XCircle } from "lucide-react";

import styles from "./DeviceStatus.module.scss";
import DeviceCard from "../../../_components/DeviceCard/DeviceCard.component";

export type StatusItem =
  | { key: string; label: string; type: "boolean"; value: boolean }
  | { key: string; label: string; type: "number"; value: string; unit?: string }
  | {
      unit: any;
      key: string;
      label: string;
      type: "text";
      value: string;
    };

export interface DeviceStatusProps {
  statusList: /* StatusItem[] */ any;
  isLoading?: boolean;
}

export default function DeviceStatus({
  statusList,
  isLoading,
}: DeviceStatusProps) {
  if (isLoading) {
    return (
      <DeviceCard
        title="Stato"
        icon={<Gauge size={16} />}
        bodyClassName={styles.cardBody}
      >
        <div className={styles.statGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={styles.statItem}>
              <div className={styles.statLabel}>Caricamento...</div>
              <div className={[styles.badge, styles.badgeInfo].join(" ")}>
                <span>---</span>
              </div>
            </div>
          ))}
        </div>
      </DeviceCard>
    );
  }

  if (!statusList.length) {
    return (
      <DeviceCard
        title="Stato"
        icon={<Gauge size={16} />}
        bodyClassName={styles.cardBody}
      >
        <div className={styles.statGrid}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Nessun dato disponibile</div>
            <div className={[styles.badge, styles.badgeInfo].join(" ")}>
              <span>N/A</span>
            </div>
          </div>
        </div>
      </DeviceCard>
    );
  }

  return (
    <DeviceCard
      title="Stato"
      icon={<Gauge size={16} />}
      bodyClassName={styles.cardBody}
    >
      <div className={styles.statGrid}>
        {statusList.map((s) => (
          <div key={s.key} className={styles.statItem}>
            <div className={styles.statLabel}>{s.label}</div>
            {s.type === "boolean" ? (
              <div
                className={[
                  styles.badge,
                  s.value === true ? styles.badgeTrue : styles.badgeFalse,
                ].join(" ")}
              >
                {s.value ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                <span>{s.value ? "True" : "False"}</span>
              </div>
            ) : s.type === "text" ? (
              <div className={[styles.badge, styles.badgeNumber].join(" ")}>
                <span>
                  {s.value}
                  {s.unit ? ` ${s.unit}` : ""}
                </span>
              </div>
            ) : (
              <div className={[styles.badge, styles.badgeInfo].join(" ")}>
                <span>{s.value}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </DeviceCard>
  );
}
