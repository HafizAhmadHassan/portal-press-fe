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
} from "./auth.thunks";
import type { User } from "../users/user.types";

// LocalStorage keys
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_KEY = "auth_user";
const LAST_ACTIVITY_KEY = "auth_last_activity";

// Helpers for localStorage
const loadFromStorage = () => {
  try {
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
    if (token && refresh && user) {
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(
        LAST_ACTIVITY_KEY,
        lastActivity?.toString() ?? Date.now().toString()
      );
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
        state.isInitialized = true; // IMPORTANTE: marca come inizializzato dopo login
        state.isLoading = false;
        state.error = null;
        state.lastActivity = Date.now();
        // CORRETTO: usa payload.user invece di user
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
        state.isLoading = false;
        state.error = null;
        state.lastActivity = Date.now();
        // CORRETTO: usa payload.user invece di user
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
      });

    // LOGOUT ASYNC
    builder.addCase(logoutAsync.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refresh = null;
      state.isAuthenticated = false;
      state.error = null;
      state.lastActivity = null;
      saveToStorage(null, null, null, null);
    });

    // INITIALIZE AUTH ASYNC
    builder
      .addCase(initializeAuthAsync.pending, () => {
        // Non cambiare isLoading qui per non interferire con il login
      })
      .addCase(initializeAuthAsync.fulfilled, (state, { payload }) => {
        state.isInitialized = true;
        if (payload) {
          const user = payload;
          state.user = user;
          state.isAuthenticated = true;
          state.lastActivity = Date.now();
          saveToStorage(state.token, state.refresh, user, state.lastActivity);
        } else {
          // Payload è null - nessun token da verificare, ma inizializzazione completata
          if (!state.isAuthenticated) {
            state.isAuthenticated = false;
            saveToStorage(null, null, null, null);
          }
        }
      })
      .addCase(initializeAuthAsync.rejected, (state) => {
        state.isInitialized = true;
        state.isAuthenticated = false;
        saveToStorage(null, null, null, null);
      });

    // REFRESH TOKEN ASYNC
    builder
      .addCase(refreshTokenAsync.fulfilled, (state, { payload }) => {
        state.token = payload.token;
        state.refresh = payload.refresh;
        state.isAuthenticated = true;
        state.lastActivity = Date.now();
        saveToStorage(
          payload.token,
          payload.refresh,
          state.user,
          state.lastActivity
        );
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.refresh = null;
        state.user = null;
        saveToStorage(null, null, null, null);
      });

    // RTK QUERY MATCHERS (mantieni questi se usi anche RTK Query)
    builder
      .addMatcher(
        authApi.endpoints.getCurrentUser.matchFulfilled,
        (state, { payload }) => {
          const user = payload;
          state.user = user;
          state.isAuthenticated = true;
          state.lastActivity = Date.now();
          saveToStorage(state.token, state.refresh, user, state.lastActivity);
        }
      )
      .addMatcher(authApi.endpoints.getCurrentUser.matchRejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.refresh = null;
        state.user = null;
        saveToStorage(null, null, null, null);
      });
  },
});

export const {
  clearError,
  setInitialized,
  updateLastActivity,
  setLoading,
  updateUser,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
