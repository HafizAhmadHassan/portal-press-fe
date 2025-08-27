// @store_admin/apiSlice.ts
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
} from "@reduxjs/toolkit/query/react";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { RootState } from "@root/store";

const apiHassanUrl = import.meta.env.VITE_API_HASSAN_URL;

/** ✅ SOLO questi path riceveranno automaticamente il filtro global */
// @store_admin/apiSlice.ts
const SCOPE_ALLOWLIST: RegExp[] = [
  /^joined-machines-gps(\/|$)/,
  /^user(\/|$)/, // users
  /^gps(\/|$)/, // gps
  /^message(\/|$)/, // tickets/messages
  /^log(\/|$)/, // ✅ logs  <-- AGGIUNTO
];

/** (opzionale) helper per disattivare lo scope su una singola request */
export function noScope<T extends string | FetchArgs>(args: T): T {
  if (typeof args === "string") {
    return { url: args, /* @ts-expect-error */ __skipScope: true } as any;
  }
  return { ...(args as any), /* @ts-expect-error */ __skipScope: true };
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: apiHassanUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    /* const customer = state.scope.customer; */

    if (token) headers.set("Authorization", `Bearer ${token}`);

    return headers;
  },
});

/** Inietta ?customer_Name=<val> solo se l'URL è allowlistato e non c'è noScope */
const baseQueryWithScope: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extra) => {
  const state = api.getState() as RootState;
  const customer = state.scope.customer;

  // normalizza args e leggi il flag __skipScope se presente
  let req: FetchArgs;
  let skip = false;
  if (typeof args === "string") {
    req = { url: args };
  } else {
    const { __skipScope, ...rest } = (args as any) || {};
    skip = Boolean(__skipScope);
    req = rest as FetchArgs;
  }

  // se non ho customer o lo scope è disattivato, non inietto
  if (!customer || skip) {
    return rawBaseQuery(req, api, extra);
  }

  const url = (req.url || "").replace(/^\//, "");
  const isAllowed = SCOPE_ALLOWLIST.some((rx) => rx.test(url));
  if (!isAllowed) {
    return rawBaseQuery(req, api, extra);
  }

  // inietto customer_Name nei params
  const next: FetchArgs = {
    ...req,
    params: { ...(req.params || {}), customer_Name: customer },
  };
  return rawBaseQuery(next, api, extra);
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithScope,
  tagTypes: ["LIST", "ENTITY", "STATS"],
  endpoints: () => ({}),
});

export const { reducerPath, middleware } = apiSlice;
