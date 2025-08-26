import {
  BarChart3,
  LocateFixed,
  Ticket,
  Users,
  WashingMachine,
} from "lucide-react";
import { UserRoles } from "@root/utils/constants/userRoles";
import type { MenuItem } from "@shared/side-navbar/types/MenuItem.types";

/**
 * Genera gli item della side-nav inserendo l'ID del device dopo /device/.
 * Se deviceId è assente, usa i percorsi base senza ID (es. /device).
 */
export const deviceLayoutSideNavItems = (
  deviceId?: string | number
): MenuItem[] => {
  const base = deviceId ? `/device/${deviceId}` : "/device";

  return [
    {
      label: "Overview",
      route: `${base}`,
      icon: WashingMachine,
      iconColor: "var(--success-color)",
      iconActiveColor: "var(--success-dark)",
      allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
    },
    {
      label: "PLC IO",
      route: `${base}/plc-io`,
      icon: Users,
      badge: "12",
      iconColor: "var(--purple-color)",
      iconActiveColor: "var(--purple-dark)",
      allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
    },
    {
      label: "PLC Data",
      route: `${base}/plc-data`,
      icon: Ticket,
      badge: "12",
      iconColor: "var(--warning-color)",
      iconActiveColor: "var(--warning-dark)",
      allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
    },
    {
      label: "Stato PLC",
      route: `${base}/plc-status`,
      icon: LocateFixed,
      badge: "12",
      iconColor: "var(--info-color)",
      iconActiveColor: "var(--info-dark)",
      allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
    },
    {
      label: "Stato Macchine",
      icon: BarChart3,
      route: `${base}/machine-status`,
      badge: "3",
      iconColor: "var(--primary-color)",
      iconActiveColor: "var(--primary-dark)",
      allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
      // Se/Quando servirà una route:
      // route: `${base}/analytics`
    },
  ];
};
