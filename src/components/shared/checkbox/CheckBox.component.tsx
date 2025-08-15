import React, { forwardRef } from 'react';
import { Check, Minus } from 'lucide-react';
import styles from './Checkbox.module.scss';

export interface CheckboxProps {
  /** Etichetta del checkbox */
  label?: string;
  /** Descrizione aggiuntiva sotto l'etichetta */
  description?: string;
  /** Stato checked del checkbox */
  checked?: boolean;
  /** Stato indeterminato (per checkbox padre con figli misti) */
  indeterminate?: boolean;
  /** Funzione chiamata al cambio di stato */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  /** Se il checkbox è disabilitato */
  disabled?: boolean;
  /** Nome del campo (per form) */
  name?: string;
  /** Valore del checkbox */
  value?: string;
  /** ID del checkbox */
  id?: string;
  /** Dimensione del checkbox */
  size?: 'sm' | 'md' | 'lg';
  /** Variante di colore */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** Classe CSS aggiuntiva */
  className?: string;
  /** Se deve essere obbligatorio */
  required?: boolean;
  /** Messaggio di errore */
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({
     label,
     description,
     checked = false,
     indeterminate = false,
     onChange,
     disabled = false,
     name,
     value,
     id,
     size = 'md',
     color = 'primary',
     className = '',
     required = false,
     error,
     ...props
   }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    const isChecked = indeterminate ? false : checked;
    const showCheck = checked && !indeterminate;
    const showMinus = indeterminate;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!disabled) {
        onChange?.(event.target.checked, event);
      }
    };

    const getCheckboxClasses = () => {
      const classes = [
        styles.checkbox,
        styles[`checkbox--${size}`],
        styles[`checkbox--${color}`]
      ];

      if (isChecked || indeterminate) classes.push(styles['checkbox--checked']);
      if (disabled) classes.push(styles['checkbox--disabled']);
      if (error) classes.push(styles['checkbox--error']);
      if (className) classes.push(className);

      return classes.filter(Boolean).join(' ');
    };

    const getWrapperClasses = () => {
      const classes = [styles.checkboxWrapper];
      if (disabled) classes.push(styles['checkboxWrapper--disabled']);
      return classes.join(' ');
    };

    return (
      <div className={getWrapperClasses()}>
        <div className={styles.checkboxContainer}>
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            name={name}
            value={value}
            checked={isChecked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className={styles.checkboxInput}
            aria-describedby={description ? `${checkboxId}-description` : undefined}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
          <label
            htmlFor={checkboxId}
            className={getCheckboxClasses()}
            aria-hidden="true"
          >
            {showCheck && (
              <Check
                className={`${styles.checkboxIcon} ${styles[`checkboxIcon--${size}`]}`}
                strokeWidth={2.5}
              />
            )}
            {showMinus && (
              <Minus
                className={`${styles.checkboxIcon} ${styles[`checkboxIcon--${size}`]}`}
                strokeWidth={2.5}
              />
            )}
          </label>
        </div>

        {(label || description) && (
          <div className={styles.checkboxContent}>
            {label && (
              <label htmlFor={checkboxId} className={styles.checkboxLabel}>
                {label}
                {required && <span className={styles.checkboxRequired}>*</span>}
              </label>
            )}
            {description && (
              <p id={`${checkboxId}-description`} className={styles.checkboxDescription}>
                {description}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className={styles.checkboxError}>
            <p className={styles.checkboxErrorText}>{error}</p>
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// Componente per gruppi di checkbox
export interface CheckboxGroupProps {
  /** Etichetta del gruppo */
  label?: string;
  /** Descrizione del gruppo */
  description?: string;
  /** Array di opzioni */
  options: Array<{
    label: string;
    value: string;
    description?: string;
    disabled?: boolean;
  }>;
  /** Valori selezionati */
  value?: string[];
  /** Funzione chiamata al cambio */
  onChange?: (selectedValues: string[]) => void;
  /** Se tutto il gruppo è disabilitato */
  disabled?: boolean;
  /** Nome del gruppo (per form) */
  name?: string;
  /** Dimensione dei checkbox */
  size?: 'sm' | 'md' | 'lg';
  /** Colore dei checkbox */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /** Layout del gruppo */
  layout?: 'vertical' | 'horizontal' | 'grid';
  /** Numero di colonne per layout grid */
  columns?: 2 | 3 | 4;
  /** Se è obbligatorio selezionare almeno uno */
  required?: boolean;
  /** Messaggio di errore */
  error?: string;
  /** Classe CSS aggiuntiva */
  className?: string;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
                                                              label,
                                                              description,
                                                              options,
                                                              value = [],
                                                              onChange,
                                                              disabled = false,
                                                              name,
                                                              size = 'md',
                                                              color = 'primary',
                                                              layout = 'vertical',
                                                              columns = 2,
                                                              required = false,
                                                              error,
                                                              className = ''
                                                            }) => {
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;

    const newValue = checked
      ? [...value, optionValue]
      : value.filter((v) => v !== optionValue);

    onChange(newValue);
  };

  const getGroupClasses = () => {
    const classes = [
      styles.checkboxGroup,
      styles[`checkboxGroup--${layout}`]
    ];

    if (layout === 'grid') {
      classes.push(styles[`checkboxGroup--grid-${columns}`]);
    }

    if (className) classes.push(className);

    return classes.filter(Boolean).join(' ');
  };

  return (
    <fieldset className={styles.checkboxFieldset}>
      {label && (
        <legend className={styles.checkboxGroupLabel}>
          {label}
          {required && <span className={styles.checkboxRequired}>*</span>}
        </legend>
      )}

      {description && (
        <p className={styles.checkboxGroupDescription}>{description}</p>
      )}

      <div className={getGroupClasses()}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            label={option.label}
            description={option.description}
            checked={value.includes(option.value)}
            onChange={(checked) => handleCheckboxChange(option.value, checked)}
            disabled={disabled || option.disabled}
            name={name}
            value={option.value}
            size={size}
            color={color}
          />
        ))}
      </div>

      {error && (
        <p className={styles.checkboxGroupError}>{error}</p>
      )}
    </fieldset>
  );
};