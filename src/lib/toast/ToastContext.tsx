// 🍞 Toast Context - Gestione globale dei toast
import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastConfig {
  id?: string;
  type?: ToastType;
  title?: string;
  message: string;
  duration?: number;
  position?: ToastPosition;
  dismissible?: boolean;
  onClose?: () => void;
}

export interface Toast extends Required<Omit<ToastConfig, "onClose">> {
  onClose?: () => void;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (config: ToastConfig) => void;
  hideToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastCounter = 0;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.onClose) {
        toast.onClose();
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const showToast = useCallback(
    (config: ToastConfig) => {
      const id = config.id || `toast-${++toastCounter}`;

      const toast: Toast = {
        id,
        type: config.type || "info",
        title: config.title || "",
        message: config.message,
        duration: config.duration ?? 5000,
        position: config.position || "top-right",
        dismissible: config.dismissible ?? true,
        onClose: config.onClose,
      };

      setToasts((prev) => [...prev, toast]);

      // Auto-dismiss
      if (toast.duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, toast.duration);
      }
    },
    [hideToast]
  );

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, clearAll }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within ToastProvider");
  }
  return context;
};
