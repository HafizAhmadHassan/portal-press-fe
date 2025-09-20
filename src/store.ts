// @root/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

// Reducers
import { uiReducer } from "@store_admin/ui";
import authReducer from "@store_admin/auth/auth.slice";
import userReducer from "@store_admin/users/user.slice";
import devicesReducer from "@store_admin/devices/devices.slice";
import ticketReducer from "@store_admin/tickets/ticket.slice";
import gpsReducer from "@store_admin/gps/gps.slice";
import logsReducer from "@store_admin/logs/logs.slice";
import scopeReducer from "@store_admin/scope/scope.slice";
import plcReducer from "@store_device/plc/plc.slice";

// APIs
import { authApi } from "@store_admin/auth/auth.api";
import { apiSlice } from "@store_admin/apiSlice";

// Listeners/Middleware
import { scopeListener } from "@store_admin/scope/scope.listener";

// Preload customer da localStorage
const preloadedCustomer =
  typeof window !== "undefined"
    ? (localStorage.getItem("scope.customer_Name") || "").trim()
    : "";

export const store = configureStore({
  reducer: {
    // UI & Core
    ui: uiReducer,
    auth: authReducer,
    scope: scopeReducer,

    // Domain slices
    users: userReducer,
    devices: devicesReducer,
    tickets: ticketReducer,
    gps: gpsReducer,
    logs: logsReducer,
    plc: plcReducer,

    // API slices
    [authApi.reducerPath]: authApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  preloadedState: {
    scope: { customer: preloadedCustomer || null },
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignora azioni RTK Query che potrebbero contenere valori non serializzabili
        ignoredActions: [
          // Auth API actions
          `${authApi.reducerPath}/executeMutation/pending`,
          `${authApi.reducerPath}/executeMutation/fulfilled`,
          `${authApi.reducerPath}/executeMutation/rejected`,
          `${authApi.reducerPath}/executeQuery/pending`,
          `${authApi.reducerPath}/executeQuery/fulfilled`,
          `${authApi.reducerPath}/executeQuery/rejected`,

          // Main API actions
          `${apiSlice.reducerPath}/executeMutation/pending`,
          `${apiSlice.reducerPath}/executeMutation/fulfilled`,
          `${apiSlice.reducerPath}/executeMutation/rejected`,
          `${apiSlice.reducerPath}/executeQuery/pending`,
          `${apiSlice.reducerPath}/executeQuery/fulfilled`,
          `${apiSlice.reducerPath}/executeQuery/rejected`,

          // Persistence actions
          "persist/PERSIST",
          "persist/REHYDRATE",

          // Auth thunk actions (se causano problemi di serialization)
          "auth/loginAsync/pending",
          "auth/loginAsync/fulfilled",
          "auth/loginAsync/rejected",
          "auth/refreshTokenAsync/pending",
          "auth/refreshTokenAsync/fulfilled",
          "auth/refreshTokenAsync/rejected",
        ],

        // Ignora path che contengono valori non serializzabili
        ignoredPaths: [
          // RTK Query internal state
          `${authApi.reducerPath}.queries`,
          `${authApi.reducerPath}.mutations`,
          `${authApi.reducerPath}.provided`,
          `${authApi.reducerPath}.subscriptions`,
          `${apiSlice.reducerPath}.queries`,
          `${apiSlice.reducerPath}.mutations`,
          `${apiSlice.reducerPath}.provided`,
          `${apiSlice.reducerPath}.subscriptions`,

          // Date objects o altri valori non serializzabili nell'auth state
          "auth.lastActivity", // se contiene oggetti Date
        ],
      },

      // Configurazioni aggiuntive per performance
      immutableCheck: {
        // Disabilita check di immutabilità per RTK Query (migliori performance)
        ignoredPaths: [`${authApi.reducerPath}`, `${apiSlice.reducerPath}`],
      },
    })
      // Ordine dei middleware è importante
      .prepend(scopeListener.middleware) // Scope listener per primo
      .concat(
        authApi.middleware, // Auth API middleware
        apiSlice.middleware // Main API middleware
      ),

  devTools: process.env.NODE_ENV !== "production" && {
    // Configurazione DevTools ottimizzata
    name: "Admin Store",
    trace: true,
    traceLimit: 25,

    // Serializza le azioni per DevTools
    serialize: {
      options: {
        undefined: true,
        function: true,
        symbol: true,
      },
    },

    // Filtra azioni rumorose dai DevTools
    actionsDenylist: [
      // Filtra azioni RTK Query molto frequenti
      `${authApi.reducerPath}/executeQuery/pending`,
      `${authApi.reducerPath}/executeQuery/fulfilled`,
      `${apiSlice.reducerPath}/executeQuery/pending`,
      `${apiSlice.reducerPath}/executeQuery/fulfilled`,
    ],
  },
});

// Setup listeners per RTK Query
// Abilita comportamenti come refetchOnFocus, refetchOnReconnect
setupListeners(store.dispatch);

// Tipi per TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Selettori di utilità
export const selectAuthState = (state: RootState) => state.auth;
export const selectScopeState = (state: RootState) => state.scope;
export const selectUIState = (state: RootState) => state.ui;

// Helper per debugging (solo development)
if (process.env.NODE_ENV === "development") {
  // Esponi store nel window per debugging
  (window as any).__store__ = store;

  // Log della configurazione
  console.log("🏪 Store configured with:", {
    reducers: Object.keys(store.getState()),
    preloadedCustomer,
    middleware: ["scopeListener", "authApi.middleware", "apiSlice.middleware"],
  });
}

export default store;
