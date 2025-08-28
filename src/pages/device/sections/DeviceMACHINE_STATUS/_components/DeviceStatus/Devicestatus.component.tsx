import React from "react";
import { Gauge, CheckCircle2 } from "lucide-react";

import styles from "./DeviceStatus.module.scss";
import DeviceCard from "../../../_components/DeviceCard/DeviceCard.component";
import { formatNumber } from "@root/utils/formatNumber";

export type StatusItem =
  | { key: string; label: string; type: "boolean"; value: boolean }
  | { key: string; label: string; type: "number"; value: number; unit?: string }
  | { key: string; label: string; type: "text"; value: string };

export interface DeviceStatusProps {
  statusList: StatusItem[];
}

export default function DeviceStatus({ statusList }: DeviceStatusProps) {
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
                  s.value ? styles.badgeTrue : styles.badgeFalse,
                ].join(" ")}
              >
                <CheckCircle2 size={12} />
                <span>{s.value ? "True" : "False"}</span>
              </div>
            ) : s.type === "number" ? (
              <div className={[styles.badge, styles.badgeNumber].join(" ")}>
                <span>
                  {formatNumber(s.value)}
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
