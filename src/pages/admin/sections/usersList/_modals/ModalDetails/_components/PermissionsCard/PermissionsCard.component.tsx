import React from "react";
import { Badge, Shield, Users } from "lucide-react";

import type { User } from "@store_admin/users/user.types";
import { UserRoleLabels } from "@utils/constants/userRoles.ts";
import styles from "./PermissionsCard.module.scss";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";

export default function PermissionsCard({ user }: { user: User }) {
  const hasPerms = !!user.permissions?.length;

  return (
    <DeviceCard
      title="Permessi e Ruoli"
      icon={<Badge size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.permissionsContainer}>
        {hasPerms ? (
          <div className={styles.permissionsList}>
            {user.permissions!.map((permission, idx) => (
              <div
                key={`${permission}-${idx}`}
                className={styles.permissionChip}
              >
                <Shield className={styles.permissionIcon} />
                {UserRoleLabels[permission] || permission}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.noPermissions}>
            <Users className={styles.noPermissionsIcon} />
            <span>Nessun permesso assegnato</span>
          </div>
        )}
      </div>
    </DeviceCard>
  );
}
