import React from 'react';
import styles from './Input.module.scss';
import { type LucideIcon, Mail } from 'lucide-react';

type InputProps = {
  label: string;
  name: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'date';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled?: boolean;
  required?: boolean;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  error?: string;
  multiline?: boolean;
};

export const Input = ({
  label = 'Input Default',
  name = 'input-default',
  placeholder = 'Inserisci il tuo testo qui',
  type = 'text',
  value = '',
  onChange = (e) => console.log('Input Default Changed!', (e.target as HTMLInputElement).value),
  disabled = false,
  required = false,
  icon = Mail,
  iconPosition = 'left',
  error = '',
  multiline = false,
}: InputProps) => {
  const IconComponent = icon;
  const errorId = error ? `${name}-error` : undefined;
  const labelId = `${name}-label`;

  return (
    <div className={`${styles.inputContainer} ${error ? styles.hasError : ''}`}>
      <label id={labelId} htmlFor={name} className={styles.inputLabel}>
        {label}
      </label>

      <div className={`${styles.inputWrapper} ${iconPosition === 'left' ? styles.iconLeft : styles.iconRight}`}>
        {iconPosition === 'left' && IconComponent && (
          <span className={styles.inputIcon}>
            <IconComponent size={16} />
          </span>
        )}

        {multiline ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={styles.field}
            aria-labelledby={labelId}
            aria-invalid={!!error}
            aria-describedby={errorId}
            rows={4}
          />
        ) : (
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={styles.field}
            aria-labelledby={labelId}
            aria-invalid={!!error}
            aria-describedby={errorId}
          />
        )}

        {iconPosition === 'right' && IconComponent && (
          <span className={styles.inputIcon}>
            <IconComponent size={16} />
          </span>
        )}
      </div>

      {error ? (
        <div id={errorId} className={styles.errorText}>
          {error}
        </div>
      ) : null}
    </div>
  );
};
