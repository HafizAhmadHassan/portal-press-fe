// store/auth/auth.api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '@store_admin/store';
import type { AuthResponse, LoginCredentials, RegisterCredentials, User } from './auth.types';
import { API_BASE_URL } from '@env';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include', // include cookies if using session cookies
  }),
  tagTypes: ['Auth', 'User'],
  endpoints: (builder) => ({
    // Login (OAuth2 Password Grant)
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: ({ email, password, rememberMe }) => ({
        url: '/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          username: email,
          password,
          grant_type: 'password',
          ...(rememberMe && { remember_me: 'true' })
        }),
      }),
      transformResponse: (response: any): AuthResponse => {
        console.log('API: Raw login response:', response);

        // Gestisce il formato OAuth2 standard
        if (response.access_token) {
          return {
            token: response.access_token,
            refreshToken: response.refresh_token,
            user: response.user || {
              id: 'temp',
              email: 'unknown',
              name: 'User',
              role: 'user',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          };
        }

        // Gestisce il formato personalizzato
        return response;
      },
      invalidatesTags: ['Auth'],
    }),

    // Register (JSON)
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    // Logout
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: '/logout', method: 'POST' }),
      invalidatesTags: ['Auth'],
    }),

    // Refresh Token (form-data)
    refreshToken: builder.mutation<{ token: string; refreshToken: string }, { refreshToken: string }>({
      query: ({ refreshToken }) => ({
        url: '/refresh',
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        }),
      }),
      invalidatesTags: ['Auth'],
    }),

    // Get Current User (verify + fetch profile)
    getCurrentUser: builder.query<User, void>({
      query: () => ({ url: '/me', method: 'GET' }),
      providesTags: ['User'],
    }),

    // Forgot Password (JSON)
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: ({ email }) => ({
        url: '/forgot-password',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { email },
      }),
    }),

    // Reset Password (JSON)
    resetPassword: builder.mutation<{ message: string }, {
      token: string;
      password: string;
      confirmPassword: string;
    }>({
      query: ({ token, password, confirmPassword }) => ({
        url: '/reset-password',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { token, password, confirmPassword },
      }),
    }),

    // Change Password (JSON)
    changePassword: builder.mutation<{ message: string }, {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    }>({
      query: (passwords) => ({
        url: '/change-password',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: passwords,
      }),
    }),

    // Update Profile (JSON)
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: '/profile',
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} = authApi;