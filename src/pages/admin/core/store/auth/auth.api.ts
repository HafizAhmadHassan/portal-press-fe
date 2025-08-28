// store/auth/auth.api.ts
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
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;

      // Leggi prima dal tuo slice, altrimenti da localStorage (fallback)
      const token =
        (state as any)?.auth?.token ??
        (typeof localStorage !== "undefined"
          ? localStorage.getItem("access_token")
          : null);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
    credentials: "include", // include cookies if using session cookies
  }),
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    // Login (Password Grant / SimpleJWT compat)
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: ({ username, password, rememberMe }) => ({
        url: "/login/",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username,
          password,
          ...(rememberMe ? { remember_me: "true" } : {}),
        }),
      }),
      transformResponse: (response: any): AuthResponse => {
        // Log utile in dev

        // 1) Django SimpleJWT (access/refresh)
        if (response?.access && response?.refresh) {
          console.log("API: Raw login response:", response);
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

        // 2) OAuth2 tipico (access_token/refresh_token)
        if (response?.access_token) {
          return {
            token: response.access_token,
            refresh: response.refresh,
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

        // 3) Già nel formato giusto
        return response;
      },
      // Salva token in localStorage così prepareHeaders li trova subito
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof localStorage !== "undefined") {
            if (data?.token) localStorage.setItem("access_token", data.token);
            if ((data as any)?.refresh)
              localStorage.setItem("refresh_token", (data as any).refresh);
          }
          // Se hai un slice auth:
          // dispatch(setTokens({ token: data.token, refresh: data.refresh, user: data.user }))
        } catch {
          // noop
        }
      },
      invalidatesTags: ["Auth"],
    }),

    // Register (JSON)
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Logout
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: "/logout", method: "POST" }),
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

    // Refresh Token (form-data o SimpleJWT)
    refresh: builder.mutation<
      { token: string; refresh: string },
      { refresh: string }
    >({
      query: ({ refresh }) => ({
        url: "/refresh",
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        // Per SimpleJWT il campo si chiama "refresh"
        body: new URLSearchParams({
          refresh: refresh,
          // grant_type: "refresh_token", // non necessario per SimpleJWT
        }),
      }),
      transformResponse: (response: any) => {
        // SimpleJWT di solito ritorna solo un nuovo `access`
        if (response?.access) {
          return {
            token: response.access,
            refresh:
              response.refresh ??
              (typeof localStorage !== "undefined"
                ? localStorage.getItem("refresh_token") ?? ""
                : ""),
          };
        }
        if (response?.access_token) {
          return {
            token: response.access_token,
            refresh: response.refresh_token,
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

    // Get Current User (verify + fetch profile)
    getCurrentUser: builder.query<User, void>({
      query: () => ({ url: "/me", method: "GET" }),
      providesTags: ["User"],
    }),

    // Forgot Password (JSON)
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: ({ email }) => ({
        url: "/forgot-password",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { email },
      }),
    }),

    // Reset Password (JSON)
    resetPassword: builder.mutation<
      { message: string },
      {
        token: string;
        password: string;
        confirmPassword: string;
      }
    >({
      query: ({ token, password, confirmPassword }) => ({
        url: "/reset-password",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { token, password, confirmPassword },
      }),
    }),

    // Change Password (JSON)
    changePassword: builder.mutation<
      { message: string },
      {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: (passwords) => ({
        url: "/change-password",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: passwords,
      }),
    }),

    // Update Profile (JSON)
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: "/profile",
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
