import React, { useEffect, useState } from 'react';

interface Calendar {
  id: number;
  name: string;
  color: string;
  visible: boolean;
}

interface CalendarModalProps {
  calendar?: Calendar; // If provided, we're editing. If not, we're creating.
  onClose: () => void;
  onSave: (calendar: Omit<Calendar, 'id' | 'visible'>) => void;
  onDelete?: (calendarId: number) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ calendar, onClose, onSave, onDelete }) => {
  const [name, setName] = useState(calendar?.name || '');
  const [color, setColor] = useState(calendar?.color || '#4285F4');

  // Predefined colors similar to Google Calendar
  const predefinedColors = [
    '#4285F4', // Blue
    '#0F9D58', // Green
    '#DB4437', // Red
    '#F4B400', // Yellow
    '#8e44ad', // Purple
    '#3498db', // Light Blue
    '#e67e22', // Orange
    '#1abc9c', // Turquoise
    '#34495e', // Navy
    '#7f8c8d', // Gray
  ];

  useEffect(() => {
    // Focus the name input when modal opens
    const timer = setTimeout(() => {
      const nameInput = document.getElementById('calendar-name-input');
      if (nameInput) nameInput.focus();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Per favore inserisci un nome per il calendario');
      return;
    }

    onSave({ name, color });
  };

  const handleDelete = () => {
    if (!calendar || !onDelete) return;

    if (window.confirm(`Sei sicuro di voler eliminare il calendario "${calendar.name}"?`)) {
      onDelete(calendar.id);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <button
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <button
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {calendar ? 'Modifica calendario' : 'Nuovo calendario'}
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

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="calendar-name-input" className="block text-sm text-gray-600 mb-1">
              Nome
            </label>
            <input
              id="calendar-name-input"
              type="text"
              placeholder="Nome del calendario"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="calendar-color-input" className="block text-sm text-gray-600 mb-2">
              Colore
            </label>
            <div className="flex flex-wrap gap-2">
              {predefinedColors.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  onClick={() => setColor(presetColor)}
                  className={`w-8 h-8 rounded-full ${
                    color === presetColor ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: presetColor }}
                  aria-label={`Seleziona colore ${presetColor}`}
                />
              ))}

              <div className="flex items-center ml-2">
                <input
                  id="calendar-color-input"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 cursor-pointer rounded overflow-hidden"
                  aria-label="Scegli colore personalizzato"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            {calendar && onDelete && (
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
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
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

export default CalendarModal;
