import React from 'react';

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  title?: string;
}

const Toast: React.FC<ToastProps> = ({ type, message, title }) => {
  const color = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className={`min-w-[250px] rounded shadow-lg text-white p-4 ${color}`}>
      {title && <div className="font-bold text-sm mb-1">{title}</div>}
      <div className="text-sm">{message}</div>
    </div>
  );
};

export default Toast;
