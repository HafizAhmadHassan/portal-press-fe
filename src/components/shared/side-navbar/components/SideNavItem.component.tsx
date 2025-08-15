import React, { useEffect, useMemo } from 'react';
import styles from '../styles/SideNavItem.module.scss';
import { SideNavLink } from './SideNavLink.component';
import { SideNavSubNav } from './SideNavSubNav.component';
import type { AccordionDirection, MenuItem } from '../types/MenuItem';
import { useAppDispatch, useAppSelector } from '@store_admin/store.hooks';
import { selectIsCollapseOpen } from '@store_admin/ui/collapse/collapse.selectors';
import { registerCollapse, toggleCollapse, unregisterCollapse } from '@store_admin/ui/collapse/collapse.slice';

interface Props {
  item: MenuItem;
  accordionDirection: AccordionDirection;
  onLinkClick: () => void;
  level?: number;
}

export function SideNavItem({
                              item,
                              accordionDirection,
                              onLinkClick,
                              level = 0,
                            }: Props) {

  const dispatch = useAppDispatch();
  const hasChildren = !!item.children?.length;


  const isCollapseOpen = useAppSelector(selectIsCollapseOpen(item.label));


  useEffect(() => {
    if (hasChildren) {
      dispatch(registerCollapse({ id: item.label, autoClose: false }));

      return () => {
        dispatch(unregisterCollapse(item.label));
      };
    }
  }, [hasChildren, item.label, dispatch]);


  const handleToggle = useMemo(
    () => () => {
      if (hasChildren) {
        dispatch(toggleCollapse(item.label));
      }
    },
    [hasChildren, item.label, dispatch]
  );

  const cssVars: React.CSSProperties = {
    // fallback gestito in SCSS
    ['--nav-icon-color' as any]: item.iconColor,
    ['--nav-icon-active-color' as any]: item.iconActiveColor,
  };


  return (
    <li className={styles.navItem} role="none" style={cssVars}>
    <SideNavLink
      item={item}
      accordionDirection={accordionDirection}
      isOpen={isCollapseOpen}
      hasChildren={hasChildren}
      level={level}
      onToggle={handleToggle}
      onLinkClick={onLinkClick}
    />
    {hasChildren && (
      <SideNavSubNav
        childrenItems={item.children}
        onLinkClick={onLinkClick}
        isOpen={isCollapseOpen}
        level={level + 1}
      />
    )}
  </li>
  );
}