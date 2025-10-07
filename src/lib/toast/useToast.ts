// 🪝 Hook useToast - Interfaccia semplice per mostrare toast
import { useCallback } from "react";
import { useToastContext } from "./ToastContext";
import type { ToastConfig } from "./ToastContext";

export const useToast = () => {
  const { showToast, hideToast, clearAll } = useToastContext();

  const toast = useCallback(
    (config: ToastConfig | string) => {
      if (typeof config === "string") {
        showToast({ message: config });
      } else {
        showToast(config);
      }
    },
    [showToast]
  );

  const success = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast({ type: "success", message, title, duration });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast({ type: "error", message, title, duration });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast({ type: "warning", message, title, duration });
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, title?: string, duration?: number) => {
      showToast({ type: "info", message, title, duration });
    },
    [showToast]
  );

  return {
    // Metodo generico
    toast,
    // Metodi shorthand
    success,
    error,
    warning,
    info,
    // Utility
    hide: hideToast,
    clearAll,
  };
};
