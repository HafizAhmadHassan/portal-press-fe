// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { uiReducer } from "@store_admin/ui";
import authReducer from "@store_admin/auth/auth.slice";
import userReducer from "@store_admin/users/user.slice";
import devicesReducer from "@store_admin/devices/devices.slice";
import ticketReducer from "@store_admin/tickets/ticket.slice";
import gpsReducer from "@store_admin/gps/gps.slice";

import { authApi } from "@store_admin/auth/auth.api";
import { usersApi } from "@store_admin/users/user.api";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    users: userReducer,
    devices: devicesReducer,
    tickets: ticketReducer,
    gps: gpsReducer,
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          // Ignora le azioni RTK Query se necessario
          "authApi/executeMutation/pending",
          "authApi/executeMutation/fulfilled",
          "authApi/executeMutation/rejected",
          "authApi/executeQuery/pending",
          "authApi/executeQuery/fulfilled",
          "authApi/executeQuery/rejected",
          "usersApi/executeMutation/pending",
          "usersApi/executeMutation/fulfilled",
          "usersApi/executeMutation/rejected",
          "usersApi/executeQuery/pending",
          "usersApi/executeQuery/fulfilled",
          "usersApi/executeQuery/rejected",
        ],
      },
    })
      // concateniamo entrambe le middleware RTK Query
      .concat(authApi.middleware, usersApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Abilitiamo listener (per re-fetch on focus, retry ecc.) sia per authApi che usersApi
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
