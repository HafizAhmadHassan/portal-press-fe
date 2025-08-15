import React, { useEffect, useState } from 'react';

import { isValidEmail } from '@utils/validation';

interface Calendar {
  id: number;
  name: string;
  color: string;
  visible: boolean;
}

interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  calendarId: number;
  color?: string;
  description?: string;
  location?: string;
  phones?: string[]; // Changed from phone to phones array
  emails?: string[]; // Changed from email to emails array
  attendees?: string[];
}

interface EventModalProps {
  date: Date;
  event: CalendarEvent | null;
  calendars: Calendar[];
  onClose: () => void;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onDelete?: (eventId: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  date,
  event,
  calendars,
  onClose,
  onSave,
  onDelete,
}) => {
  const ensureDate = (possibleDate: Date | string | undefined, defaultDate: Date): Date => {
    if (!possibleDate) return defaultDate;
    return possibleDate instanceof Date ? possibleDate : new Date(possibleDate);
  };

  const [title, setTitle] = useState(event?.title || '');
  const [startDate, setStartDate] = useState(() => ensureDate(event?.start, date));
  const [endDate, setEndDate] = useState(() =>
    ensureDate(event?.end, new Date(date.getTime() + 60 * 60 * 1000))
  );
  const [calendarId, setCalendarId] = useState(event?.calendarId || calendars[0]?.id);
  const [description, setDescription] = useState(event?.description || '');
  const [location, setLocation] = useState(event?.location || '');
  const [phones, setPhones] = useState<string[]>(event?.phones?.length ? event.phones : ['']);
  const [emails, setEmails] = useState<string[]>(event?.emails?.length ? event.emails : ['']);
  const [attendeesText, setAttendeesText] = useState(event?.attendees?.join(', ') || '');

  const [showDetails, setShowDetails] = useState(!!event?.description || !!event?.location);
  const [showContacts, setShowContacts] = useState(
    !!event?.phones?.length || !!event?.emails?.length
  );
  const [showAttendees, setShowAttendees] = useState(!!event?.attendees?.length);

  useEffect(() => {
    const timer = setTimeout(() => {
      const titleInput = document.getElementById('event-title-input');
      if (titleInput) titleInput.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const formatDateForInput = (date: Date): string => {
    try {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return formatDateForInput(new Date());
    }
  };

  const isEventInPast = () => {
    const now = new Date();
    return startDate < now && !event;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEventInPast() && !event) {
      alert('Non è possibile creare eventi nel passato');
      return;
    }

    if (!title.trim()) {
      alert("Per favore inserisci un titolo per l'evento");
      return;
    }

    const attendees = attendeesText
      ? attendeesText
          .split(',')
          .map((email) => email.trim())
          .filter((email) => email)
      : undefined;

    const filteredPhones = phones.filter((phone) => phone.trim() !== '');
    const filteredEmails = emails.filter((email) => email.trim() !== '');

    const selectedCalendar = calendars.find((cal) => cal.id === calendarId);

    try {
      onSave({
        title,
        start: startDate,
        end: endDate,
        calendarId,
        color: selectedCalendar?.color,
        description: description || undefined,
        location: location || undefined,
        phones: filteredPhones.length ? filteredPhones : undefined,
        emails: filteredEmails.length ? filteredEmails : undefined,
        attendees,
      });
    } catch (error) {
      console.error('Error saving event:', error);
      alert("Si è verificato un errore durante il salvataggio dell'evento");
    }
  };

  const handleDelete = () => {
    if (!event || !event.id || !onDelete) return;

    if (window.confirm('Sei sicuro di voler eliminare questo evento?')) {
      onDelete(event.id);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const addPhone = () => {
    setPhones([...phones, '']);
  };

  const removePhone = (index: number) => {
    const newPhones = [...phones];
    newPhones.splice(index, 1);
    setPhones(newPhones.length ? newPhones : ['']);
  };

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  const addEmail = () => {
    setEmails([...emails, '']);
  };

  const removeEmail = (index: number) => {
    const newEmails = [...emails];
    newEmails.splice(index, 1);
    setEmails(newEmails.length ? newEmails : ['']);
  };

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  return (
    <button
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <button
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header with title and close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {event ? 'Modifica evento' : 'Nuovo evento'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form content */}
        <form onSubmit={handleSubmit}>
          {isEventInPast() && !event && (
            <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded">
              Non è possibile creare eventi nel passato. Seleziona una data futura.
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="event-title-input" className="sr-only">
              Titolo evento
            </label>
            <input
              id="event-title-input"
              type="text"
              placeholder="Aggiungi titolo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="event-start-date" className="block text-sm text-gray-600 mb-1">
                Da
              </label>
              <input
                id="event-start-date"
                type="datetime-local"
                value={formatDateForInput(startDate)}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  setStartDate(newDate);
                  if (endDate < newDate) {
                    setEndDate(new Date(newDate.getTime() + 60 * 60 * 1000));
                  }
                }}
                readOnly={isEventInPast() && !event}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500
                  ${isEventInPast() && !event ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 'border-gray-300'}`}
              />
            </div>
            <div>
              <label htmlFor="event-end-date" className="block text-sm text-gray-600 mb-1">
                A
              </label>
              <input
                id="event-end-date"
                type="datetime-local"
                value={formatDateForInput(endDate)}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  setEndDate(newDate);
                }}
                min={formatDateForInput(startDate)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="event-calendar" className="block text-sm text-gray-600 mb-1">
              Calendario
            </label>
            <select
              id="event-calendar"
              value={calendarId}
              onChange={(e) => setCalendarId(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {calendars.map((calendar) => (
                <option key={calendar.id} value={calendar.id}>
                  {calendar.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 border border-gray-200 rounded overflow-hidden">
            <button
              type="button"
              className="w-full py-2 px-3 bg-gray-50 text-left flex justify-between items-center"
              onClick={() => setShowDetails(!showDetails)}
            >
              <span className="font-medium text-gray-700">Dettagli evento</span>
              <svg
                className={`w-5 h-5 transition-transform ${showDetails ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showDetails && (
              <div className="p-3 border-t border-gray-200">
                <div className="mb-3">
                  <label htmlFor="event-location" className="block text-sm text-gray-600 mb-1">
                    Luogo
                  </label>
                  <input
                    id="event-location"
                    type="text"
                    placeholder="Aggiungi luogo"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="event-description" className="block text-sm text-gray-600 mb-1">
                    Descrizione
                  </label>
                  <textarea
                    id="event-description"
                    placeholder="Aggiungi descrizione"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-4 border border-gray-200 rounded overflow-hidden">
            <button
              type="button"
              className="w-full py-2 px-3 bg-gray-50 text-left flex justify-between items-center"
              onClick={() => setShowContacts(!showContacts)}
            >
              <span className="font-medium text-gray-700">Informazioni di contatto</span>
              <svg
                className={`w-5 h-5 transition-transform ${showContacts ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showContacts && (
              <div className="p-3 border-t border-gray-200">
                {/* Phone Numbers */}
                <div className="mb-4">
                  <fieldset>
                    <legend className="block text-sm text-gray-600 mb-1">Telefono</legend>
                    {phones.map((phone, index) => (
                      <div key={`phone-${index}`} className="flex mb-2">
                        <label htmlFor={`event-phone-${index}`} className="sr-only">
                          Telefono {index + 1}
                        </label>
                        <input
                          id={`event-phone-${index}`}
                          type="tel"
                          placeholder="Aggiungi numero di telefono"
                          value={phone}
                          onChange={(e) => updatePhone(index, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          aria-label={`Rimuovi telefono ${index + 1}`}
                          onClick={() => removePhone(index)}
                          disabled={phones.length === 1 && phone === ''}
                          className="px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                        >
                          -
                        </button>
                      </div>
                    ))}
                  </fieldset>
                  <button
                    type="button"
                    onClick={addPhone}
                    className="mt-1 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Aggiungi altro numero
                  </button>
                </div>

                {/* Email Addresses */}
                <div>
                  <fieldset>
                    <legend className="block text-sm text-gray-600 mb-1">Email</legend>
                    {emails.map((email, index) => (
                      <div key={`email-${index}`} className="flex mb-2">
                        <label htmlFor={`event-email-${index}`} className="sr-only">
                          Email {index + 1}
                        </label>
                        <input
                          id={`event-email-${index}`}
                          type="email"
                          placeholder="Aggiungi email di contatto"
                          value={email}
                          onChange={(e) => updateEmail(index, e.target.value)}
                          onBlur={() => {
                            if (!isValidEmail(email)) {
                              alert('Email non valida');
                            }
                          }}
                          className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          type="button"
                          aria-label={`Rimuovi email ${index + 1}`}
                          onClick={() => removeEmail(index)}
                          disabled={emails.length === 1 && email === ''}
                          className="px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r text-gray-500 hover:bg-gray-200 disabled:opacity-50"
                        >
                          -
                        </button>
                      </div>
                    ))}
                  </fieldset>
                  <button
                    type="button"
                    onClick={addEmail}
                    className="mt-1 text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Aggiungi altra email
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mb-4 border border-gray-200 rounded overflow-hidden">
            <button
              type="button"
              className="w-full py-2 px-3 bg-gray-50 text-left flex justify-between items-center"
              onClick={() => setShowAttendees(!showAttendees)}
            >
              <span className="font-medium text-gray-700">Partecipanti</span>
              <svg
                className={`w-5 h-5 transition-transform ${showAttendees ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showAttendees && (
              <div className="p-3 border-t border-gray-200">
                <label htmlFor="event-attendees" className="block text-sm text-gray-600 mb-1">
                  Invitati (separati da virgola)
                </label>
                <textarea
                  id="event-attendees"
                  placeholder="nome@esempio.com, altro@esempio.com"
                  value={attendeesText}
                  onChange={(e) => setAttendeesText(e.target.value)}
                  rows={2}
                  className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          <div className="flex justify-between gap-2 mt-4">
            {event && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded"
              >
                Elimina
              </button>
            )}

            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={isEventInPast() && !event}
                className={`px-4 py-2 rounded
                  ${
                    isEventInPast() && !event
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
              >
                Salva
              </button>
            </div>
          </div>
        </form>
      </button>
    </button>
  );
};

export default EventModal;
