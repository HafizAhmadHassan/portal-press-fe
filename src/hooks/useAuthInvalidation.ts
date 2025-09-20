// hooks/useAuthInvalidation.ts
import { useCallback } from "react";

import { apiSlice } from "@store_admin/apiSlice";
import { authApi } from "@store_admin/auth/auth.api";
import { refreshTokenAsync } from "@store_admin/auth/auth.thunks";
import { useAppDispatch } from "@root/pages/admin/core/store/store.hooks";

export const useAuthInvalidation = () => {
  const dispatch = useAppDispatch();

  const invalidateAll = useCallback(() => {
    // Invalida tutte le cache delle API
    dispatch(apiSlice.util.invalidateTags(["LIST", "ENTITY", "STATS"]));
    dispatch(authApi.util.invalidateTags(["Auth", "User"]));
  }, [dispatch]);

  const forceRefreshAndInvalidate = useCallback(async () => {
    try {
      console.log("🔄 Manual refresh and invalidation...");

      // 1. Refresh token
      await dispatch(refreshTokenAsync()).unwrap();

      // 2. Invalida tutte le cache
      invalidateAll();

      console.log("✅ Manual refresh completed");
      return true;
    } catch (error) {
      console.error("❌ Manual refresh failed:", error);
      return false;
    }
  }, [dispatch, invalidateAll]);

  const clearAllCache = useCallback(() => {
    // Reset completo di tutte le cache API
    dispatch(apiSlice.util.resetApiState());
    dispatch(authApi.util.resetApiState());
  }, [dispatch]);

  return {
    invalidateAll,
    forceRefreshAndInvalidate,
    clearAllCache,
  };
};
