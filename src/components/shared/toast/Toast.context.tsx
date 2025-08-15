// src/toast/Toast.context.tsx
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import type { Toast } from './Toast.utility';
import { toastQueue } from './Toast.utility';
import ToastContainer from './ToastContainer';

interface ToastContextValue {
  showToast: (toast: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 4000);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      while (toastQueue.length > 0) {
        const next = toastQueue.shift();
        if (next) showToast(next);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  );
};
