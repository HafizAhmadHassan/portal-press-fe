import React from "react";
import styles from "../styles/SideNavContent.module.scss";
import { SideNavItem } from "./SideNavItem.component.tsx";

import { useMenuItems } from "../../../../routes/_hooks/useMenuItems.ts";
import type { AccordionDirection, MenuItem } from "../types/MenuItem.types.ts";

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
