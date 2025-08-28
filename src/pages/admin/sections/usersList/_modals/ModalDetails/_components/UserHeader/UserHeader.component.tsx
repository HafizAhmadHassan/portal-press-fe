import React from "react";
import { CheckCircle, XCircle, Settings, Crown } from "lucide-react";
import type { User } from "@store_admin/users/user.types";
import { RoleBadge } from "@shared/roleBadge/RoleBadge.tsx";
import { Avatar } from "@shared/avatar/Avatar.compoent.tsx";
import styles from "./UserHeader.module.scss";

type Props = { user: User };

export default function UserHeader({ user }: Props) {
  const displayName =
    user.full_name ||
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    user.username;

  return (
    <div className={styles.userHeader}>
      <div className={styles.avatarSection}>
        <Avatar user={user} />
        <div className={styles.statusIndicator}>
          {user.is_active ? (
            <CheckCircle className={styles.statusIconActive} />
          ) : (
            <XCircle className={styles.statusIconInactive} />
          )}
        </div>
      </div>

      <div className={styles.userMainInfo}>
        <h3 className={styles.userName}>{displayName}</h3>
        <p className={styles.userEmail}>{user.email || "Nessuna email"}</p>
        <p className={styles.userUsername}>@{user.username}</p>

        <div className={styles.userBadges}>
          <RoleBadge user={user} />
          <span
            className={`${styles.statusBadge} ${
              user.is_active ? styles.statusActive : styles.statusInactive
            }`}
          >
            {user.is_active ? "Attivo" : "Inattivo"}
          </span>
          {user.is_staff && (
            <span className={styles.staffBadge}>
              <Settings className={styles.badgeIcon} />
              Staff
            </span>
          )}
          {user.is_superuser && (
            <span className={styles.superuserBadge}>
              <Crown className={styles.badgeIcon} />
              Super Admin
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
