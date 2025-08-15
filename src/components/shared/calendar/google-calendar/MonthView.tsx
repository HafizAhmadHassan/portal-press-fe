import React from 'react';

import { CalendarEvent } from '@_hooks/useGoogleCalendar';

interface MonthViewProps {
  days: number[];
  displayedMonth: number;
  displayedYear: number;
  getEventsForDate: (date: Date) => CalendarEvent[];
  isToday: (date: Date) => boolean;
  isSelectedDate: (date: Date) => boolean;
  isDateInPast: (date: Date) => boolean;
  handleDayClick: (date: Date) => void;
  handleEventClick: (event: CalendarEvent) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  days,
  displayedMonth,
  displayedYear,
  getEventsForDate,
  isToday,
  isSelectedDate,
  isDateInPast,
  handleDayClick,
  handleEventClick,
}) => {
  const firstDayOfMonth = new Date(displayedYear, displayedMonth, 1).getDay();
  const weekdays = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  return (
    <div className="month-view">
      <div className="grid grid-cols-7 text-sm font-semibold mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDayOfMonth)
          .fill(null)
          .map((_, i) => (
            <div key={`empty-${i}`} className="h-24"></div>
          ))}

        {days.map((day) => {
          const date = new Date(displayedYear, displayedMonth, day);
          const isPast = isDateInPast(date);
          const dayEvents = getEventsForDate(date);

          return (
            <button
              key={day}
              onClick={() => (isPast ? null : handleDayClick(date))}
              className={`h-24 p-1 border rounded-md overflow-hidden relative
                ${isToday(date) ? 'border-indigo-500' : 'border-gray-100'}
                ${isSelectedDate(date) ? 'bg-indigo-50' : ''}
                ${isPast ? 'bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'}`}
            >
              <div className="flex justify-between items-start">
                <span
                  className={`h-6 w-6 flex items-center justify-center rounded-full text-sm
                    ${isToday(date) ? 'bg-indigo-500 text-white' : ''}
                    ${isPast ? 'text-gray-400' : ''}
                  `}
                >
                  {day}
                </span>
              </div>
              <div className="mt-1 space-y-1 text-xs">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventClick(event);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleEventClick(event);
                      }
                    }}
                    className="truncate py-1 px-2 rounded text-left w-full cursor-pointer focus:outline-none"
                    style={{ backgroundColor: event.color + '40' }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>

              {isPast && (
                <div className="absolute bottom-1 right-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
