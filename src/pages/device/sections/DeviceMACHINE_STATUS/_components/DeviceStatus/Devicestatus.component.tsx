import React from "react";
import { Gauge, CheckCircle2 } from "lucide-react";
import styles from "./DeviceStatus.module.scss";

export type StatusItem =
  | { key: string; label: string; type: "boolean"; value: boolean }
  | { key: string; label: string; type: "number"; value: number; unit?: string }
  | { key: string; label: string; type: "text"; value: string };

export interface DeviceStatusProps {
  statusList: StatusItem[];
}

export default function DeviceStatus({ statusList }: DeviceStatusProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitle}>
          <Gauge size={16} />
          <span>Stato</span>
        </div>
      </div>

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
    </div>
  );
}

/** Util per numeri */
function formatNumber(n: number) {
  try {
    return new Intl.NumberFormat("it-IT", { maximumFractionDigits: 3 }).format(
      n
    );
  } catch {
    return String(n);
  }
}
