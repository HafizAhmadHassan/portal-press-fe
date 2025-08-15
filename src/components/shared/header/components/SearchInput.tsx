import React from 'react';
import styles from '../styles/Pill.module.scss';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  SearchIcon: React.ReactNode;
};

export default function SearchInput({ value, onChange, onSearch, SearchIcon }: Props) {
  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onSearch();
  };

  return (
    <div className={styles.pillInput}>
      {SearchIcon}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={handleKeyUp}
        placeholder="Cerca dispositivi"
        aria-label="Search"
      />
    </div>
  );
}
