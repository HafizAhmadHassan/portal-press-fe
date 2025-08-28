import React from "react";

import Toast from "./Toast";

interface ToastContainerProps {
  toasts: {
    id: number;
    type: "success" | "error";
    message: string;
    title?: string;
  }[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-4">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
