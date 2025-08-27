export interface MenuItem {
  label: string;
  route?: string;
  icon?: string;
  children?: MenuItem[];
  onClick?: () => void;
  badge?: string | number;
  isActive?: boolean;
}

// src/_hooks/useMenuItems.ts - Hook per calcolare lo stato active
import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export function useMenuItems(menuItems: MenuItem[]): MenuItem[] {
  const location = useLocation();

  return useMemo(() => {
    const calculateActiveState = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        let isActive = false;

        // Calcola se questo item è attivo
        if (item.route) {
          const currentPath = location.pathname;

          if (item.children && item.children.length > 0) {
            // Se ha figli, è attivo se il percorso corrente inizia con la sua rotta
            isActive = currentPath.startsWith(item.route);
          } else {
            // Se non ha figli, deve essere un match esatto
            isActive = currentPath === item.route;
          }
        }

        // Calcola ricorsivamente per i figli
        const updatedChildren = item.children
          ? calculateActiveState(item.children)
          : undefined;

        // Se ha figli e uno di essi è attivo, anche il parent è attivo
        if (updatedChildren && !isActive) {
          isActive = updatedChildren.some((child) => child.isActive);
        }

        return {
          ...item,
          isActive,
          children: updatedChildren,
        };
      });
    };

    return calculateActiveState(menuItems);
  }, [menuItems, location.pathname]);
}
