import { createContext } from 'react';
import { KgnBreadcrumbItem, NavGroup, NavItem } from './types';

export interface BreadcrumbContextType {
    breadcrumbItems: KgnBreadcrumbItem[];
    navItems: NavGroup[];
    setBreadcrumbItems: (items: KgnBreadcrumbItem[]) => void;
    setNavItems: (items: NavGroup[]) => void;
    setNavLeft: (...items: NavItem[]) => void;
    clear: () => void;
}

export const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);