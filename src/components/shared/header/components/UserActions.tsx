import React from "react";
import styles from "../styles/Actions.module.scss";
import { Moon, Sun } from "lucide-react";
import { useUi } from "@store_admin/ui/useUi";

type Props = {
  MailIcon: React.ReactNode;
  GridIcon: React.ReactNode;
};

export default function UserActions({ MailIcon }: Props) {
  const { isDark, toggleTheme } = useUi();
  return (
    <div className={styles.actions}>
      <button className={styles.actionBtn} aria-label="Notifiche">
        {MailIcon}
      </button>

      <button className={styles.btnOutline} onClick={() => toggleTheme()}>
        {isDark ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
}
