// @store_admin/scope/scope.listener.ts
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCustomer, clearCustomer } from "./scope.slice";
import { apiSlice } from "@store_admin/apiSlice";

export const scopeListener = createListenerMiddleware();

scopeListener.startListening({
  matcher: isAnyOf(setCustomer, clearCustomer),
  effect: async (action, apiCtx) => {
    const state = apiCtx.getState() as any;
    const prev = state?.scope?.customer ?? null;

    const nextRaw =
      action.type === setCustomer.type ? (action as any).payload ?? "" : "";
    const next = (nextRaw as string).trim() || null;

    if (prev === next) return;

    // persisti il valore
    try {
      if (typeof window !== "undefined") {
        if (next) localStorage.setItem("scope.customer_Name", next);
        else localStorage.removeItem("scope.customer_Name");
      }
    } catch {}

    // 🔥 invalida le tag "scoped" → le query attive rifanno la fetch
    apiCtx.dispatch(
      apiSlice.util.invalidateTags([
        { type: "LIST" as const },
        { type: "STATS" as const },

        // { type: "ENTITY" as const }, // scommenta se vuoi rifare anche i dettagli
      ])
    );
  },
});
