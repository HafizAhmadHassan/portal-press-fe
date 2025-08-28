import React, { useState } from "react";
import { LogOut } from "lucide-react";
import styles from "../styles/SideNavUserProfile.module.scss";
import { SideNavAvatar } from "./SideNavAvatar.component";
import { SideNavUserInfo } from "./SideNavUserInfo.component";
import { SideNavUserMenu } from "./SideNavUserMenu.component";
import { useSideBar } from "@store_admin/hooks/useSideBar.ts";
import { useAuth } from "@store_admin/auth/hooks/useAuth.ts";

export function SideNavUserProfile({ user }: User) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isSidebarCollapsed } = useSideBar();

  const { logout } = useAuth();

  return (
    <div className={styles.userProfile}>
      <div
        className={`${styles.userInfo} ${
          isSidebarCollapsed ? styles.collapsed : ""
        }`}
        onClick={() => !isSidebarCollapsed && setShowUserMenu(!showUserMenu)}
        role="button"
        tabIndex={0}
        title={isSidebarCollapsed ? user.username : undefined} // Tooltip quando isSidebarCollapsed
      >
        <SideNavAvatar user={user} />

        {!isSidebarCollapsed && (
          <SideNavUserInfo user={user} showMenu={showUserMenu} />
        )}
      </div>

      {showUserMenu && !isSidebarCollapsed && (
        <SideNavUserMenu
          onLogout={logout}
          onClose={() => setShowUserMenu(false)}
        />
      )}

      {isSidebarCollapsed && (
        <button
          className={styles.quickLogout}
          onClick={() => logout()}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={20} />
        </button>
      )}
    </div>
  );
}
