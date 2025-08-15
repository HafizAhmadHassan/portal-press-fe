import React from 'react';
import styles from '../styles/SideNavSubNav.module.scss';
import { SideNavItem } from './SideNavItem.component';
import type { MenuItem } from '../types/MenuItem';

interface Props {
  childrenItems?: MenuItem[];
  onLinkClick: () => void;
  isOpen: boolean;    
  level: number;
}

export function SideNavSubNav({
                                childrenItems = [],
                                onLinkClick,
                                isOpen,             
                                level
                              }: Props) {
  if (!childrenItems.length) return null;

  return (
    <ul
      className={`${styles.subNav} ${isOpen ? styles.open : ''}`}
      role="menu"
    >
      {childrenItems.map((child) => (
        <SideNavItem
          key={child.label}
          item={child}
          accordionDirection="down"  
          onLinkClick={onLinkClick}
          level={level}
        />
      ))}
    </ul>
  );
}