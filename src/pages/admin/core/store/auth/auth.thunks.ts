// store/auth/auth.thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "./auth.types";
import { authApi } from "./auth.api";
import { logout } from "./auth.slice";
import type { User } from "../users/user.types";
import { getUserFromToken, isTokenExpired } from "@root/utils/jwtUtils";

// Helper per backup/restore localStorage
const backupUserData = () => {
  if (typeof localStorage === "undefined") return null;

  const backup = {
    authUser: localStorage.getItem("auth_user"),
    scopeCustomer: localStorage.getItem("scope.customer_Name"),
    // Aggiungi altri campi se necessari
  };

  console.log("💾 Backup localStorage:", backup);
  return backup;
};

const restoreUserData = (backup: any) => {
  if (typeof localStorage === "undefined" || !backup) return;

  if (backup.authUser) {
    localStorage.setItem("auth_user", backup.authUser);
  }
  if (backup.scopeCustomer) {
    localStorage.setItem("scope.customer_Name", backup.scopeCustomer);
  }

  console.log("🔄 Restored localStorage data");
};

// Login con credenziali
export const loginAsync = createAsyncThunk<
  AuthResponse,
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/loginAsync",
  async (credentials: LoginCredentials, { dispatch, rejectWithValue }) => {
    console.log("loginAsync called with credentialsTHUNK:", credentials);
    try {
      const loginResult = await dispatch(
        authApi.endpoints.login.initiate(credentials)
      ).unwrap();

      if (!loginResult.user && loginResult.token) {
        try {
          const userFromToken = getUserFromToken(loginResult.token);
          if (userFromToken) {
            return {
              ...loginResult,
              user: userFromToken as User,
            };
          }
        } catch (tokenError) {
          console.error(
            "loginAsync: Failed to decode user from token:",
            tokenError
          );
        }
      }

      return loginResult;
    } catch (error: any) {
      console.error("loginAsync: Login failed, error:", error);
      return rejectWithValue(error.data?.message || "Errore durante il login");
    }
  }
);

// Registrazione
export const registerAsync = createAsyncThunk<
  AuthResponse,
  RegisterCredentials,
  { rejectValue: string }
>(
  "auth/registerAsync",
  async (credentials: RegisterCredentials, { dispatch, rejectWithValue }) => {
    try {
      if (credentials.password !== credentials.confirmPassword) {
        return rejectWithValue("Le password non coincidono");
      }

      const result = await dispatch(
        authApi.endpoints.register.initiate(credentials)
      ).unwrap();

      if (result.token && !result.user) {
        const userFromToken = getUserFromToken(result.token);
        if (userFromToken) {
          result.user = userFromToken as User;
        }
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore durante la registrazione"
      );
    }
  }
);

// Logout completo
export const logoutAsync = createAsyncThunk(
  "auth/logoutAsync",
  async (_, { dispatch, getState }) => {
    try {
      const state = getState() as RootState;

      if (state.auth.token) {
        await dispatch(authApi.endpoints.logout.initiate()).unwrap();
      }
    } catch (error) {
      console.warn(
        "Server logout failed, proceeding with local logout:",
        error
      );
    } finally {
      dispatch(logout());

      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("scope.customer_Name");
      }

      dispatch(authApi.util.resetApiState());
    }
  }
);

// Refresh token automatico con backup/restore
export const refreshTokenAsync = createAsyncThunk<
  {
    token: string;
    refresh: string;
    user?: User;
  },
  void,
  { rejectValue: string }
>(
  "auth/refreshTokenAsync",
  async (_, { dispatch, getState, rejectWithValue }) => {
    console.log("🔄 Starting secure token refresh...");
    const backup = backupUserData();

    try {
      const state = getState() as RootState;
      let refreshToken = state.auth.refresh;

      if (!refreshToken && typeof localStorage !== "undefined") {
        refreshToken = localStorage.getItem("refresh_token");
      }

      if (!refreshToken) {
        return rejectWithValue("Nessun refresh token disponibile");
      }

      console.log("🔄 Executing refresh API call...");
      const result = await dispatch(
        authApi.endpoints.refresh.initiate({ refresh: refreshToken })
      ).unwrap();

      console.log("✅ Refresh API successful, restoring user data...");
      restoreUserData(backup);

      let userData: User | undefined;
      if (typeof localStorage !== "undefined") {
        const authUserStr = localStorage.getItem("auth_user");
        if (authUserStr) {
          try {
            userData = JSON.parse(authUserStr) as User;
            console.log("👤 User data restored from localStorage:", userData);
          } catch (parseError) {
            console.error(
              "Error parsing auth_user from localStorage:",
              parseError
            );
          }
        }
      }

      if (!userData && result.token) {
        const userFromToken = getUserFromToken(result.token);
        if (userFromToken) {
          userData = userFromToken as User;
          console.log("👤 User data extracted from token:", userData);
        }
      }

      return {
        ...result,
        user: userData,
      };
    } catch (error: any) {
      console.error("❌ Refresh token failed:", error);
      dispatch(logout());

      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }

      return rejectWithValue(error.data?.message || "Sessione scaduta");
    }
  }
);

