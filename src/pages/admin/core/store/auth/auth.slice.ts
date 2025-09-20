// store/auth/auth.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState } from "./auth.types";
import { authApi } from "./auth.api";
import {
  initializeAuthAsync,
  loginAsync,
  logoutAsync,
  refreshTokenAsync,
  registerAsync,
  validateTokenAsync,
  updateProfileAsync,
} from "./auth.thunks";
import type { User } from "../users/user.types";

// LocalStorage keys (usa access_token e refresh_token per coerenza con l'API)
const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "auth_user";
const LAST_ACTIVITY_KEY = "auth_last_activity";

// Helpers for localStorage
const loadFromStorage = () => {
  try {
    if (typeof localStorage === "undefined") {
      return { token: null, refresh: null, user: null, lastActivity: null };
    }

    const token = localStorage.getItem(TOKEN_KEY);
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);
    const lastActivityStr = localStorage.getItem(LAST_ACTIVITY_KEY);
    const user = userStr ? (JSON.parse(userStr) as User) : null;
    const lastActivity = lastActivityStr ? parseInt(lastActivityStr) : null;
    return { token, refresh, user, lastActivity };
  } catch {
    return { token: null, refresh: null, user: null, lastActivity: null };
  }
};

const saveToStorage = (
  token: string | null,
  refresh: string | null,
  user: User | null,
  lastActivity: number | null
) => {
  try {
    if (typeof localStorage === "undefined") return;

    if (token && user) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(
        LAST_ACTIVITY_KEY,
        lastActivity?.toString() ?? Date.now().toString()
      );

      if (refresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(LAST_ACTIVITY_KEY);
    }
  } catch {
    /* empty */
  }
};

const { token, refresh, user, lastActivity } = loadFromStorage();

