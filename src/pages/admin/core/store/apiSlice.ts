// @store_admin/apiSlice.ts - VERSIONE CON AUTO-REFRESH
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState } from "@root/store";
import { refreshTokenAsync, logoutAsync } from "./auth/auth.thunks";

const apiHassanUrl = import.meta.env.VITE_API_HASSAN_URL;

const SCOPE_ALLOWLIST: RegExp[] = [
  /^joined-machines-gps(\/|$)/,
  /^user(\/|$)/,
  /^gps(\/|$)/,
  /^message(\/|$)/,
  /^log(\/|$)/,
];

export function noScope<T extends string | FetchArgs>(args: T): T {
  if (typeof args === "string") {
    return { url: args, __skipScope: true } as any;
  }
  return { ...(args as any), __skipScope: true };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiHassanUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

/** Base query con scope e auto-refresh */
const baseQueryWithScope: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extra) => {
  const state = api.getState() as RootState;
  const customer = state.scope.customer;

  // Normalizza args e leggi il flag __skipScope
  let req: FetchArgs;
  let skip = false;
  if (typeof args === "string") {
    req = { url: args };
  } else {
    const { __skipScope, ...rest } = (args as any) || {};
    skip = Boolean(__skipScope);
    req = rest as FetchArgs;
  }

  // Applica scope se necessario
  if (customer && !skip) {
    const url = (req.url || "").replace(/^\//, "");
    const isAllowed = SCOPE_ALLOWLIST.some((rx) => rx.test(url));
    if (isAllowed) {
      req = {
        ...req,
        params: { ...(req.params || {}), customer_Name: customer },
      };
    }
  }

  // Prima chiamata
  let result = await rawBaseQuery(req, api, extra);

  // Se riceviamo 401/403, prova refresh automatico
  if (
    result.error &&
    (result.error.status === 401 || result.error.status === 403)
  ) {
    const currentState = api.getState() as RootState;
    const { refresh: refreshToken, isAuthenticated } = currentState.auth;

    // Solo se siamo autenticati e abbiamo refresh token
    // E NON stiamo già facendo refresh/login/logout
    if (
      refreshToken &&
      isAuthenticated &&
      !req.url?.includes("/auth/refresh") &&
      !req.url?.includes("/auth/login") &&
      !req.url?.includes("/auth/logout")
    ) {
      console.log("🔄 Auto-refreshing token for failed request:", req.url);

      try {
        // Prova il refresh
        const refreshResult = await api.dispatch(refreshTokenAsync());

        if (refreshTokenAsync.fulfilled.match(refreshResult)) {
          console.log("✅ Token refreshed, retrying original request");

          // Riprova la chiamata originale con nuovo token
          result = await rawBaseQuery(req, api, extra);
        } else {
          console.log("❌ Token refresh failed, logging out");
          await api.dispatch(logoutAsync());
        }
      } catch (error) {
        console.error("❌ Auto-refresh error:", error);
        await api.dispatch(logoutAsync());
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithScope,
  tagTypes: ["LIST", "ENTITY", "STATS"],
  endpoints: () => ({}),
});

export const { reducerPath, middleware } = apiSlice;
