import { CalendarIcon } from 'lucide-react';
import React from 'react';

import { useCalendar } from '@_hooks/useCalendar';

import YearView from '../google-calendar/YearView';

import BrandCalendarHeader from './BrandCalendarHeader';
import BrandDayView from './BrandDayView';
import BrandMonthView from './BrandMonthView';

// Import the brand-specific _components

interface BrandInputCalendarProps {
  field: {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
  };
  variant?: 'default' | 'admin';
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disablePast?: boolean;
  disabledDates?: string[] | Date[];
  disableWeekends?: boolean;
  disableSundays?: boolean;
}

const BrandInputCalendar: React.FC<BrandInputCalendarProps> = ({
  field,
  variant = 'default',
  className = '',
  disabled = false,
  placeholder = 'Seleziona una data',
  onChange,
  onBlur,
  disablePast = false,
  disabledDates = [],
  disableWeekends = false,
  disableSundays = false,
}) => {
  const {
    displayValue,
    viewDate,
    viewMode,
    today,
    calendarData,
    wrapperRef,
    currentYearRef,
    isPickerOpen,
    setIsPickerOpen,
    handleDateSelect,
    handleMonthSelect,
    handleYearSelect,
    handleViewModeChange,
    changeMonth,
    changeYear,
    handleTodayClick,
    isSelected,
    isSelectedMonth,
    isSelectedYear,
    isDateInPast,
    isMonthInPast,
    isYearInPast,
    isDateDisabled,
  } = useCalendar({
    initialValue: field.value,
    disablePast,
    disabledDates,
    disableWeekends,
    disableSundays,
    onChange: (value) => {
      field.onChange(value);
      onChange?.({ target: { value } } as React.ChangeEvent<HTMLInputElement>);
    },
    onBlur: () => {
      field.onBlur();
      onBlur?.({} as React.FocusEvent<HTMLInputElement>);
    },
  });

  const handleInputClick = () => {
    if (!disabled) setIsPickerOpen(true);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <input
        type="text"
        readOnly
        disabled={disabled}
        value={displayValue}
        onClick={handleInputClick}
        placeholder={placeholder}
        className={`block w-full rounded-lg border px-4 py-2 text-sm shadow-lg transition placeholder:text-gray-400 focus:outline-none ${
          variant === 'admin'
            ? 'border-slate-700 bg-slate-900 text-white focus:border-slate-500 focus:ring-2 focus:ring-slate-500'
            : 'border-slate-300 bg-white text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500'
        } ${className}`}
      />
      <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-gray-500" />

      {isPickerOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-lg border bg-white shadow-lg p-4">
          <BrandCalendarHeader
            viewMode={viewMode}
            viewDate={viewDate}
            disablePast={disablePast}
            isMonthInPast={isMonthInPast}
            isYearInPast={isYearInPast}
            changeMonth={changeMonth}
            changeYear={changeYear}
            handleViewModeChange={handleViewModeChange}
          />

          {viewMode === 'day' && (
            <BrandDayView
              calendarData={calendarData}
              viewDate={viewDate}
              disablePast={disablePast}
              isDateInPast={isDateInPast}
              isDateDisabled={isDateDisabled}
              isSelected={isSelected}
              handleDateSelect={handleDateSelect}
              handleTodayClick={handleTodayClick}
              today={today}
            />
          )}

          {viewMode === 'month' && (
            <BrandMonthView
              viewDate={viewDate}
              disablePast={disablePast}
              isMonthInPast={isMonthInPast}
              isSelectedMonth={isSelectedMonth}
              handleMonthSelect={handleMonthSelect}
            />
          )}

          {viewMode === 'year' && (
            <YearView
              today={today}
              disablePast={disablePast}
              isYearInPast={isYearInPast}
              isSelectedYear={isSelectedYear}
              handleYearSelect={handleYearSelect}
              currentYearRef={currentYearRef}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default BrandInputCalendar;