const initialState: AuthState = {
  user,
  token,
  refresh,
  isAuthenticated: !!token && !!user,
  isInitialized: false,
  isLoading: false,
  error: null,
  lastActivity,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setInitialized: (state) => {
      state.isInitialized = true;
      state.isLoading = false;
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
      saveToStorage(state.token, state.refresh, state.user, state.lastActivity);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveToStorage(
          state.token,
          state.refresh,
          state.user,
          state.lastActivity
        );
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refresh = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastActivity = null;
      saveToStorage(null, null, null, null);
    },
    // Nuovo reducer per impostare i dati auth completi
    setAuthData: (
      state,
      action: PayloadAction<{
        token: string;
        refresh?: string;
        user: User;
      }>
    ) => {
      const { token, refresh, user } = action.payload;
      state.token = token;
      state.refresh = refresh || state.refresh;
      state.user = user;
      state.isAuthenticated = true;
      state.lastActivity = Date.now();
      saveToStorage(token, state.refresh, user, state.lastActivity);
    },
  },
  extraReducers: (builder) => {
    // LOGIN ASYNC
    builder
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
        state.refresh = payload.refresh;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.isLoading = false;
        state.error = null;
        state.lastActivity = Date.now();
        saveToStorage(
          payload.token,
          payload.refresh,
          payload.user,
          state.lastActivity
        );
      })
      .addCase(loginAsync.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
        state.isAuthenticated = false;
      });

    // REGISTER ASYNC
    builder
      .addCase(registerAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.token;
        state.refresh = payload.refresh;
        state.isAuthenticated = true;
        state.isInitialized = true;
        state.isLoading = false;
        state.error = null;
        state.lastActivity = Date.now();
        saveToStorage(
          payload.token,
          payload.refresh,
          payload.user,
          state.lastActivity
        );
      })
      .addCase(registerAsync.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
        state.isAuthenticated = false;
      });

    // LOGOUT ASYNC
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refresh = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastActivity = null;
      state.isLoading = false;
      saveToStorage(null, null, null, null);
    });

    // INITIALIZE AUTH ASYNC
    builder
      .addCase(initializeAuthAsync.pending, (state) => {
        // Solo se non stiamo già facendo login/register
        if (!state.isLoading) {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(initializeAuthAsync.fulfilled, (state, { payload }) => {
        state.isInitialized = true;
        state.isLoading = false;

        if (payload) {
          // Payload contiene { token, user }
          state.token = payload.token;
          state.user = payload.user;
          state.isAuthenticated = true;
          state.lastActivity = Date.now();
          saveToStorage(
            payload.token,
            state.refresh,
            payload.user,
            state.lastActivity
          );
        } else {
          // Nessun token valido trovato
          if (state.isAuthenticated) {
            state.user = null;
            state.token = null;
            state.refresh = null;
            state.isAuthenticated = false;
            state.lastActivity = null;
            saveToStorage(null, null, null, null);
          }
        }
      })
      .addCase(initializeAuthAsync.rejected, (state) => {
        state.isInitialized = true;
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refresh = null;
        state.lastActivity = null;
        saveToStorage(null, null, null, null);
      });

    // REFRESH TOKEN ASYNC
    builder
      .addCase(refreshTokenAsync.pending, (state) => {
        // Non mostrare loading per refresh automatico
        state.error = null;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.refresh = payload.refresh;
        state.isAuthenticated = true;
        state.lastActivity = Date.now();

        // Se il refresh ha restituito anche user data, aggiornala
        if (payload.user) {
          state.user = payload.user;
        }

        saveToStorage(
          payload.token,
          payload.refresh,
          state.user,
          state.lastActivity
        );
      })
      .addCase(refreshTokenAsync.rejected, (state, { payload }) => {
        state.isAuthenticated = false;
        state.token = null;
        state.refresh = null;
        state.user = null;
        state.lastActivity = null;
        state.error = payload as string;
        saveToStorage(null, null, null, null);
      });

    // VALIDATE TOKEN ASYNC
    builder
      .addCase(validateTokenAsync.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isAuthenticated = true;
        state.lastActivity = Date.now();
        saveToStorage(state.token, state.refresh, payload, state.lastActivity);
      })
      .addCase(validateTokenAsync.rejected, (state, { payload }) => {
        state.isAuthenticated = false;
        state.token = null;
        state.refresh = null;
        state.user = null;
        state.lastActivity = null;
        state.error = payload as string;
        saveToStorage(null, null, null, null);
      });

    // UPDATE PROFILE ASYNC
    builder
      .addCase(updateProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, { payload }) => {
        state.user = payload;
        state.isLoading = false;
        state.lastActivity = Date.now();
        saveToStorage(state.token, state.refresh, payload, state.lastActivity);
      })
      .addCase(updateProfileAsync.rejected, (state, { payload }) => {
        state.isLoading = false;
        state.error = payload as string;
      });

    // RTK QUERY MATCHERS per il login/register (se usi direttamente le mutation)
    builder
      .addMatcher(
        authApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          // Questo è già gestito da loginAsync, ma mantienilo per sicurezza
          if (!state.isAuthenticated) {
            state.token = payload.token;
            state.refresh = payload.refresh;
            state.user = payload.user;
            state.isAuthenticated = true;
            state.lastActivity = Date.now();
            saveToStorage(
              payload.token,
              payload.refresh,
              payload.user,
              state.lastActivity
            );
          }
        }
      )
      .addMatcher(
        authApi.endpoints.refresh.matchFulfilled,
        (state, { payload }) => {
          // Questo è già gestito da refreshTokenAsync, ma mantienilo per sicurezza
          if (state.isAuthenticated) {
            state.token = payload.token;
            if (payload.refresh) {
              state.refresh = payload.refresh;
            }
            state.lastActivity = Date.now();
            saveToStorage(
              state.token,
              state.refresh,
              state.user,
              state.lastActivity
            );
          }
        }
      )
      .addMatcher(
        authApi.endpoints.updateProfile.matchFulfilled,
        (state, { payload }) => {
          state.user = payload;
          state.lastActivity = Date.now();
          saveToStorage(
            state.token,
            state.refresh,
            payload,
            state.lastActivity
          );
        }
      );

    // Gestisci errori di autenticazione generici
    builder.addMatcher(
      (action) => {
        return (
          action.type.endsWith("/rejected") &&
          action.meta?.arg?.endpointName &&
          (action.payload?.status === 401 || action.payload?.status === 403)
        );
      },
      (state) => {
        // Token probabilmente scaduto o non valido
        if (state.isAuthenticated && !action.type.includes("refresh")) {
          // Non fare logout automatico per errori di refresh
          state.error = "Sessione scaduta";
        }
      }
    );
  },
});

export const {
  clearError,
  setInitialized,
  updateLastActivity,
  setLoading,
  updateUser,
  logout,
  setAuthData,
} = authSlice.actions;

export default authSlice.reducer;
