import React from 'react';

import { Calendar } from '@_hooks/useGoogleCalendar';

import CalendarModal from './CalendarModal';

interface CalendarModalContainerProps {
  showCalendarModal: boolean;
  editingCalendar: Calendar | undefined;
  onClose: () => void;
  onSave: (calendarData: Omit<Calendar, 'id' | 'visible'>) => void;
  onDelete: (calendarId: number) => void;
}

const CalendarModalContainer: React.FC<CalendarModalContainerProps> = ({
  showCalendarModal,
  editingCalendar,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!showCalendarModal) return null;

  return (
    <CalendarModal
      calendar={editingCalendar}
      onClose={onClose}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
};

export default CalendarModalContainer;
