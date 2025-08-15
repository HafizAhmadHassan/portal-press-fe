import React from 'react';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'low':
        return {
          label: 'Bassa',
          backgroundColor: '#f0f9ff',
          color: '#0369a1',
          borderColor: '#bae6fd',
        };
      case 'medium':
        return {
          label: 'Media',
          backgroundColor: '#fefce8',
          color: '#ca8a04',
          borderColor: '#fde047',
        };
      case 'high':
        return {
          label: 'Alta',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          borderColor: '#fecaca',
        };
      case 'critical':
        return {
          label: 'Critica',
          backgroundColor: '#450a0a',
          color: '#ffffff',
          borderColor: '#7f1d1d',
        };
      default:
        return {
          label: priority,
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#d1d5db',
        };
    }
  };

  const config = getPriorityConfig(priority);

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