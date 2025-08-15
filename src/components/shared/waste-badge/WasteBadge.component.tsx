import React from 'react';

interface WasteBadgeProps {
  waste: string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
}

export const WasteBadge: React.FC<WasteBadgeProps> = ({ waste, size = 'md' }) => {
  const getWasteColor = (wasteType: string | null | undefined) => {
    switch (wasteType) {
      case 'Plastica':
        return { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' };
      case 'Secco':
        return { bg: '#f3f4f6', color: '#374151', border: '#9ca3af' };
      case 'Umido':
        return { bg: '#d1fae5', color: '#065f46', border: '#10b981' };
      case 'Vetro':
        return { bg: '#dbeafe', color: '#1e40af', border: '#3b82f6' };
      default:
        return { bg: '#f1f5f9', color: '#64748b', border: '#cbd5e1' };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return { padding: '2px 6px', fontSize: '10px' };
      case 'lg':
        return { padding: '6px 12px', fontSize: '14px' };
      default:
        return { padding: '4px 8px', fontSize: '12px' };
    }
  };

  const colors = getWasteColor(waste);
  const sizeStyles = getSizeClasses(size);

  return (
    <span
      style={{
        ...sizeStyles,
        borderRadius: '6px',
        fontWeight: '500',
        backgroundColor: colors.bg,
        color: colors.color,
        border: `1px solid ${colors.border}`,
        display: 'inline-block',
        textTransform: 'uppercase',
      }}
    >
      {waste || 'N/A'}
    </span>
  );
};