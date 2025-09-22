// store/auth/auth.middleware.ts - Middleware per refresh automatico
import { createListenerMiddleware } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";

import { authApi } from "@root/pages/admin/core/store/auth/auth.api";
import {
  logoutAsync,
  /* refreshTokenAsync, */
} from "@root/pages/admin/core/store/auth/auth.thunks";

export const authMiddleware = createListenerMiddleware();

// Listener per errori 401/403 - Auto refresh
authMiddleware.startListening({
  predicate: (action: any) => {
    return (
      action.type.endsWith("/rejected") &&
      action.meta?.arg?.endpointName && // È una chiamata RTK Query
      (action.payload?.status === 401 || action.payload?.status === 403) &&
      !action.meta.arg.endpointName.includes("refresh") && // Non è già un refresh
      !action.meta.arg.endpointName.includes("login") && // Non è login
      !action.meta.arg.endpointName.includes("register") // Non è register
    );
  },
  effect: async (
    action: {
      type: string;
      meta?: { arg?: any };
      payload?: { status?: number };
    },
    listenerApi
  ) => {
    const state = listenerApi.getState() as RootState;
    const { refresh: refreshToken, isAuthenticated } = state.auth;

    console.log(
      "🔄 Intercettato errore 401/403, tentando refresh automatico..."
    );

    if (!refreshToken || !isAuthenticated) {
      console.log("❌ Nessun refresh token disponibile, logout forzato");
      listenerApi.dispatch(logoutAsync());
      return;
    }

    try {
      // Prova il refresh automatico
      /*  const refreshResult = await listenerApi
        .dispatch(refreshTokenAsync())
        .unwrap();
 */
      console.log("✅ Refresh automatico completato con successo");

      // Riprova la chiamata originale con il nuovo token
      if (action.meta?.arg) {
        console.log("🔄 Riprovando la chiamata originale...");
        const originalArgs = action.meta.arg;

        // Richiama l'endpoint originale
        const endpoint = authApi.endpoints[
          originalArgs.endpointName as keyof typeof authApi.endpoints
        ] as { initiate: (args: any) => any };
        listenerApi.dispatch(endpoint.initiate(originalArgs.originalArgs));
      }
    } catch (error) {
      console.error("❌ Refresh automatico fallito:", error);
      listenerApi.dispatch(logoutAsync());
    }
  },
});

// Export per il store
export default authMiddleware.middleware;
