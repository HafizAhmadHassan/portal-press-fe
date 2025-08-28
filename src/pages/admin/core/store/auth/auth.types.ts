import type { User } from "../users/user.types";

// store/auth/auth.types.ts
export type PermissionAction = "view" | "add" | "change" | "delete";
export type PermissionMap = Record<string, PermissionAction[]>;

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "USER" | string; // fallback per ruoli eventuali

/** Forma che arriva dal backend (session/login) */
export interface BackendSessionUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: PermissionMap;

  fullName?: string;
  isActive?: boolean;
  isStaff?: boolean;
  isSuperuser?: boolean;
  dateJoined?: string;
  groups: string[];
}

/** Forma usata dall'app (compatibile con quella che avevi) */

export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  username: string;
  password: string;
  confirmPassword: string;
}

/** Il login può restituire token + l'oggetto utente backend */
export interface AuthResponse {
  user: BackendSessionUser;
  token: string;
  refresh: string;
}

// AGGIUNTA la proprietà mancante isInitialized
export interface AuthState {
  user: User | null;
  token: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // ← AGGIUNTA QUESTA PROPRIETÀ
  isLoading: boolean;
  error: string | null;
  lastActivity: number | null;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

/** Helper: guard permessi comodo in UI */
export function hasPermission(
  user: User | null | undefined,
  resource: string,
  action: PermissionAction
): boolean {
  if (!user?.permissions) return false;
  const list = user.permissions[resource];
  return Array.isArray(list) && list.includes(action);
}
