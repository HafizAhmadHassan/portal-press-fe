// @store_admin/scope/scope.listener.ts
import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { setCustomer, clearCustomer } from "./scope.slice";
import { apiSlice } from "@store_admin/apiSlice";

export const scopeListener = createListenerMiddleware();

// Flag per evitare invalidazioni durante operazioni CRUD
let isUpdatingData = false;

// Export per controllare il flag da altri componenti
export const setScopeUpdating = (updating: boolean) => {
  isUpdatingData = updating;
  console.log("Scope updating flag:", updating);
};

scopeListener.startListening({
  matcher: isAnyOf(setCustomer, clearCustomer),
  effect: async (action, apiCtx) => {
    // Non invalidare se stiamo facendo operazioni CRUD
    if (isUpdatingData) {
      console.log("Skipping scope invalidation - CRUD operation in progress");
      return;
    }

    const state = apiCtx.getState() as any;
    const prev = state?.scope?.customer ?? null;

    const nextRaw =
      action.type === setCustomer.type ? (action as any).payload ?? "" : "";
    const next = (nextRaw as string).trim() || null;

    if (prev === next) return;

    console.log("Scope customer changed:", { prev, next });

    // persisti il valore
    try {
      if (typeof window !== "undefined") {
        if (next) localStorage.setItem("scope.customer_Name", next);
        else localStorage.removeItem("scope.customer_Name");
      }
    } catch {}

    // Invalida solo i tag LIST e STATS, ma con un delay per evitare race conditions
    setTimeout(() => {
      console.log("Invalidating scope-related caches");
      apiCtx.dispatch(
        apiSlice.util.invalidateTags([
          { type: "LIST" as const },
          { type: "STATS" as const },
        ])
      );
    }, 100);
  },
});
