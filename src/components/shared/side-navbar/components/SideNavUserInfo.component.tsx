import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "../styles/SideNavUserInfo.module.scss";
import type { User } from "@store_admin/users/user.types"; // Assumi che ci sia
import { RoleBadge } from "@shared/roleBadge/RoleBadge.tsx"; // Assumi che esista un componente RoleBadge

interface Props {
  user: User;
  showMenu: boolean;
}

export function SideNavUserInfo({ user, showMenu }: Props) {
  // Se userPermissions è array o stringa, adattalo qui:
  const roles = Array.isArray(user.userPermissions)
    ? user.userPermissions
    : user.userPermissions
    ? [user.userPermissions]
    : [];

  const hasRoles = roles.length > 0;

  return (
    <div className={styles.container}>
      <div className={styles.userDetails}>
        <span className={styles.userName}>{user.username}</span>
        {hasRoles && <RoleBadge user={user} />}
      </div>

      <div className={styles.menuToggle}>
        {showMenu ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </div>
    </div>
  );
}
