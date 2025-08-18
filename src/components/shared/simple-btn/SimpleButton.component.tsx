import React from 'react';
import styles from './SimpleButton.module.scss';
import type { LucideIcon } from 'lucide-react';

type SimpleButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'filled' | 'outline' | 'ghost';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'bare';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
};

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'filled',
  color = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
}) => {
  const IconComponent = icon;

  const buttonClass = [
    styles.simpleButton,
    styles[`simpleButton--${variant}`],
    styles[`simpleButton--${color}`],
    styles[`simpleButton--${size}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClass} onClick={onClick} type={type} disabled={disabled}>
      {iconPosition === 'left' && IconComponent && (
        <IconComponent size={16} className={styles.simpleButton__icon} />
      )}

      <span className={styles.simpleButton__text}>{children}</span>

      {iconPosition === 'right' && IconComponent && (
        <IconComponent size={16} className={styles.simpleButton__icon} />
      )}
    </button>
  );
};
