import React from 'react';
import styles from '../styles/SideNavHeader.module.scss';
import { SideNavBrand } from './SideNavBrand.component';
import type { SideNavPosition } from '../types/MenuItem';

interface Props {
  brand?: {
    logo?: string;
    title?: string;
    subtitle?: string;
  };
  collapsed: boolean;
  position: SideNavPosition;
  showCollapseButton: boolean;
  onToggleCollapse: () => void;
}

export function SideNavHeader({
                                brand,
                                collapsed,
                                position,
                                showCollapseButton,
                                onToggleCollapse
                              }: Props) {
  return (
    <div className={styles.header}>
      {brand && <SideNavBrand {...brand} collapsed={collapsed} />}
    </div>
  );
}