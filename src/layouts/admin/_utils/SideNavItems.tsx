// @shared/side-navbar/config/adminSideNav.ts
import {
  BarChart3,
  ChevronRight,
  FileText,
  LocateFixed,
  MessageCircle,
  Ticket,
  Users,
  WashingMachine,
} from "lucide-react";
import type {
  MenuItem,
  UserProfile,
} from "@shared/side-navbar/types/MenuItem.types";
import { UserRoles } from "@root/utils/constants/userRoles";

/** Badge in input dal "mondo esterno" (RTK Query meta, contatori ecc.) */
export type AdminNavBadges = {
  machines?: number;
  users?: number;
  tickets?: number;
  gps?: number;
  logs?: number;
  analytics?: {
    /** se vuoi passare un totale esplicito per il parent */
    total?: number;
    overview?: number;
    reports?: number;
  };
};

/** converte numero → badge string | undefined; nasconde badge se 0/undefined */
const toBadge = (n?: number | null) =>
  n && n > 0 ? (n > 99 ? "99+" : String(n)) : undefined;

/**
 * Builder dei menu items che accetta i badge dinamici.
 * - se non passi nulla, niente badge
 * - se passi numeri, li converte in stringa (99+ cap)
 * - i badge "analytics" padre: usa analytics.total, altrimenti somma i figli
 */
export const buildAdminLayoutSideNavItems = (
  badges: AdminNavBadges = {}
): MenuItem[] => {
  const analyticsParentBadge =
    toBadge(
      badges.analytics?.total ??
        (badges.analytics?.overview ?? 0) + (badges.analytics?.reports ?? 0)
    ) || undefined;

  return [
    {
      label: "Machines",
      route: "/admin",
      icon: WashingMachine,
      badge: toBadge(badges.machines),
      iconColor: "var(--success-color)",
      iconActiveColor: "var(--success-dark)",
      allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
    },
    {
      label: "Users",
      route: "/admin/users",
      icon: Users,
      badge: toBadge(badges.users),
      iconColor: "var(--purple-color)",
      iconActiveColor: "var(--purple-dark)",
      allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
    },
    {
      label: "Tickets",
      route: "/admin/tickets",
      icon: Ticket,
      badge: toBadge(badges.tickets),
      iconColor: "var(--warning-color)",
      iconActiveColor: "var(--warning-dark)",
      allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
    },
    {
      label: "GPS",
      route: "/admin/gps",
      icon: LocateFixed,
      badge: toBadge(badges.gps),
      iconColor: "var(--info-color)",
      iconActiveColor: "var(--info-dark)",
      allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN],
    },
    {
      label: "Logs",
      route: "/admin/logs",
      icon: MessageCircle,
      badge: toBadge(badges.logs),
      iconColor: "var(--orange-color)",
      iconActiveColor: "var(--orange-dark)",
      allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
    },
    {
      label: "Analytics",
      icon: BarChart3,
      badge: analyticsParentBadge,
      iconColor: "var(--primary-color)",
      iconActiveColor: "var(--primary-dark)",
      allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN],
      children: [
        {
          label: "Overview",
          route: "/admin/analytics/overview",
          icon: ChevronRight,
          badge: toBadge(badges.analytics?.overview),
          iconColor: "var(--primary-color)",
          iconActiveColor: "var(--primary-dark)",
          allowedRoles: [UserRoles.SUPER_ADMIN],
        },
        {
          label: "Reports",
          route: "/admin/analytics/reports",
          icon: FileText,
          badge: toBadge(badges.analytics?.reports),
          iconColor: "var(--orange-color)",
          iconActiveColor: "var(--orange-dark)",
          allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN],
        },
      ],
    },
  ];
};

/** opzionale: profilo utente (puoi sostituirlo con i dati reali dal tuo auth store) */
export const AdminLayoutUserProfile: UserProfile = {
  name: "John Doe",
  email: "john@example.com",
  role: "Administrator",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
