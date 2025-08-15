import React from 'react';

type CalendarView = 'day' | 'week' | 'month' | 'year';

interface CalendarHeaderProps {
  currentView: CalendarView;
  displayedMonth: number;
  displayedYear: number;
  selectedDate: Date;
  goToToday: () => void;
  navigateView: (direction: 'prev' | 'next') => void;
  setCurrentView: (view: CalendarView) => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentView,
  displayedMonth,
  displayedYear,
  selectedDate,
  goToToday,
  navigateView,
  setCurrentView,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-2">
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm bg-indigo-100 rounded hover:bg-indigo-200"
        >
          Oggi
        </button>

        <div className="flex">
          <button
            onClick={() => navigateView('prev')}
            className="px-3 py-2 rounded-l hover:bg-gray-100"
          >
            &lt;
          </button>
          <button
            onClick={() => navigateView('next')}
            className="px-3 py-2 rounded-r hover:bg-gray-100"
          >
            &gt;
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold">
        {currentView === 'year'
          ? displayedYear
          : currentView === 'month'
            ? `${new Date(displayedYear, displayedMonth).toLocaleString('it', {
                month: 'long',
              })} ${displayedYear}`
            : selectedDate.toLocaleDateString('it', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                ...(currentView === 'week' ? { weekday: 'long' } : {}),
              })}
      </h2>

      <div className="flex gap-1">
        <button
          onClick={() => setCurrentView('day')}
          className={`px-3 py-1 text-sm rounded ${
            currentView === 'day' ? 'bg-indigo-100' : 'hover:bg-gray-100'
          }`}
        >
          Giorno
        </button>
        <button
          onClick={() => setCurrentView('week')}
          className={`px-3 py-1 text-sm rounded ${
            currentView === 'week' ? 'bg-indigo-100' : 'hover:bg-gray-100'
          }`}
        >
          Settimana
        </button>
        <button
          onClick={() => setCurrentView('month')}
          className={`px-3 py-1 text-sm rounded ${
            currentView === 'month' ? 'bg-indigo-100' : 'hover:bg-gray-100'
          }`}
        >
          Mese
        </button>
        <button
          onClick={() => setCurrentView('year')}
          className={`px-3 py-1 text-sm rounded ${
            currentView === 'year' ? 'bg-indigo-100' : 'hover:bg-gray-100'
          }`}
        >
          Anno
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
