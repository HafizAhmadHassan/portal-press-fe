import { SideNavLink } from './SideNavLink.component';
import styles from '../styles/SideNavItem.module.scss';
import { useAuth } from '@store_admin/auth/hooks/useAuth';
import { SideNavSubNav } from './SideNavSubNav.component';
import React, { useEffect, useMemo, useCallback } from 'react';
import type { UserRoles } from '@root/utils/constants/userRoles';
import { useAppDispatch, useAppSelector } from '@store_admin/store.hooks';
import type { AccordionDirection, MenuItem } from '../types/MenuItem.types';
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
  const { userRole, isInitialized } = useAuth();

  // 1) Calcola permesso SEMPRE (nessun early return prima degli hook)
  const isAllowed = useMemo(
    () => !item.allowedRoles || item.allowedRoles.includes(userRole as UserRoles),
    [item.allowedRoles, userRole]
  );

  // 2) Filtra SEMPRE i figli per ruolo
  const childrenFiltered = useMemo(
    () => (item.children ?? []).filter(
      (c) => !c.allowedRoles || c.allowedRoles.includes(userRole as UserRoles)
    ),
    [item.children, userRole]
  );

  const hasChildren = childrenFiltered.length > 0;

  // 3) Chiama SEMPRE useAppSelector/useEffect
  const isCollapseOpen = useAppSelector(selectIsCollapseOpen(item.label));

  useEffect(() => {
    if (!hasChildren) return; // la logica sta DENTRO l’effetto, non attorno
    dispatch(registerCollapse({ id: item.label, autoClose: false }));
    return () => {
      dispatch(unregisterCollapse(item.label));
    };
  }, [dispatch, hasChildren, item.label]);

  const handleToggle = useCallback(() => {
    if (!hasChildren) return;
    dispatch(toggleCollapse(item.label));
  }, [dispatch, hasChildren, item.label]);

  const cssVars: React.CSSProperties = useMemo(() => ({
    ['--nav-icon-color' as string]: item.iconColor,
    ['--nav-icon-active-color' as string]: item.iconActiveColor,
  }), [item.iconColor, item.iconActiveColor]);

  // 4) SOLO ORA puoi fare early return, dopo che TUTTI gli hook sono stati chiamati
  if (!isInitialized) return null;
  if (!isAllowed) return null;

  return (
    <li className={styles.navItem} role="none" style={cssVars}>
      <SideNavLink
        item={{ ...item, children: childrenFiltered }}
        accordionDirection={accordionDirection}
        isOpen={isCollapseOpen}
        hasChildren={hasChildren}
        level={level}
        onToggle={handleToggle}
        onLinkClick={onLinkClick}
      />
      {hasChildren && (
        <SideNavSubNav
          childrenItems={childrenFiltered}
          onLinkClick={onLinkClick}
          isOpen={isCollapseOpen}
          level={level + 1}
        />
      )}
    </li>
  );
}
