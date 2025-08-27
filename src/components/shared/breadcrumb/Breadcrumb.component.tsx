// breadcrumb-context.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface BreadcrumbContextType {
  breadcrumbItems: KgnBreadcrumbItem[];
  navItems: NavGroup[];
  setBreadcrumbItems: (items: KgnBreadcrumbItem[]) => void;
  setNavItems: (items: NavGroup[]) => void;
  setNavLeft: (...items: NavItem[]) => void;
  clear: () => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
};

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

// kgn-Breadcrumb.component.tsx

import { Link, useLocation } from "react-router-dom";

import "./kgn-breadcrumb.component.css";
import type { KgnBreadcrumbItem, NavGroup, NavItem } from "./BreadCrumb.types";

interface KgnBreadcrumbProps {
  className?: string;
}

export const KgnBreadcrumb: React.FC<KgnBreadcrumbProps> = ({ className }) => {
  const { breadcrumbItems, navItems } = useBreadcrumb();
  const location = useLocation();

  const isActiveLink = (link?: string) => {
    if (!link) return false;
    return location.pathname === link;
  };

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav className={`kgn-breadcrumb ${className || ""}`}>
        <ol className="kgn-breadcrumb-list">
          {breadcrumbItems &&
            breadcrumbItems.length > 0 &&
            breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              return (
                <li
                  key={index}
                  className={`breadcrumb-item ${isLast ? "active" : ""}`}
                >
                  {item?.link && !isLast ? (
                    <Link to={item?.link}>{item?.label}</Link>
                  ) : (
                    <span>{item?.label}</span>
                  )}
                </li>
              );
            })}
        </ol>
      </nav>

      {/* Sub Navigation */}
      <nav className="kgn-subnav">
        <ul className="kgn-subnav-list">
          {/* Primo gruppo di nav items allineato a sinistra */}
          {navItems[0]?.items?.map((item, index) => (
            <li key={`left-${index}`} className="nav-item">
              <Link
                to={item?.link || "#"}
                className={`nav-link ${
                  isActiveLink(item?.link) ? "active" : ""
                }`}
              >
                {item?.label}
              </Link>
            </li>
          ))}

          {/* Spacer per spingere il secondo gruppo a destra */}
          {navItems[1]?.items && navItems[1].items.length > 0 && (
            <li className="spacer"></li>
          )}

          {/* Secondo gruppo di nav items allineato a destra */}
          {navItems[1]?.items?.map((item, index) => (
            <li key={`right-${index}`} className="nav-item">
              <Link
                to={item?.link || "#"}
                className={`nav-link ${
                  isActiveLink(item?.link) ? "active" : ""
                }`}
              >
                {item?.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
