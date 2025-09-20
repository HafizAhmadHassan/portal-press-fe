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

      // Se non abbiamo i dati utente dal login, proviamo a decodificarli dal token
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
      // Validazione password
      if (credentials.password !== credentials.confirmPassword) {
        return rejectWithValue("Le password non coincidono");
      }

      const result = await dispatch(
        authApi.endpoints.register.initiate(credentials)
      ).unwrap();

      // Se la registrazione ha successo ma non restituisce user data, decodifica dal token
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

      // Se c'è un token, prova a fare il logout dal server
      if (state.auth.token) {
        await dispatch(authApi.endpoints.logout.initiate()).unwrap();
      }
    } catch (error) {
      // Anche se il logout dal server fallisce, facciamo il logout locale
      console.warn(
        "Server logout failed, proceeding with local logout:",
        error
      );
    } finally {
      // Logout locale garantito
      dispatch(logout());

      // Pulizia localStorage
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("scope.customer_Name");
      }

      // Pulisci la cache RTK Query
      dispatch(authApi.util.resetApiState());
    }
  }
);

// Refresh token automatico con backup/restore
export const refreshTokenAsync = createAsyncThunk<
  { token: string; refresh: string; user?: User },
  void,
  { rejectValue: string }
>(
  "auth/refreshTokenAsync",
  async (_, { dispatch, getState, rejectWithValue }) => {
    console.log("🔄 Starting secure token refresh...");

    // 1. BACKUP dati localStorage PRIMA del refresh
    const backup = backupUserData();

    try {
      const state = getState() as RootState;
      let refreshToken = state.auth.refresh;

      // Se non c'è refresh token nello store, prova dal localStorage
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

      // 2. RIPRISTINA dati localStorage DOPO il refresh
      restoreUserData(backup);

      // 3. Prova a recuperare user data dal localStorage per lo state
      let userData: User | undefined;

      if (typeof localStorage !== "undefined") {
        const authUserStr = localStorage.getItem("auth_user");
        if (authUserStr) {
          try {
            const parsedUser = JSON.parse(authUserStr);
            userData = parsedUser as User;
            console.log("👤 User data restored from localStorage:", userData);
          } catch (parseError) {
            console.error(
              "Error parsing auth_user from localStorage:",
              parseError
            );
          }
        }
      }

      // 4. Se non abbiamo user data dal localStorage, prova dal token
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

      // Se il refresh fallisce, logout automatico
      dispatch(logout());

      // Pulizia localStorage
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        // NON rimuovere auth_user e scope durante un errore di refresh,
        // potrebbero essere ancora validi per un nuovo login
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

    // Se non c'è token nello store, prova dal localStorage
    if (!currentToken && typeof localStorage !== "undefined") {
      currentToken = localStorage.getItem("access_token");
    }

    // Se non c'è token, considera l'inizializzazione completata senza autenticazione
    if (!currentToken) {
      return null;
    }

    // Verifica se il token è scaduto
    if (isTokenExpired(currentToken)) {
      // Token scaduto, prova il refresh
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
          // Se anche il refresh fallisce, logout
          dispatch(logout());
          return null;
        }
      } else {
        // Nessun refresh token disponibile, logout
        dispatch(logout());
        return null;
      }
    }

    // Token valido, prova a recuperare dati utente
    let userData: User | undefined;

    // Prima prova dal localStorage
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

    // Se non ci sono dati nel localStorage, prova a decodificare dal token
    if (!userData) {
      userData = getUserFromToken(currentToken) as User;
    }

    if (!userData) {
      // Impossibile ottenere dati utente, logout
      dispatch(logout());
      return null;
    }

    return {
      token: currentToken,
      user: userData,
    };
  } catch (error: any) {
    // Errore generico durante l'inizializzazione, logout
    dispatch(logout());
    return null;
  }
});

// Controllo scadenza sessione (per timeout automatico)
export const checkSessionTimeout = createAsyncThunk(
  "auth/checkSessionTimeout",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { lastActivity, isAuthenticated, token } = state.auth;

    if (!isAuthenticated || !token) return { timedOut: false };

    // Controlla se il token JWT è scaduto
    if (isTokenExpired(token)) {
      // Prova il refresh automatico
      try {
        await dispatch(refreshTokenAsync()).unwrap();
        return { timedOut: false };
      } catch {
        // Refresh fallito, forza logout
        dispatch(logoutAsync());
        return { timedOut: true };
      }
    }

    // Controlla timeout basato su attività utente (se implementato)
    if (lastActivity) {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minuti

      if (timeSinceLastActivity > TIMEOUT_DURATION) {
        dispatch(logoutAsync());
        return { timedOut: true };
      }
    }

    return { timedOut: false };
  }
);

// Validazione token manuale (alternativa a getCurrentUser)
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
        // Token scaduto, prova refresh
        try {
          const refreshResult = await dispatch(refreshTokenAsync()).unwrap();
          return refreshResult.user!;
        } catch {
          return rejectWithValue("Token scaduto e refresh fallito");
        }
      }

      // Token valido, prova a recuperare dati utente
      let userData: User | undefined;

      // Prima dal localStorage
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

      // Poi dal token se necessario
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
  async ({ email }: { email: string }, { dispatch, rejectWithValue }) => {
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
    {
      token,
      password,
      confirmPassword,
    }: {
      token: string;
      password: string;
      confirmPassword: string;
    },
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

      // Aggiorna anche il localStorage con i nuovi dati
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
