import { useAppDispatch, useAppSelector } from '@store_admin/store.hooks';
import {
  selectAccordionDirection,
  selectAnySidebarOpen,
  selectIsMobileOpen,
  selectIsSidebarCollapsed,
  selectMobileState,
  selectSidebarConfig,
  selectSidebarPosition,
} from '@store_admin/ui/sidebar/sidebar.selectors';
import {
  closeAllSidebars,
  closeMobileSidebar,
  collapseSidebar,
  expandSidebar,
  openMobileSidebar,
  resetSidebarState,
  setAccordionDirection,
  setSidebarCollapsed,
  setSidebarPosition,
  toggleMobileSidebar,
  toggleSidebarCollapse,
} from '@store_admin/ui/sidebar/sidebar.slice';

export const useSidebar = () => {
  const dispatch = useAppDispatch();

  // State individuali
  const isMobileOpen = useAppSelector(selectIsMobileOpen);
  const isSidebarCollapsed = useAppSelector(selectIsSidebarCollapsed);
  const position = useAppSelector(selectSidebarPosition);
  const accordionDirection = useAppSelector(selectAccordionDirection);

  // State memoizzati
  const sidebarConfig = useAppSelector(selectSidebarConfig);
  const mobileState = useAppSelector(selectMobileState);
  const anySidebarOpen = useAppSelector(selectAnySidebarOpen);

  return {
    // State individuali
    isMobileOpen,
    isSidebarCollapsed,
    position,
    accordionDirection,

    // State memoizzati
    config: sidebarConfig,
    mobileState,
    anySidebarOpen,

    // Desktop Sidebar Actions
    toggleSidebar: () => dispatch(toggleSidebarCollapse()),
    collapseSidebar: () => dispatch(collapseSidebar()),
    expandSidebar: () => dispatch(expandSidebar()),
    setSidebarCollapsed: (collapsed: boolean) => dispatch(setSidebarCollapsed(collapsed)),

    // Mobile Sidebar Actions
    toggleMobile: () => dispatch(toggleMobileSidebar()),
    openMobile: () => dispatch(openMobileSidebar()),
    closeMobile: () => dispatch(closeMobileSidebar()),

    // Settings
    setPosition: (position: 'left' | 'right') => dispatch(setSidebarPosition(position)),
    setDirection: (direction: 'up' | 'down') => dispatch(setAccordionDirection(direction)),

    // Utility
    closeAll: () => dispatch(closeAllSidebars()),
    resetState: () => dispatch(resetSidebarState()),
    handleLinkClick: () => dispatch(closeMobileSidebar()),
  };
};