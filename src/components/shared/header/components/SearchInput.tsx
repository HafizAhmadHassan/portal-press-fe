import React from 'react';
import { Input } from '@components/shared/inputs/Input.component';
import styles from '../styles/Pill.module.scss';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  SearchIcon: React.ReactNode; // può essere <Search size={16} />
  placeholder?: string;
  name?: string;
  disabled?: boolean;
};

export default function SearchInput({
  value,
  onChange,
  onSearch,
  SearchIcon,
  placeholder = 'Cerca dispositivi',
  name = 'search-gps',
  disabled = false,
}: Props) {
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className={styles.pillInput}>
      <Input
        label="Cerca dispositivi"
        hideLabel
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange((e.target as HTMLInputElement).value)}
        onKeyUp={handleKeyUp}
        disabled={disabled}
        icon={SearchIcon}             // può essere componente o elemento
        iconPosition="left"
        size="sm"
        // Rende l'input “bare” (niente bordo/ombra) perché è la .pill esterna ad avere il bordo
        containerClassName={styles.bareContainer}
        inputClassName={styles.bareField}
      />
    </div>
  );
}
