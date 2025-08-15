import React from 'react';

interface StatusBadgeProps {
  status: 'open' | 'in_progress' | 'closed';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (status: number) => {
    console.log('status', status);
    switch (status) {
      case 1:
        return {
          label: 'Aperto',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          borderColor: '#fecaca',
        };
      case 2:
        return {
          label: 'Chiuso',
          backgroundColor: '#d1fae5',
          color: '#065f46',
          borderColor: '#a7f3d0',
        };
      default:
        return {
          label: status,
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#d1d5db',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      style={{
        padding: '4px 8px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500',
        backgroundColor: config.backgroundColor,
        color: config.color,
        border: `1px solid ${config.borderColor}`,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {config.label}
    </span>
  );
};