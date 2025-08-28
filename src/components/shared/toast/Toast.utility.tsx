export type Toast = {
  id: string;
  type: "success" | "error";
  message: string;
  title?: string;
  duration?: number;
};

// Coda globale per i toast
export const toastQueue: Toast[] = [];

/**
 * Può essere usato globalmente (es. nei thunk)
 * Aggiunge l'id internamente.
 */
export const triggerGlobalToast = (toast: Omit<Toast, "id">) => {
  toastQueue.push({
    ...toast,
    id: crypto.randomUUID(),
  });
};
