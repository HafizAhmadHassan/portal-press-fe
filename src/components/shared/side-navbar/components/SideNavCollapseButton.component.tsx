import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "../styles/SideNavCollapseButton.module.scss";
import type { SideNavPosition } from "../types/MenuItem.types";

interface Props {
  collapsed: boolean;
  position: SideNavPosition;
  onClick: () => void;
}

export function SideNavCollapseButton({ collapsed, position, onClick }: Props) {
  const getIcon = () => {
    if (position === "left") {
      return collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />;
    } else {
      return collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />;
    }
  };

  return (
    <button
      className={styles.collapseButton}
      onClick={onClick}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {getIcon()}
    </button>
  );
}
