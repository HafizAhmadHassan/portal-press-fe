import React from "react";
import { Users } from "lucide-react";
import type { User } from "@store_admin/users/user.types";
import styles from "./GroupsCard.module.scss";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";

export default function GroupsCard({ user }: { user: User }) {
  if (!user.groups?.length) return null;

  return (
    <DeviceCard
      title="Gruppi"
      icon={<Users size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.groupsList}>
        {user.groups.map((group, idx) => (
          <div key={`${group}-${idx}`} className={styles.groupChip}>
            <Users className={styles.groupIcon} />
            {group}
          </div>
        ))}
      </div>
    </DeviceCard>
  );
}
