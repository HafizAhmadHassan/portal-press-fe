import React from 'react';
import styles from './styles/SideNav.module.scss';
import { SideNavMobileToggle } from './components/SideNavMobileToggle.component';
import { SideNavOverlay } from './components/SideNavOverlay.component';
import { SideNavHeader } from './components/SideNavHeader.component';
import { SideNavContent } from './components/SideNavContent.component';
import { SideNavFooter } from './components/SideNavFooter.component';

import { useSidebar } from '@store_admin/hooks/useSidebar';
import type { MenuItem } from '@shared/side-navbar/types/MenuItem.types';


interface Props {
  menuItems: MenuItem[];
  showCollapseButton?: boolean;
  showMobileToggle?: boolean;
  brand?: {
    logo?: string;
    title?: string;
    subtitle?: string;
  };
  className?: string;
  footer?: React.ReactNode;
}

export default function SideNav({
                                  menuItems,
                                  showCollapseButton = true,
                                  showMobileToggle = true,
                                  brand,
                                  className = '',
                                  footer,
                                }: Props) {

  const {
    isMobileOpen,
    isSidebarCollapsed,
    position,
    accordionDirection,
    toggleMobile,
    closeMobile,
    toggleSidebar,
    handleLinkClick,
  } = useSidebar();

  const sideNavClasses = [
    styles.sideNav,
    styles[position],
    isSidebarCollapsed ? styles.collapsed : '',
    isMobileOpen ? styles.mobileOpen : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <>
      {showMobileToggle && (
        <SideNavMobileToggle
          isOpen={isMobileOpen}
          onToggle={toggleMobile}
        />
      )}

      {isMobileOpen && <SideNavOverlay onClick={closeMobile} />}

      <nav className={sideNavClasses} role="navigation">
        <SideNavHeader
          brand={brand}
          collapsed={isSidebarCollapsed}
          position={position}
          showCollapseButton={showCollapseButton}
          onToggleCollapse={toggleSidebar}
        />

        <SideNavContent
          menuItems={menuItems}
          accordionDirection={accordionDirection}
          onLinkClick={handleLinkClick}
        />

        <SideNavFooter
          customFooter={footer}
        />
      </nav>
    </>
  );
}