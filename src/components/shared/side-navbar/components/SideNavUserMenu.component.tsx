import React from "react";
import { LogOut, Settings } from "lucide-react";
import styles from "../styles/SideNavUserMenu.module.scss";

interface Props {
  onLogout: () => void;
  onClose: () => void;
}

export function SideNavUserMenu({ onLogout, onClose }: Props) {
  return (
    <div className={styles.userMenu}>
      {/*  <button className={styles.menuItem} onClick={onClose}>
                <Settings size={16} />
                <span>Settings</span>
            </button> */}

      <button className={styles.menuItem} onClick={onLogout}>
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
}
