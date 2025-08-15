import React, { useEffect, useRef, useState } from 'react';
import styles from './Select.module.scss';
import { ChevronDown, type LucideIcon, User } from 'lucide-react';

type OptionType = {
  value: string | number;
  label: string;
};

type SelectProps = {
  label: string;
  name: string;
  placeholder?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  options: OptionType[];
  disabled?: boolean;
  required?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
};

export const Select = ({
  label = 'Select Default',
  name = 'select-default',
  placeholder = "Seleziona un'opzione",
  value = '',
  onChange = (value) => console.log('Select changed:', value),
  options = [],
  disabled = false,
  required = false,
  icon = User,
  iconPosition = 'left',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const IconComponent = icon;
  const labelId = `${name}-label`;

  // Trova l'opzione selezionata per mostrare il label
  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  // Chiudi il dropdown quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue: string | number) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    } else if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className={styles.selectContainer}>
      <label id={labelId} htmlFor={name} className={styles.selectLabel}>
        {label}
      </label>

      <div
        ref={selectRef}
        className={`${styles.selectWrapper} ${iconPosition === 'left' ? styles.iconLeft : styles.iconRight} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
      >
        {iconPosition === 'left' && IconComponent && (
          <span className={styles.selectIcon}>
            <IconComponent size={16} />
          </span>
        )}

        <div
          className={styles.selectInput}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={labelId}
        >
          <span className={`${styles.selectValue} ${!selectedOption ? styles.placeholder : ''}`}>
            {displayValue}
          </span>

          <ChevronDown
            size={16}
            className={`${styles.chevronIcon} ${isOpen ? styles.rotated : ''}`}
          />
        </div>

        {iconPosition === 'right' && IconComponent && (
          <span className={styles.selectIcon}>
            <IconComponent size={16} />
          </span>
        )}

        {isOpen && (
          <div className={styles.optionsContainer}>
            <ul className={styles.optionsList} role="listbox" aria-labelledby={labelId}>
              {options.map((option) => (
                <li
                  key={option.value}
                  className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
                  onClick={() => handleOptionClick(option.value)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Hidden input per form submission */}
      <input type="hidden" name={name} value={value} required={required} />
    </div>
  );
};
