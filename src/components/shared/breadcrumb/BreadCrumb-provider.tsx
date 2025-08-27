import React, { useState, type ReactNode } from "react";

import type { KgnBreadcrumbItem, NavGroup, NavItem } from "./BreadCrumb.types";
import { BreadcrumbContext } from "./BreadCrumb.context";

interface BreadcrumbProviderProps {
  children: ReactNode;
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({
  children,
}) => {
  const [breadcrumbItems, setBreadcrumbItems] = useState<KgnBreadcrumbItem[]>(
    []
  );
  const [navItems, setNavItems] = useState<NavGroup[]>([]);

  const setNavLeft = (...items: NavItem[]) => {
    setNavItems([{ items }]);
  };

  const clear = () => {
    setBreadcrumbItems([]);
    setNavItems([]);
  };

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumbItems,
        navItems,
        setBreadcrumbItems,
        setNavItems,
        setNavLeft,
        clear,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};
