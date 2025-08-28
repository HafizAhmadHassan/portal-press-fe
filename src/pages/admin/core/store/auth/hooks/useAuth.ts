// store/auth/_hooks/useAuth.ts
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@root/store";
import {
  selectAuthError,
  selectAuthLoading,
  selectAuthToken,
  selectIsAuthenticated,
  selectIsInitialized,
  selectIsSessionExpired,
  selectIsSessionExpiring,
  selectSessionTimeRemaining,
  selectUser,
  selectUserEmail,
  selectUserName,
  selectUserRole,
} from "../auth.selectors";
import {
  clearError,
  initializeAuthAsync,
  loginAsync,
  logout,
  logoutAsync,
  refreshTokenAsync,
  registerAsync,
  updateLastActivity,
} from "../auth.actions";
import type { LoginCredentials, RegisterCredentials } from "../auth.types";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Selectors
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectAuthToken);
  const isLoading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const userRole = useSelector(selectUserRole);
  const userEmail = useSelector(selectUserEmail);
  const userName = useSelector(selectUserName);
  const isInitialized = useSelector(selectIsInitialized);
  const sessionTimeRemaining = useSelector(selectSessionTimeRemaining);
  const isSessionExpiring = useSelector(selectIsSessionExpiring);
  const isSessionExpired = useSelector(selectIsSessionExpired);

  // Actions
  const login = useCallback(
    (credentials: LoginCredentials) => {
      console.log("Logging in with credentials:", credentials);
      return dispatch(loginAsync(credentials));
    },
    [dispatch]
  );

  const register = useCallback(
    (credentials: RegisterCredentials) => {
      return dispatch(registerAsync(credentials));
    },
    [dispatch]
  );

  const handleLogout = useCallback(() => {
    return dispatch(logoutAsync());
  }, [dispatch]);

  const initializeAuth = useCallback(() => {
    return dispatch(initializeAuthAsync());
  }, [dispatch]);

  const refresh = useCallback(() => {
    return dispatch(refreshTokenAsync());
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateActivity = useCallback(() => {
    dispatch(updateLastActivity());
  }, [dispatch]);

  const forceLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    // State
    user,
    isAuthenticated,
    token,
    isLoading,
    error,
    userRole,
    userEmail,
    userName,
    isInitialized,
    sessionTimeRemaining,
    isSessionExpiring,
    isSessionExpired,

    // Actions
    login,
    register,
    logout: handleLogout,
    initializeAuth,
    refresh,
    clearError: clearAuthError,
    updateActivity,
    forceLogout,
  };
};
