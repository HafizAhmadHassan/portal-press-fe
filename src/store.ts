// @root/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { uiReducer } from "@store_admin/ui";
import authReducer from "@store_admin/auth/auth.slice";
import userReducer from "@store_admin/users/user.slice";
import devicesReducer from "@store_admin/devices/devices.slice";
import ticketReducer from "@store_admin/tickets/ticket.slice";
import gpsReducer from "@store_admin/gps/gps.slice";
import logsReducer from "@store_admin/logs/logs.slice";
import scopeReducer from "@store_admin/scope/scope.slice";
import plcReducer from "@store_device/plc/plc.slice";

import { authApi } from "@store_admin/auth/auth.api";
import { apiSlice } from "@store_admin/apiSlice";
import { scopeListener } from "@store_admin/scope/scope.listener";

const preloadedCustomer =
  typeof window !== "undefined"
    ? (localStorage.getItem("scope.customer_Name") || "").trim()
    : "";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    users: userReducer,
    devices: devicesReducer,
    tickets: ticketReducer,
    gps: gpsReducer,
    scope: scopeReducer,
    logs: logsReducer,
    plc: plcReducer,

    [authApi.reducerPath]: authApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  preloadedState: {
    scope: { customer: preloadedCustomer || null },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          `${authApi.reducerPath}/executeMutation/pending`,
          `${authApi.reducerPath}/executeMutation/fulfilled`,
          `${authApi.reducerPath}/executeMutation/rejected`,
          `${authApi.reducerPath}/executeQuery/pending`,
          `${authApi.reducerPath}/executeQuery/fulfilled`,
          `${authApi.reducerPath}/executeQuery/rejected`,
          `${apiSlice.reducerPath}/executeMutation/pending`,
          `${apiSlice.reducerPath}/executeMutation/fulfilled`,
          `${apiSlice.reducerPath}/executeMutation/rejected`,
          `${apiSlice.reducerPath}/executeQuery/pending`,
          `${apiSlice.reducerPath}/executeQuery/fulfilled`,
          `${apiSlice.reducerPath}/executeQuery/rejected`,
          "persist/PERSIST",
          "persist/REHYDRATE",
        ],
      },
    })
      .prepend(scopeListener.middleware)
      .concat(authApi.middleware, apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
