import React from 'react';

import { Calendar, CalendarEvent } from '@_hooks/useGoogleCalendar';

import EventModal from './EventModal';

interface EventModalContainerProps {
  showEventModal: boolean;
  selectedEventDate: Date | null;
  editingEvent: CalendarEvent | null;
  calendars: Calendar[];
  onClose: () => void;
  onSave: (eventData: Omit<CalendarEvent, 'id'>) => void;
  onDelete: (eventId: string) => void;
}

const EventModalContainer: React.FC<EventModalContainerProps> = ({
  showEventModal,
  selectedEventDate,
  editingEvent,
  calendars,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!showEventModal || !selectedEventDate) return null;

  return (
    <EventModal
      date={selectedEventDate}
      event={editingEvent}
      calendars={calendars}
      onClose={onClose}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
};

export default EventModalContainer;
