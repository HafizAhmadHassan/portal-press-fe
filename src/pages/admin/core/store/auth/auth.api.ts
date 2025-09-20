// store/auth/auth.api.ts - FIXED VERSION
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "@root/store";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
} from "./auth.types";
import type { User } from "../users/user.types";
import { UserRoles } from "@root/utils/constants/userRoles";

const apiHassanUrl = import.meta.env.VITE_API_HASSAN_URL;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiHassanUrl}api/auth`,
    prepareHeaders: (headers, { getState, endpoint }) => {
      // ✅ Non aggiungere Authorization per login, register e refresh
      if (["login", "register", "refresh"].includes(endpoint)) {
        return headers;
      }

      const state = getState() as RootState;

      // Prioritizza il token dallo store Redux
      const token =
        state.auth?.token ??
        (typeof localStorage !== "undefined"
          ? localStorage.getItem("access_token")
          : null);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log(`🔐 Adding auth header for ${endpoint}`);
      } else {
        console.warn(`⚠️ No token available for ${endpoint}`);
      }

      return headers;
    },
    credentials: "include",
  }),
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    // === LOGIN ===
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: ({ username, password, rememberMe }) => {
        // ✅ prima di loggarsi puliamo eventuali token scaduti
        if (typeof localStorage !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }

        return {
          url: "/login/",
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username,
            password,
            ...(rememberMe ? { remember_me: "true" } : {}),
          }),
        };
      },
      transformResponse: (response: any): AuthResponse => {
        if (response?.access && response?.refresh) {
          return {
            token: response.access,
            refresh: response.refresh,
            user:
              response.user ??
              ({
                id: response?.user?.id ?? "temp",
                email: response?.user?.email ?? "unknown",
                username: response?.user?.username ?? "User",
                role: response?.user?.role ?? UserRoles.USER,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              } as unknown as User),
          };
        }

        if (response?.access_token) {
          return {
            token: response.access_token,
            refresh: response.refresh_token,
            user:
              response.user ??
              ({
                id: response?.user?.id ?? "temp",
                email: response?.user?.email ?? "unknown",
                name: response?.user?.name ?? "User",
                role: response?.user?.role ?? UserRoles.USER,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              } as unknown as User),
          };
        }

        return response;
      },
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof localStorage !== "undefined") {
            if (data?.token) localStorage.setItem("access_token", data.token);
            if ((data as any)?.refresh)
              localStorage.setItem("refresh_token", (data as any).refresh);
          }
        } catch {
          // noop
        }
      },
      invalidatesTags: ["Auth"],
    }),

    // === REGISTER ===
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: "/register/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // === LOGOUT ===
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/logout/", method: "POST" }),
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          if (typeof localStorage !== "undefined") {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        }
      },
      invalidatesTags: ["Auth"],
    }),

    // === REFRESH TOKEN - FIXED ===
    refresh: builder.mutation<
      { token: string; refresh: string },
      { refresh: string }
    >({
      query: ({ refresh }) => ({
        url: "/refresh/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { refresh },
      }),
      transformResponse: (response: any) => {
        console.log("🔄 Refresh response:", response);

        // ✅ Risposta corretta con access token
        if (response?.access) {
          console.log("✅ Token refresh successful!");
          return {
            token: response.access,
            refresh: response.refresh,
          };
        }

        // Formato alternativo (access_token invece di access)
        if (response?.access_token) {
          return {
            token: response.access_token,
            refresh: response.refresh_token,
          };
        }

        console.error(
          "❌ Formato risposta refresh non riconosciuto:",
          response
        );
        throw new Error("Formato risposta refresh non valido");
      },
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof localStorage !== "undefined") {
            if (data?.token) localStorage.setItem("access_token", data.token);
            if (data?.refresh)
              localStorage.setItem("refresh_token", data.refresh);
          }
        } catch (error) {
          console.error("❌ Errore durante il refresh:", error);
        }
      },
      invalidatesTags: ["Auth"],
    }),

    // === GET CURRENT USER ===
    getCurrentUser: builder.query<User, void>({
      query: () => ({ url: "/me/", method: "GET" }),
      providesTags: ["User"],
    }),

    // === PASSWORD ===
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: ({ email }) => ({
        url: "/forgot-password/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email },
      }),
    }),

    resetPassword: builder.mutation<
      { message: string },
      { token: string; password: string; confirmPassword: string }
    >({
      query: ({ token, password, confirmPassword }) => ({
        url: "/reset-password/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { token, password, confirmPassword },
      }),
    }),

    changePassword: builder.mutation<
      { message: string },
      { currentPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (passwords) => ({
        url: "/change-password/",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: passwords,
      }),
    }),

    // === UPDATE PROFILE ===
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: "/profile/",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: updates,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = authApi;
