// 🗂️ Toast Container - Renderizza tutti i toast
import React, { useMemo } from "react";
import { useToastContext } from "./ToastContext";
import { Toast } from "./Toast";
import type { ToastPosition } from "./ToastContext";

export const ToastContainer: React.FC = () => {
  const { toasts, hideToast } = useToastContext();

  // Raggruppa i toast per posizione
  const toastsByPosition = useMemo(() => {
    const grouped: Record<ToastPosition, typeof toasts> = {
      "top-left": [],
      "top-center": [],
      "top-right": [],
      "bottom-left": [],
      "bottom-center": [],
      "bottom-right": [],
    };

    toasts.forEach((toast) => {
      grouped[toast.position].push(toast);
    });

    return grouped;
  }, [toasts]);

  return (
    <>
      {(
        Object.entries(toastsByPosition) as [ToastPosition, typeof toasts][]
      ).map(([position, positionToasts]) => {
        if (positionToasts.length === 0) return null;

        return (
          <div
            key={position}
            className={`kgn-toast-container kgn-toast-container--${position}`}
          >
            {positionToasts.map((toast) => (
              <Toast key={toast.id} toast={toast} onClose={hideToast} />
            ))}
          </div>
        );
      })}
    </>
  );
};
