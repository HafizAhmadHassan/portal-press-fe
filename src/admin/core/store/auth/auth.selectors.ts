// store/auth/selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../../store";

// Selettori base
export const selectAuthState = (state: RootState) => state.auth;

export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthToken = createSelector(
  [selectAuthState],
  (auth) => auth.token
);

export const selectRefreshToken = createSelector(
  [selectAuthState],
  (auth) => auth.refresh
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth.isLoading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);

export const selectLastActivity = createSelector(
  [selectAuthState],
  (auth) => auth.lastActivity
);

// Selettori derivati per informazioni utente
export const selectUserEmail = createSelector(
  [selectUser],
  (user) => user?.email
);

export const selectUserName = createSelector(
  [selectUser],
  (user) => user?.name
);

export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.role
);

export const selectUserAvatar = createSelector(
  [selectUser],
  (user) => user?.avatar
);

export const selectUserId = createSelector([selectUser], (user) => user?.id);

// Selettori per controlli di autorizzazione
export const selectHasRole = (role: string) =>
  createSelector([selectUserRole], (userRole) => userRole === role);

export const selectHasAnyRole = (roles: string[]) =>
  createSelector([selectUserRole], (userRole) =>
    userRole ? roles.includes(userRole) : false
  );

// Controllo admin
export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === "admin" || role === "super_admin"
);

// Controllo moderatore
export const selectIsModerator = createSelector(
  [selectUserRole],
  (role) => role === "moderator" || role === "admin" || role === "super_admin"
);

// Stato di inizializzazione
export const selectIsInitialized = createSelector([selectAuthState], (auth) => {
  // Considera inizializzato se:
  // - Non è in loading E
  // - (È autenticato CON user e token) OPPURE (non è autenticato senza token)
  return (
    !auth.isLoading &&
    ((auth.isAuthenticated && auth.user && auth.token) ||
      (!auth.isAuthenticated && !auth.token))
  );
});

// Controllo scadenza sessione
export const selectSessionTimeRemaining = createSelector(
  [selectLastActivity],
  (lastActivity) => {
    if (!lastActivity) return 0;

    const now = Date.now();
    const timeSinceActivity = now - lastActivity;
    const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minuti

    return Math.max(0, TIMEOUT_DURATION - timeSinceActivity);
  }
);

export const selectIsSessionExpiring = createSelector(
  [selectSessionTimeRemaining],
  (timeRemaining) => {
    const WARNING_THRESHOLD = 5 * 60 * 1000; // 5 minuti
    return timeRemaining > 0 && timeRemaining <= WARNING_THRESHOLD;
  }
);

export const selectIsSessionExpired = createSelector(
  [selectSessionTimeRemaining],
  (timeRemaining) => timeRemaining === 0
);

// Selettore per dati completi della sessione
export const selectAuthSession = createSelector(
  [
    selectUser,
    selectIsAuthenticated,
    selectAuthToken,
    selectAuthLoading,
    selectAuthError,
    selectLastActivity,
    selectIsInitialized,
    selectSessionTimeRemaining,
  ],
  (
    user,
    isAuthenticated,
    token,
    isLoading,
    error,
    lastActivity,
    isInitialized,
    sessionTimeRemaining
  ) => ({
    user,
    isAuthenticated,
    token,
    isLoading,
    error,
    lastActivity,
    isInitialized,
    sessionTimeRemaining,
    hasSession: isAuthenticated && !!user && !!token,
  })
);

// Controlli di permessi avanzati
export const selectCanAccessAdminPanel = createSelector(
  [selectIsAuthenticated, selectUserRole],
  (isAuthenticated, role) =>
    isAuthenticated && (role === "admin" || role === "super_admin")
);

export const selectCanModerateContent = createSelector(
  [selectIsAuthenticated, selectUserRole],
  (isAuthenticated, role) =>
    isAuthenticated &&
    ["moderator", "admin", "super_admin"].includes(role || "")
);

export const selectCanManageUsers = createSelector(
  [selectIsAuthenticated, selectUserRole],
  (isAuthenticated, role) =>
    isAuthenticated && ["admin", "super_admin"].includes(role || "")
);

// Selettore per dati profilo completi
export const selectUserProfile = createSelector([selectUser], (user) =>
  user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    : null
);
