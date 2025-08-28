// store/auth/auth.types.ts
export type PermissionAction = "view" | "add" | "change" | "delete";
export type PermissionMap = Record<string, PermissionAction[]>;

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "USER" | string; // fallback per ruoli eventuali

/** Forma che arriva dal backend (session/login) */
export interface BackendSessionUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  permissions: PermissionMap;
}

/** Forma usata dall'app (compatibile con quella che avevi) */
export interface User {
  id: string | number; // prima era string, ora accetta anche number
  username: string;
  name: string; // derivato da first_name + last_name (o username)
  role: UserRole;
  email?: string;
  avatar?: string;
  createdAt?: string; // opzionali: non ci sono nel payload backend
  updatedAt?: string;
  // Aggiungo i raw per chi servono in UI:
  firstName?: string;
  lastName?: string;
  permissions?: PermissionMap; // utile per i guard
}

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

/** Helper: mappa utente backend → utente usato nell'app */
export function mapBackendUserToUser(u: BackendSessionUser): User {
  const name =
    [u.first_name, u.last_name].filter(Boolean).join(" ").trim() || u.username;
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role,
    name,
    firstName: u.first_name,
    lastName: u.last_name,
    permissions: u.permissions,
  };
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
