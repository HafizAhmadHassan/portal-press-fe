import React from "react";
import { Calendar, Clock } from "lucide-react";
import type { User } from "@store_admin/users/user.types";
import styles from "./DatesCard.module.scss";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";

function formatDate(dateString?: string | null) {
  if (!dateString) return "Mai";
  const date = new Date(dateString);
  return date.toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getRelativeTime(dateString?: string | null) {
  if (!dateString) return null;
  const d = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - d.getTime();
  const diffInDays = Math.floor(diffInMs / 86400000);
  if (diffInDays === 0) return "Oggi";
  if (diffInDays === 1) return "Ieri";
  if (diffInDays < 7) return `${diffInDays} giorni fa`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} settimane fa`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} mesi fa`;
  return `${Math.floor(diffInDays / 365)} anni fa`;
}

export default function DatesCard({ user }: { user: User }) {
  return (
    <DeviceCard
      title="Date e Accessi"
      icon={<Calendar size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.dateGrid}>
        <div className={styles.dateCard}>
          <div className={styles.dateCardHeader}>
            <Calendar className={styles.dateIcon} />
            <span className={styles.dateCardTitle}>Data Creazione</span>
          </div>
          <div className={styles.dateCardContent}>
            <span className={styles.dateValue}>
              {formatDate(user.date_joined)}
            </span>
            <span className={styles.dateRelative}>
              {getRelativeTime(user.date_joined)}
            </span>
          </div>
        </div>

        <div className={styles.dateCard}>
          <div className={styles.dateCardHeader}>
            <Clock className={styles.dateIcon} />
            <span className={styles.dateCardTitle}>Ultimo Login</span>
          </div>
          <div className={styles.dateCardContent}>
            <span className={styles.dateValue}>
              {formatDate(user.last_login)}
            </span>
            <span className={styles.dateRelative}>
              {user.last_login
                ? getRelativeTime(user.last_login)
                : "Mai effettuato login"}
            </span>
          </div>
        </div>
      </div>
    </DeviceCard>
  );
}
