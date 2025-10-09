import React from "react";
import { usePWAInstall } from "@hooks/usePWAInstall";
import styles from "./InstallPWAButton.module.scss";

export const InstallPWAButton: React.FC = () => {
  const { canInstall, install, installed } = usePWAInstall();
  if (!canInstall || installed) return null;
  return (
    <button className={styles.installBtn} onClick={() => install()}>
      Installa App
    </button>
  );
};