// Inizializzazione autenticazione
export const initializeAuthAsync = createAsyncThunk<
  { token: string; user: User } | null,
  void,
  { rejectValue: string }
>("auth/initializeAuthAsync", async (_, { dispatch, getState }) => {
  try {
    const state = getState() as RootState;
    let currentToken = state.auth.token;

    if (!currentToken && typeof localStorage !== "undefined") {
      currentToken = localStorage.getItem("access_token");
    }

    if (!currentToken) {
      return null;
    }

    if (isTokenExpired(currentToken)) {
      let refreshToken = state.auth.refresh;
      if (!refreshToken && typeof localStorage !== "undefined") {
        refreshToken = localStorage.getItem("refresh_token");
      }

      if (refreshToken) {
        try {
          const refreshResult = await dispatch(refreshTokenAsync()).unwrap();
          return {
            token: refreshResult.token,
            user: refreshResult.user!,
          };
        } catch {
          dispatch(logout());
          return null;
        }
      } else {
        dispatch(logout());
        return null;
      }
    }

    let userData: User | undefined;
    if (typeof localStorage !== "undefined") {
      const authUserStr = localStorage.getItem("auth_user");
      if (authUserStr) {
        try {
          userData = JSON.parse(authUserStr) as User;
        } catch (parseError) {
          console.error(
            "Error parsing auth_user during initialization:",
            parseError
          );
        }
      }
    }

    if (!userData) {
      userData = getUserFromToken(currentToken) as User;
    }

    if (!userData) {
      dispatch(logout());
      return null;
    }

    return {
      token: currentToken,
      user: userData,
    };
  } catch (error: any) {
    dispatch(logout());
    return null;
  }
});

// Controllo scadenza sessione
export const checkSessionTimeout = createAsyncThunk(
  "auth/checkSessionTimeout",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { lastActivity, isAuthenticated, token } = state.auth;

    if (!isAuthenticated || !token) return { timedOut: false };

    if (isTokenExpired(token)) {
      try {
        await dispatch(refreshTokenAsync()).unwrap();
        return { timedOut: false };
      } catch {
        dispatch(logoutAsync());
        return { timedOut: true };
      }
    }

    if (lastActivity) {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 min

      if (timeSinceLastActivity > TIMEOUT_DURATION) {
        dispatch(logoutAsync());
        return { timedOut: true };
      }
    }

    return { timedOut: false };
  }
);

// Validazione token manuale
export const validateTokenAsync = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  "auth/validateTokenAsync",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { token } = state.auth;

      if (!token) {
        return rejectWithValue("Nessun token presente");
      }

      if (isTokenExpired(token)) {
        try {
          const refreshResult = await dispatch(refreshTokenAsync()).unwrap();
          return refreshResult.user!;
        } catch {
          return rejectWithValue("Token scaduto e refresh fallito");
        }
      }

      let userData: User | undefined;
      if (typeof localStorage !== "undefined") {
        const authUserStr = localStorage.getItem("auth_user");
        if (authUserStr) {
          try {
            userData = JSON.parse(authUserStr) as User;
          } catch (parseError) {
            console.error(
              "Error parsing auth_user during validation:",
              parseError
            );
          }
        }
      }

      if (!userData) {
        userData = getUserFromToken(token) as User;
      }

      if (!userData) {
        return rejectWithValue("Token non valido o dati utente non trovati");
      }

      return userData;
    } catch (error: any) {
      return rejectWithValue("Errore durante la validazione del token");
    }
  }
);

// Password dimenticata
export const forgotPasswordAsync = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>(
  "auth/forgotPasswordAsync",
  async ({ email }, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(
        authApi.endpoints.forgotPassword.initiate({ email })
      ).unwrap();
      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore durante l'invio email"
      );
    }
  }
);

// Reset password
export const resetPasswordAsync = createAsyncThunk<
  { message: string },
  { token: string; password: string; confirmPassword: string },
  { rejectValue: string }
>(
  "auth/resetPasswordAsync",
  async (
    { token, password, confirmPassword },
    { dispatch, rejectWithValue }
  ) => {
    try {
      if (password !== confirmPassword) {
        return rejectWithValue("Le password non coincidono");
      }

      const result = await dispatch(
        authApi.endpoints.resetPassword.initiate({
          token,
          password,
          confirmPassword,
        })
      ).unwrap();

      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore durante il reset password"
      );
    }
  }
);

// Aggiorna profilo utente
export const updateProfileAsync = createAsyncThunk<
  User,
  Partial<User>,
  { rejectValue: string }
>(
  "auth/updateProfileAsync",
  async (updates: Partial<User>, { dispatch, rejectWithValue }) => {
    try {
      const result = await dispatch(
        authApi.endpoints.updateProfile.initiate(updates)
      ).unwrap();

      if (typeof localStorage !== "undefined") {
        localStorage.setItem("auth_user", JSON.stringify(result));
      }

      return result;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore durante l'aggiornamento del profilo"
      );
    }
  }
);
