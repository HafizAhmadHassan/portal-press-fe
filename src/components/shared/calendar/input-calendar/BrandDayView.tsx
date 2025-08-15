import React from 'react';

interface CalendarData {
  daysInCurrentMonth: number;
  prevMonthDays: number[];
  nextMonthDays: number[];
  monthName: string;
  year: number;
}

interface BrandDayViewProps {
  calendarData: CalendarData;
  viewDate: Date;
  disablePast: boolean;
  isDateInPast: (date: Date) => boolean;
  isDateDisabled: (date: Date) => boolean;
  isSelected: (date: Date) => boolean;
  handleDateSelect: (date: Date) => void;
  handleTodayClick: () => void;
  today: Date;
}

const BrandDayView: React.FC<BrandDayViewProps> = ({
  calendarData,
  viewDate,
  disablePast,
  isDateInPast,
  isDateDisabled,
  isSelected,
  handleDateSelect,
  handleTodayClick,
  today,
}) => {
  const weekdays = ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'];
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  const createDate = (day: number, isPrevMonth = false, isNextMonth = false) => {
    if (isPrevMonth) {
      return new Date(currentYear, currentMonth - 1, day);
    } else if (isNextMonth) {
      return new Date(currentYear, currentMonth + 1, day);
    }
    return new Date(currentYear, currentMonth, day);
  };

  const isToday = (date: Date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div>
      <div className="grid grid-cols-7 text-xs font-medium mb-2">
        {weekdays.map((day) => (
          <div key={day} className="text-center py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {/* Previous month days */}
        {calendarData.prevMonthDays.map((day) => {
          const date = createDate(day, true);
          const disabled = (disablePast && isDateInPast(date)) || isDateDisabled(date);

          return (
            <button
              key={`prev-${day}`}
              className={`w-9 h-9 rounded-full text-gray-400 text-xs
                ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
              onClick={() => !disabled && handleDateSelect(date)}
              disabled={disabled}
            >
              {day}
            </button>
          );
        })}

        {/* Current month days */}
        {Array.from({ length: calendarData.daysInCurrentMonth }, (_, i) => i + 1).map((day) => {
          const date = createDate(day);
          const disabled = (disablePast && isDateInPast(date)) || isDateDisabled(date);

          return (
            <button
              key={`current-${day}`}
              className={`w-9 h-9 rounded-full text-xs flex items-center justify-center
                ${isSelected(date) ? 'bg-indigo-500 text-white' : ''}
                ${isToday(date) && !isSelected(date) ? 'border border-indigo-500' : ''}
                ${disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              onClick={() => !disabled && handleDateSelect(date)}
              disabled={disabled}
            >
              {day}
            </button>
          );
        })}

        {/* Next month days */}
        {calendarData.nextMonthDays.map((day) => {
          const date = createDate(day, false, true);
          const disabled = (disablePast && isDateInPast(date)) || isDateDisabled(date);

          return (
            <button
              key={`next-${day}`}
              className={`w-9 h-9 rounded-full text-gray-400 text-xs
                ${disabled ? 'cursor-not-allowed' : 'hover:bg-gray-100'}`}
              onClick={() => !disabled && handleDateSelect(date)}
              disabled={disabled}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mt-3 text-center">
        <button
          className="text-xs px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          onClick={handleTodayClick}
        >
          Oggi
        </button>
      </div>
    </div>
  );
};

export default BrandDayView;
