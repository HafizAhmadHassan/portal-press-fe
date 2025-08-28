import { useCallback } from "react";
import { toAppError } from "@root/utils/errorHandling";

/** Esegue unwrap() se disponibile (RTK), altrimenti attende la Promise normale */
async function unwrapIfPossible<T>(result: any): Promise<T> {
  if (result && typeof result.unwrap === "function") {
    return await result.unwrap();
  }
  return await result;
}

/**
 * Hook CRUD generico, type-safe: l’argomento viene inferito
 * automaticamente dal tipo del trigger passato.
 */
export function useCrud() {
  const wrap = useCallback(async <T>(p: Promise<T>) => {
    try {
      const res = await p;
      return { success: true as const, data: res };
    } catch (err) {
      const appErr = toAppError(err);
      return {
        success: false as const,
        error: appErr?.message || "Operazione fallita",
      };
    }
  }, []);

  return {
    execCreate: async <F extends (arg: any) => any>(
      trigger: F,
      arg: Parameters<F>[0]
    ) => {
      return wrap(unwrapIfPossible<ReturnType<F>>(trigger(arg) as any) as any);
    },

    execUpdate: async <F extends (arg: any) => any>(
      trigger: F,
      arg: Parameters<F>[0]
    ) => {
      return wrap(unwrapIfPossible<ReturnType<F>>(trigger(arg) as any) as any);
    },

    execDelete: async <F extends (arg: any) => any>(
      trigger: F,
      arg: Parameters<F>[0]
    ) => {
      return wrap(unwrapIfPossible<ReturnType<F>>(trigger(arg) as any) as any);
    },
  };
}
