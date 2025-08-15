import { TicketTypes } from '@utils/constants/ticketTypes';
import React from 'react';



export const CategoryBadge: React.FC<any> = ({ category }) => {
  const getCategoryConfig = (category: TicketTypes) => {
    console.log('category', category);
    switch (category) {
      case TicketTypes.IDRAULICO:
        return {
          label: 'Idraulico',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          borderColor: '#fecaca',
        };
      case TicketTypes.MECCANICO:
        return {
          label: 'Meccanico',
          backgroundColor: '#f0f9ff',
          color: '#0369a1',
          borderColor: '#bae6fd',
        };
      case TicketTypes.ELETTRICO:
        return {
          label: 'Elettrico',
          backgroundColor: '#f0fdf4',
          color: '#16a34a',
          borderColor: '#bbf7d0',
        };
      case TicketTypes.BANCA_DATI:
        return {
          label: 'Banca Dati',
          backgroundColor: '#fdf4ff',
          color: '#c026d3',
          borderColor: '#f0abfc',
        };
      
      default:
        return {
          label: category,
          backgroundColor: '#f3f4f6',
          color: '#374151',
          borderColor: '#d1d5db',
        };
    }
  };

  const config = getCategoryConfig(category);

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