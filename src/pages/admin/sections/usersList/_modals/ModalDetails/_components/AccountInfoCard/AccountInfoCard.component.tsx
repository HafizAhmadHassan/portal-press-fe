import React from "react";
import { Shield } from "lucide-react";
import type { User } from "@store_admin/users/user.types";
import styles from "./AccountInfoCard.module.scss";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";

export default function AccountInfoCard({ user }: { user: User }) {
  return (
    <DeviceCard
      title="Informazioni Account"
      icon={<Shield size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>ID Utente</span>
          <span className={styles.infoValue}>#{user.id}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Username</span>
          <span className={styles.infoValue}>@{user.username}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Email</span>
          <span className={styles.infoValue}>
            {user.email ? (
              <a href={`mailto:${user.email}`} className={styles.emailLink}>
                {user.email}
              </a>
            ) : (
              "Nessuna email"
            )}
          </span>
        </div>
      </div>
    </DeviceCard>
  );
}
