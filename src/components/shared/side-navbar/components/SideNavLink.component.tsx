import React from "react";
import styles from "../styles/SideNavLink.module.scss";
import { SideNavIcon } from "./SideNavIcon.component";
import { SideNavLabel } from "./SideNavLabel.component";
import { SideNavBadge } from "./SideNavBadge.component";
import { SideNavChevron } from "./SideNavChevron.component";
import { useSideBar } from "@store_admin/hooks/useSideBar";
import { Link } from "react-router-dom";
import type { AccordionDirection, MenuItem } from "../types/MenuItem.types";

interface Props {
  item: MenuItem;
  accordionDirection: AccordionDirection;
  isOpen: boolean;
  hasChildren: boolean;
  level: number;
  onToggle: () => void;
  onLinkClick: () => void;
}

export function SideNavLink({
  item,
  accordionDirection,
  isOpen,
  hasChildren,
  level,
  onToggle,
  onLinkClick,
}: Props) {
  const { isSidebarCollapsed } = useSideBar();

  const handleClick = () => {
    if (hasChildren) {
      onToggle();
    } else if (item?.onClick) {
      item?.onClick();
      onLinkClick();
    } else if (item?.route) {
      onLinkClick();
    }
  };

  const linkClasses = [
    styles.navLink,
    item?.isActive ? styles.active : "",
    hasChildren ? styles.hasChildren : "",
    isOpen ? styles.open : "",
    level > 0 ? styles[`level${level}`] : "",
    isSidebarCollapsed ? styles.collapsed : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div
      className={linkClasses}
      onClick={handleClick}
      role={hasChildren ? "button" : "menuitem"}
      tabIndex={0}
      title={isSidebarCollapsed ? item?.label : undefined}
    >
      <div className={styles.left}>
        <SideNavIcon
          icon={item?.icon}
          level={level}
          collapsed={isSidebarCollapsed}
        />
        {!isSidebarCollapsed && <SideNavLabel text={item?.label} />}
      </div>

      {!isSidebarCollapsed && (
        <div className={styles.right}>
          <SideNavBadge value={item?.badge} />
          <div className={styles.chevronSpace}>
            {hasChildren && (
              <SideNavChevron direction={accordionDirection} isOpen={isOpen} />
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (item?.route && !hasChildren) {
    return (
      <Link
        to={item?.route}
        className={styles.navLinkWrapper}
        onClick={onLinkClick}
      >
        {content}
      </Link>
    );
  }

  return content;
}
