import React from 'react';

interface YearViewProps {
  today: Date;
  disablePast: boolean;
  isYearInPast: (year: number) => boolean;
  isSelectedYear: (year: number) => boolean;
  handleYearSelect: (year: number) => void;
  // Fix the ref type to allow null
  currentYearRef: React.RefObject<HTMLButtonElement | null>;
}

const YearView: React.FC<YearViewProps> = ({
  today,
  disablePast,
  isYearInPast,
  isSelectedYear,
  handleYearSelect,
  currentYearRef,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm max-h-48 overflow-y-auto px-2">
      {Array.from({ length: 151 }).map((_, i) => {
        const year = 1900 + i;
        const isCurrentYear = year === today.getFullYear();
        const isPast = disablePast && isYearInPast(year);

        return (
          <button
            key={year}
            type="button"
            ref={isCurrentYear ? currentYearRef : null}
            onClick={() => handleYearSelect(year)}
            disabled={isPast}
            className={`rounded p-2 hover:bg-indigo-100
              ${isSelectedYear(year) ? 'bg-indigo-500 text-white' : ''}
              ${isCurrentYear ? 'border border-indigo-300' : ''}
              ${isPast ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
};

export default YearView;
