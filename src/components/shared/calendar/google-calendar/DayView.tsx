import React from 'react';

import { CalendarEvent } from '@_hooks/useGoogleCalendar';

interface DayViewProps {
  selectedDate: Date;
  getEventsForHour: (date: Date, hour: number) => CalendarEvent[];
  handleDayClick: (date: Date) => void;
  handleEventClick: (event: CalendarEvent) => void;
}

const DayView: React.FC<DayViewProps> = ({
  selectedDate,
  getEventsForHour,
  handleDayClick,
  handleEventClick,
}) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="day-view h-96 overflow-y-auto">
      {hours.map((hour) => {
        const hourEvents = getEventsForHour(selectedDate, hour);
        const newDate = new Date(selectedDate);
        newDate.setHours(hour);

        return (
          <div
            key={hour}
            role="button"
            tabIndex={0}
            className="flex items-start h-12 border-t border-gray-200 relative cursor-pointer hover:bg-gray-50"
            onClick={() => handleDayClick(newDate)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDayClick(newDate);
              }
            }}
          >
            <div className="w-16 text-xs text-right pr-2 py-1">{hour}:00</div>
            <div className="flex-1 h-full relative">
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
          </div>
        );
      })}
    </div>
  );
};

export default DayView;
