import React, { useEffect, useRef, useState } from 'react';

import { CalendarEvent, useGoogleCalendar } from '@_hooks/useGoogleCalendar';

import CalendarHeader from './CalendarHeader';
import CalendarModalContainer from './CalendarModalContainer';
import CalendarSidebar from './CalendarSidebar';
import DayView from './DayView';
import EventModalContainer from './EventModalContainer';
import MonthView from './MonthView';
import WeekView from './WeekView';
import YearView from './YearView';

type CalendarView = 'day' | 'week' | 'month' | 'year';

interface GoogleCalendarProps {
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
  disablePast?: boolean;
}

const GoogleCalendar: React.FC<GoogleCalendarProps> = ({
  onDateSelect,
  initialDate = new Date(),
  disablePast = false,
}) => {
  const [currentView, setCurrentView] = useState<CalendarView>('month');
  const currentYearRef = useRef<HTMLButtonElement>(null);

  // Use our enhanced _hooks
  const {
    selectedDate,
    setSelectedDate,
    displayedMonth,
    displayedYear,
    calendars,
    events,

    // Navigation functions
    nextMonth,
    prevMonth,
    nextYear,
    prevYear,
    goToToday,

    // Date helpers
    getDaysInMonth,
    isToday,
    isSelectedDate,
    isDateInPast,
    isYearInPast,
    isSelectedYear,

    // Calendar management
    toggleCalendarVisibility,
    createCalendar,
    updateCalendar,
    deleteCalendar,

    // Event management
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsForDate,
    getEventsForHour,
    getActiveEventCounts,
  } = useGoogleCalendar(initialDate);

  // Modal states
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<(typeof calendars)[0] | undefined>(
    undefined
  );

  // Handle create event button click
  const handleCreateEvent = () => {
    // Use the current date and time for the new event
    const now = new Date();

    // Round to the nearest hour for a better UX
    const roundedDate = new Date(now);
    roundedDate.setMinutes(0, 0, 0);

    // If the current hour is already passed, set to next hour
    if (roundedDate < now) {
      roundedDate.setHours(roundedDate.getHours() + 1);
    }

    setSelectedEventDate(roundedDate);
    setEditingEvent(null); // Ensure we're creating a new event, not editing
    setShowEventModal(true);
  };

  // Handle day click for event creation
  const handleDayClick = (date: Date) => {
    // Check if the date is in the past
    if (isDateInPast(date) && disablePast) {
      // If we're trying to create an event in the past, show a message
      alert('Non è possibile creare eventi nel passato');
      return;
    }

    setSelectedEventDate(date);
    setShowEventModal(true);
  };

  // Handle event creation or update
  const handleCreateOrUpdateEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      createEvent(eventData);
    }

    setShowEventModal(false);
    setEditingEvent(null);
    setSelectedEventDate(null);
  };

  // Handle event click
  const handleEventClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setSelectedEventDate(event.start);
    setShowEventModal(true);
  };

  // Handle add calendar button click
  const handleAddCalendar = () => {
    setEditingCalendar(undefined);
    setShowCalendarModal(true);
  };

  // Handle edit calendar button click
  const handleEditCalendar = (calendar: (typeof calendars)[0]) => {
    setEditingCalendar(calendar);
    setShowCalendarModal(true);
  };

  // Handle save calendar
  const handleSaveCalendar = (calendarData: Omit<(typeof calendars)[0], 'id' | 'visible'>) => {
    if (editingCalendar) {
      updateCalendar(editingCalendar.id, calendarData);
    } else {
      createCalendar(calendarData);
    }
    setShowCalendarModal(false);
    setEditingCalendar(undefined);
  };

  // Handle delete calendar
  const handleDeleteCalendar = (calendarId: number) => {
    const success = deleteCalendar(calendarId);
    if (!success) {
      alert('Non puoi eliminare tutti i calendari. Deve rimanerne almeno uno.');
      return;
    }

    setShowCalendarModal(false);
    setEditingCalendar(undefined);
  };

  // Handle view navigation
  const navigateView = (direction: 'prev' | 'next') => {
    switch (currentView) {
      case 'day':
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 1 : -1));
        setSelectedDate(newDate);
        break;
      case 'week':
        const weekOffset = direction === 'next' ? 7 : -7;
        const newWeekDate = new Date(selectedDate);
        newWeekDate.setDate(selectedDate.getDate() + weekOffset);
        setSelectedDate(newWeekDate);
        break;
      case 'month':
        direction === 'next' ? nextMonth() : prevMonth();
        break;
      case 'year':
        direction === 'next' ? nextYear() : prevYear();
        break;
    }
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
    setCurrentView('month');
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    if (onDateSelect) onDateSelect(date);
  };

  // Scroll selected year into view when year view is shown
  useEffect(() => {
    if (currentView === 'year' && currentYearRef.current) {
      currentYearRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentView]);

  return (
    <div className="google-calendar flex bg-white rounded-lg shadow-lg max-w-5xl">
      <CalendarSidebar
        calendars={calendars}
        onToggleCalendar={toggleCalendarVisibility}
        onCreateEvent={handleCreateEvent}
        onAddCalendar={handleAddCalendar}
        onEditCalendar={handleEditCalendar}
        eventCounts={getActiveEventCounts()}
      />

      <div className="flex-1 p-4">
        <CalendarHeader
          currentView={currentView}
          displayedMonth={displayedMonth}
          displayedYear={displayedYear}
          selectedDate={selectedDate}
          goToToday={goToToday}
          navigateView={navigateView}
          setCurrentView={setCurrentView}
        />

        <div className="calendar-container">
          {currentView === 'month' && (
            <MonthView
              days={getDaysInMonth(displayedMonth, displayedYear)}
              displayedMonth={displayedMonth}
              displayedYear={displayedYear}
              getEventsForDate={getEventsForDate}
              isToday={isToday}
              isSelectedDate={isSelectedDate}
              isDateInPast={isDateInPast}
              handleDayClick={handleDayClick}
              handleEventClick={handleEventClick}
            />
          )}

          {currentView === 'week' && (
            <WeekView
              selectedDate={selectedDate}
              getEventsForHour={getEventsForHour}
              isToday={isToday}
              handleDayClick={handleDayClick}
              handleEventClick={handleEventClick}
            />
          )}

          {currentView === 'day' && (
            <DayView
              selectedDate={selectedDate}
              getEventsForHour={getEventsForHour}
              handleDayClick={handleDayClick}
              handleEventClick={handleEventClick}
            />
          )}

          {currentView === 'year' && (
            <YearView
              today={new Date()}
              disablePast={disablePast}
              isYearInPast={isYearInPast}
              isSelectedYear={isSelectedYear}
              handleYearSelect={handleYearSelect}
              currentYearRef={currentYearRef}
            />
          )}
        </div>
      </div>

      <EventModalContainer
        showEventModal={showEventModal}
        selectedEventDate={selectedEventDate}
        editingEvent={editingEvent}
        calendars={calendars}
        onClose={() => {
          setShowEventModal(false);
          setEditingEvent(null);
          setSelectedEventDate(null);
        }}
        onSave={handleCreateOrUpdateEvent}
        onDelete={deleteEvent}
      />

      <CalendarModalContainer
        showCalendarModal={showCalendarModal}
        editingCalendar={editingCalendar}
        onClose={() => {
          setShowCalendarModal(false);
          setEditingCalendar(undefined);
        }}
        onSave={handleSaveCalendar}
        onDelete={handleDeleteCalendar}
      />
    </div>
  );
};

export default GoogleCalendar;
