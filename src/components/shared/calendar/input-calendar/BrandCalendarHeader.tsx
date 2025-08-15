import React from 'react';

type ViewMode = 'day' | 'month' | 'year';

interface BrandCalendarHeaderProps {
  viewMode: ViewMode;
  viewDate: Date;
  disablePast: boolean;
  isMonthInPast: (year: number, month: number) => boolean;
  isYearInPast: (year: number) => boolean;
  changeMonth: (offset: number) => void;
  changeYear: (offset: number) => void;
  handleViewModeChange: (mode: ViewMode) => void;
}

const BrandCalendarHeader: React.FC<BrandCalendarHeaderProps> = ({
  viewMode,
  viewDate,
  disablePast,
  isMonthInPast,
  isYearInPast,
  changeMonth,
  changeYear,
  handleViewModeChange,
}) => {
  const prevEnabled =
    viewMode === 'day' ||
    (viewMode === 'month' &&
      (!disablePast || !isMonthInPast(viewDate.getFullYear(), viewDate.getMonth() - 1))) ||
    (viewMode === 'year' && (!disablePast || !isYearInPast(viewDate.getFullYear() - 1)));

  const getTitle = () => {
    if (viewMode === 'year') {
      return `${viewDate.getFullYear() - 6} - ${viewDate.getFullYear() + 5}`;
    } else if (viewMode === 'month') {
      return viewDate.getFullYear().toString();
    } else {
      return viewDate.toLocaleDateString('it', { month: 'long', year: 'numeric' });
    }
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-1">
        <button
          onClick={() => (viewMode === 'month' ? changeMonth(-1) : changeYear(-1))}
          disabled={!prevEnabled}
          className={`p-2 rounded-l ${!prevEnabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}`}
        >
          &lt;
        </button>
        <button
          onClick={() => (viewMode === 'month' ? changeMonth(1) : changeYear(1))}
          className="p-2 rounded-r hover:bg-gray-100"
        >
          &gt;
        </button>
      </div>

      <button
        onClick={() => {
          if (viewMode === 'day') {
            handleViewModeChange('month');
          } else if (viewMode === 'month') {
            handleViewModeChange('year');
          }
        }}
        className="text-sm font-medium px-2 py-1 hover:bg-gray-100 rounded"
      >
        {getTitle()}
      </button>

      <div className="flex gap-1">
        <button
          onClick={() => handleViewModeChange('day')}
          className={`px-3 py-1 text-xs rounded ${viewMode === 'day' ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
        >
          G
        </button>
        <button
          onClick={() => handleViewModeChange('month')}
          className={`px-3 py-1 text-xs rounded ${viewMode === 'month' ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
        >
          M
        </button>
        <button
          onClick={() => handleViewModeChange('year')}
          className={`px-3 py-1 text-xs rounded ${viewMode === 'year' ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
        >
          A
        </button>
      </div>
    </div>
  );
};

export default BrandCalendarHeader;
