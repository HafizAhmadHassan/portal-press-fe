import React from 'react';

// Base types
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'outline-primary'
  | 'outline-secondary'
  | 'outline-success'
  | 'outline-danger'
  | 'outline-warning'
  | 'outline-info'
  | 'ghost-primary'
  | 'ghost-secondary'
  | 'ghost-success'
  | 'ghost-danger'
  | 'ghost-warning'
  | 'ghost-info';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type IconPosition = 'left' | 'right';

// Icon mapping type
export type IconMapping = Record<string, React.ReactNode>;

// Button preset type
export interface ButtonPreset {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: React.ReactNode;
    iconPosition?: IconPosition;
    label?: string;
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
    rounded?: boolean;
    raised?: boolean;
    square?: boolean;
    pulse?: boolean;
    iconOnly?: boolean;
}

// Button configuration defaults
export interface ButtonConfigDefaults {
    variant: ButtonVariant;
    size: ButtonSize;
    iconPosition: IconPosition;
}

// Main Button Props
export interface ButtonProps {
    // Content props
    children?: React.ReactNode;
    label?: string;
    icon?: string | React.ReactNode;

    // Appearance props
    variant?: ButtonVariant;
    size?: ButtonSize;
    iconPosition?: IconPosition;
    iconOnly?: boolean;

    // State props
    disabled?: boolean;
    loading?: boolean;

    // Layout props
    block?: boolean;
    rounded?: boolean;
    raised?: boolean;
    square?: boolean;
    pulse?: boolean;

    // Link props
    href?: string;
    target?: '_self' | '_blank' | '_parent' | '_top';
    rel?: string;

    // Preset
    preset?: string;

    // HTML props
    type?: 'button' | 'submit' | 'reset';
    className?: string;
    style?: React.CSSProperties;

    // Event handlers
    onClick?: (event: React.MouseEvent) => void;
    onFocus?: (event: React.FocusEvent) => void;
    onBlur?: (event: React.FocusEvent) => void;

    // Other HTML attributes
    [key: string]: any;
}