import {
  BarChart3,
  ChevronRight,
  FileText,
  LocateFixed,
  Ticket,
  Users,
  WashingMachine,
} from "lucide-react";
import type {
  MenuItem,
  UserProfile,
} from "@shared/side-navbar/types/MenuItem.types";
import { UserRoles } from "@root/utils/constants/userRoles";

export const AdminLayoutSideNavItems: MenuItem[] = [
  {
    label: "Machines",
    route: "/admin",
    icon: WashingMachine,
    iconColor: "var(--success-color)",
    iconActiveColor: "var(--success-dark)",
    allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
  },
  {
    label: "Users",
    route: "/admin/users",
    icon: Users,
    badge: "12",
    iconColor: "var(--purple-color)",
    iconActiveColor: "var(--purple-dark)",
    allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
  },
  {
    label: "Tickets",
    route: "/admin/tickets",
    icon: Ticket,
    badge: "12",
    iconColor: "var(--warning-color)",
    iconActiveColor: "var(--warning-dark)",
    allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN, UserRoles.USER],
  },
  {
    label: "GPS",
    route: "/admin/gps",
    icon: LocateFixed,
    badge: "12",
    iconColor: "var(--info-color)",
    iconActiveColor: "var(--info-dark)",
    allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN],
  },
  {
    label: "Analytics",
    icon: BarChart3,
    badge: "3",
    iconColor: "var(--primary-color)",
    iconActiveColor: "var(--primary-dark)",
    // opzionale: mostra la voce "Analytics" solo ad ADMIN e SUPER_ADMIN
    allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN],
    children: [
      {
        label: "Overview",
        route: "/admin/analytics/overview",
        icon: ChevronRight,
        iconColor: "var(--primary-color)",
        iconActiveColor: "var(--primary-dark)",
        allowedRoles: [UserRoles.SUPER_ADMIN],
      },
      {
        label: "Reports",
        route: "/admin/analytics/reports",
        icon: FileText,
        iconColor: "var(--orange-color)",
        iconActiveColor: "var(--orange-dark)",
        allowedRoles: [UserRoles.ADMIN, UserRoles.SUPER_ADMIN],
      },
    ],
  },
];

export const AdminLayoutUserProfile: UserProfile = {
  name: "John Doe",
  email: "john@example.com",
  role: "Administrator",
  avatar:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
};
