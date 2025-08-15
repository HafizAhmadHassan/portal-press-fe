import React from 'react';

import { CalendarEvent } from '@_hooks/useGoogleCalendar';

interface WeekViewProps {
  selectedDate: Date;
  getEventsForHour: (date: Date, hour: number) => CalendarEvent[];
  isToday: (date: Date) => boolean;
  handleDayClick: (date: Date) => void;
  handleEventClick: (event: CalendarEvent) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  selectedDate,
  getEventsForHour,
  isToday,
  handleDayClick,
  handleEventClick,
}) => {
  const startDate = new Date(selectedDate);
  startDate.setDate(selectedDate.getDate() - selectedDate.getDay());

  const days = Array(7)
    .fill(null)
    .map((_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      return date;
    });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="week-view">
      <div className="grid grid-cols-8 text-sm font-semibold mb-2">
        <div className="text-center py-2">Ora</div>
        {days.map((date) => (
          <div
            key={date.toISOString()}
            className={`text-center py-2 ${isToday(date) ? 'text-indigo-600 font-bold' : ''}`}
          >
            {date.getDate()}/{date.getMonth() + 1}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-8 gap-1 h-96 overflow-y-auto">
        {hours.map((hour) => (
          <React.Fragment key={hour}>
            <div className="text-xs text-right pr-2">{hour}:00</div>
            {days.map((date) => {
              const hourEvents = getEventsForHour(date, hour);
              const newDate = new Date(date);
              newDate.setHours(hour);

              return (
                <div
                  key={`${date.toISOString()}-${hour}`}
                  role="button"
                  tabIndex={0}
                  className="border-t border-gray-200 h-12 relative cursor-pointer hover:bg-gray-50"
                  onClick={() => handleDayClick(newDate)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleDayClick(newDate);
                    }
                  }}
                >
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      role="button"
                      tabIndex={0}
                      className="absolute inset-0 m-1 p-1 text-xs text-white rounded overflow-hidden"
                      style={{ backgroundColor: event.color }}
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
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WeekView;
