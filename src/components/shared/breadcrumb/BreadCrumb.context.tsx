import { createContext } from "react";
import type { KgnBreadcrumbItem, NavGroup, NavItem } from "./BreadCrumb.types";

export interface BreadcrumbContextType {
  breadcrumbItems: KgnBreadcrumbItem[];
  navItems: NavGroup[];
  setBreadcrumbItems: (items: KgnBreadcrumbItem[]) => void;
  setNavItems: (items: NavGroup[]) => void;
  setNavLeft: (...items: NavItem[]) => void;
  clear: () => void;
}

export const BreadcrumbContext = createContext<
  BreadcrumbContextType | undefined
>(undefined);
