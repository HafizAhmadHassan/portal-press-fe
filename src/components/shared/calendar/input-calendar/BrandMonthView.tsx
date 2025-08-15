import React from 'react';

interface BrandMonthViewProps {
  viewDate: Date;
  disablePast: boolean;
  isMonthInPast: (year: number, month: number) => boolean;
  isSelectedMonth: (monthIndex: number) => boolean;
  handleMonthSelect: (monthIndex: number) => void;
}

const BrandMonthView: React.FC<BrandMonthViewProps> = ({
  viewDate,
  disablePast,
  isMonthInPast,
  isSelectedMonth,
  handleMonthSelect,
}) => {
  const months = [
    'Gennaio',
    'Febbraio',
    'Marzo',
    'Aprile',
    'Maggio',
    'Giugno',
    'Luglio',
    'Agosto',
    'Settembre',
    'Ottobre',
    'Novembre',
    'Dicembre',
  ];

  const currentYear = viewDate.getFullYear();

  return (
    <div className="grid grid-cols-3 gap-2">
      {months.map((month, index) => {
        const disabled = disablePast && isMonthInPast(currentYear, index);
        return (
          <button
            key={month}
            className={`py-3 rounded-lg text-sm
              ${isSelectedMonth(index) ? 'bg-indigo-500 text-white' : ''}
              ${disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            onClick={() => !disabled && handleMonthSelect(index)}
            disabled={disabled}
          >
            {month}
          </button>
        );
      })}
    </div>
  );
};

export default BrandMonthView;
