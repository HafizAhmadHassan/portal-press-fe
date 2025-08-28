import React from "react";
import { User as UserIcon } from "lucide-react";
import type { User } from "@store_admin/users/user.types";
import styles from "./PersonalInfoCard.module.scss";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";

export default function PersonalInfoCard({ user }: { user: User }) {
  return (
    <DeviceCard
      title="Informazioni Personali"
      icon={<UserIcon size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.infoGrid}>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Nome</span>
          <span className={styles.infoValue}>
            {user.firstName || "Non specificato"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Cognome</span>
          <span className={styles.infoValue}>
            {user.lastName || "Non specificato"}
          </span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoLabel}>Nome Completo</span>
          <span className={styles.infoValue}>
            {user.fullName || "Non specificato"}
          </span>
        </div>
      </div>
    </DeviceCard>
  );
}
