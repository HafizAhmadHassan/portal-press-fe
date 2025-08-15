import React from 'react';
import styles from '../styles/Pill.module.scss';

type Props = {
  selected: string;
  options: string[];
  onChange: (value: string) => void;
  ChevronIcon: React.ReactNode;
};

export default function FilterSelect({ selected, options, onChange, ChevronIcon }: Props) {
  return (
    <div className={styles.pillSelect}>
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filtro di ricerca"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {ChevronIcon}
    </div>
  );
}
