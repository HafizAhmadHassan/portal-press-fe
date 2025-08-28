// store/auth/actions.ts

// 1) Azioni sincrone dal slice
export {
  clearError,
  setInitialized,
  updateLastActivity,
  setLoading,
  updateUser,
  logout,
} from "./auth.slice.ts";

// 2) Thunk asincroni
export {
  loginAsync,
  registerAsync,
  logoutAsync,
  refreshTokenAsync,
  initializeAuthAsync,
  checkSessionTimeout,
  forgotPasswordAsync,
  resetPasswordAsync,
} from "./auth.thunks.ts";

// 3) Hook RTK Query
export {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
} from "./auth.api.ts";
