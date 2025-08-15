import React from 'react';

interface Calendar {
  id: number;
  name: string;
  color: string;
  visible: boolean;
}

interface CalendarSidebarProps {
  calendars: Calendar[];
  onToggleCalendar: (calendarId: number) => void;
  onCreateEvent: () => void;
  onAddCalendar: () => void;
  onEditCalendar: (calendar: Calendar) => void;
  eventCounts?: Record<number, number>; // Add this prop to track event counts per calendar
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  calendars,
  onToggleCalendar,
  onCreateEvent,
  onAddCalendar,
  onEditCalendar,
  eventCounts = {}, // Default to empty object
}) => {
  // Function to handle toggle for fixed calendars
  const handleFixedCalendarToggle = () => {
    // This is a placeholder for future functionality
    // In a real implementation, this would toggle a system calendar
    console.log('Toggle fixed calendar');
  };

  return (
    <div className="sidebar w-64 p-4 border-r border-gray-200">
      {/* Create button */}
      <button
        onClick={onCreateEvent}
        className="flex items-center justify-center gap-2 w-full rounded-full py-3 px-4 bg-white shadow-md hover:shadow-lg mb-6 border border-gray-200 transition-shadow"
      >
        <span className="text-indigo-500 text-2xl font-bold">+</span>
        <span className="text-gray-700">Crea</span>
      </button>

      {/* Mini calendar placeholder */}
      <div className="mini-calendar bg-gray-50 rounded mb-6 h-40 flex items-center justify-center">
        <span className="text-sm text-gray-400">Mini calendario</span>
      </div>

      {/* Calendars section */}
      <div className="my-calendars">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">I miei calendari</h3>
          <button
            onClick={onAddCalendar}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Aggiungi nuovo calendario"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </button>
        </div>
        <ul className="space-y-2">
          {calendars.map((calendar) => (
            <li key={calendar.id} className="flex items-center group">
              <div className="flex items-center cursor-pointer w-full">
                <input
                  type="checkbox"
                  id={`calendar-toggle-${calendar.id}`}
                  checked={calendar.visible}
                  onChange={() => onToggleCalendar(calendar.id)}
                  className="sr-only"
                />
                <label
                  htmlFor={`calendar-toggle-${calendar.id}`}
                  className="flex items-center flex-1 cursor-pointer"
                >
                  <span
                    className={`w-3 h-3 rounded-full mr-3`}
                    style={{ backgroundColor: calendar.color }}
                  ></span>
                  <span
                    className={`flex-1 text-sm ${calendar.visible ? 'text-gray-800' : 'text-gray-400'}`}
                  >
                    {calendar.name}

                    {/* Display event count if there are events */}
                    {eventCounts[calendar.id] > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                        {eventCounts[calendar.id]}
                      </span>
                    )}
                  </span>
                </label>

                <button
                  onClick={() => onEditCalendar(calendar)}
                  className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Modifica calendario ${calendar.name}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Other calendars section */}
      <div className="other-calendars mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Altri calendari</h3>
        <ul className="space-y-2">
          <li className="flex items-center">
            <label className="flex items-center cursor-pointer w-full">
              <input
                type="checkbox"
                checked={true}
                onChange={handleFixedCalendarToggle}
                className="sr-only"
              />
              <span className="w-3 h-3 rounded-full mr-3 bg-gray-400"></span>
              <span className="flex-1 text-sm text-gray-800">Festività italiane</span>
              <span className="w-4 h-4 rounded flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 text-gray-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CalendarSidebar;
