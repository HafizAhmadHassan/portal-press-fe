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

      // Se non abbiamo i dati utente, chiamiamo /me
      if (!loginResult.user && loginResult.token) {
        try {
          const userData = await dispatch(
            authApi.endpoints.getCurrentUser.initiate()
          ).unwrap();

          return {
            ...loginResult,
            user: userData,
          };
        } catch (userError) {
          console.error("loginAsync: Failed to fetch user data:", userError);
          // Continua con i dati di login anche senza user data
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

      // Pulisci la cache RTK Query
      dispatch(authApi.util.resetApiState());
    }
  }
);

// Refresh token automatico
export const refreshTokenAsync = createAsyncThunk<
  { token: string; refresh: string },
  void,
  { rejectValue: string }
>(
  "auth/refreshTokenAsync",
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { refresh } = state.auth;

      if (!refresh) {
        return rejectWithValue("Nessun refresh token disponibile");
      }

      const result = await dispatch(
        authApi.endpoints.refresh.initiate({ refresh })
      ).unwrap();

      return result;
    } catch (error: any) {
      // Se il refresh fallisce, logout automatico
      dispatch(logout());
      return rejectWithValue(error.data?.message || "Sessione scaduta");
    }
  }
);

// Inizializzazione autenticazione
export const initializeAuthAsync = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>("auth/initializeAuthAsync", async (_, { dispatch, getState }) => {
  try {
    const state = getState() as RootState;

    // Se non c'è token, considera l'inizializzazione completata
    if (!state.auth.token) {
      return null;
    }

    // Verifica il token corrente chiamando /me

    const profile = await dispatch(
      authApi.endpoints.getCurrentUser.initiate()
    ).unwrap();

    return profile;
  } catch (error: any) {
    // Se getCurrentUser fallisce, prova il refresh
    const state = getState() as RootState;

    if (state.auth.refresh) {
      try {
        await dispatch(refreshTokenAsync()).unwrap();
        // Riprova a ottenere il profilo dopo il refresh
        const profile = await dispatch(
          authApi.endpoints.getCurrentUser.initiate()
        ).unwrap();

        return profile;
      } catch {
        // Se anche il refresh fallisce, logout

        dispatch(logout());
        return null;
      }
    } else {
      // Nessun refresh token, logout

      dispatch(logout());
      return null;
    }
  }
});

// Controllo scadenza sessione (per timeout automatico)
export const checkSessionTimeout = createAsyncThunk(
  "auth/checkSessionTimeout",
  async (_, { dispatch, getState }) => {
    const state = getState() as RootState;
    const { lastActivity, isAuthenticated } = state.auth;

    if (!isAuthenticated || !lastActivity) return;

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivity;
    const TIMEOUT_DURATION = 30 * 60 * 1000; // 30 minuti

    if (timeSinceLastActivity > TIMEOUT_DURATION) {
      dispatch(logoutAsync());
      return { timedOut: true };
    }

    return { timedOut: false };
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
