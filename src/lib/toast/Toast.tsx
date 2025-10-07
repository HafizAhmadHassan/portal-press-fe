// 🍞 Componente Toast singolo
import React, { useEffect, useState } from "react";
import type { Toast as ToastType } from "./ToastContext";
import "./toast.scss";

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const ICONS = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(toast.id);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsExiting(false);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`kgn-toast kgn-toast--${toast.type} ${
        isExiting ? "kgn-toast--exiting" : "kgn-toast--entering"
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="kgn-toast__icon">
        <span>{ICONS[toast.type]}</span>
      </div>

      <div className="kgn-toast__content">
        {toast.title && <div className="kgn-toast__title">{toast.title}</div>}
        <div className="kgn-toast__message">{toast.message}</div>
      </div>

      {toast.dismissible && (
        <button
          className="kgn-toast__close"
          onClick={handleClose}
          aria-label="Close notification"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
};
