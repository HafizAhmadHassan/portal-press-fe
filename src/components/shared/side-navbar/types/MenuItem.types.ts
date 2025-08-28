import type { UserRoles } from "@root/utils/constants/userRoles";
import { type LucideIcon } from "lucide-react";

// + aggiungi queste due opzionali
export interface MenuItem {
  label: string;
  route?: string;
  icon?: LucideIcon; // LucideIcon
  badge?: string;
  children?: MenuItem[];
  iconColor?: string; // es. 'var(--primary-color)' o '#3b82f6'
  iconActiveColor?: string; // es. 'var(--primary-dark)'
  allowedRoles?: (UserRoles | string)[];
  isActive?: boolean;
  onClick?: () => void;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export type SideNavPosition = "left" | "right";
export type AccordionDirection = "down" | "right" | "left" | "up";
