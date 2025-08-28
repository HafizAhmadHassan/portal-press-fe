import React from "react";
import styles from "../styles/SideNavContent.module.scss";
import { useMenuItems } from "@root/routes/_hooks/useMenuItems";
import type {
  AccordionDirection,
  MenuItem,
} from "@root/components/shared/side-navbar/types/MenuItem.types";
import { SideNavItem } from "@root/components/shared/side-navbar/components/SideNavItem.component";

interface Props {
  menuItems: MenuItem[];
  accordionDirection: AccordionDirection;
  onLinkClick: () => void;
}

export function SideNavContent({
  menuItems,
  accordionDirection,
  onLinkClick,
}: Props) {
  const menuItemsWithActiveState = useMenuItems(menuItems);

  return (
    <div className={styles.content}>
      <ul className={styles.navGroup} role="menubar">
        {menuItemsWithActiveState.map((item) => (
          <SideNavItem
            key={item?.label}
            item={item}
            accordionDirection={accordionDirection}
            onLinkClick={onLinkClick}
          />
        ))}
      </ul>
    </div>
  );
}
