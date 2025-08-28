import Toast from "./Toast";
import type { Toast as ToastType } from "./Toast.utility";

const ToastContainer = ({ toasts }: { toasts: ToastType[] }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
