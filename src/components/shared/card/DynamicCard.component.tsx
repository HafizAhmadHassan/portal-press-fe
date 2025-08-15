// DynamicCard.tsx - Componente Composable Semplice
import React from 'react';
import './DynamicCard.css';

// === TYPES ===
interface DynamicCardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'horizontal' | 'vertical';
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'compact' | 'expanded';
  showDivider?: boolean;
  alignment?: 'left' | 'center' | 'right' | 'space-between';
}

// === MAIN CARD COMPONENT ===
export const DynamicCard: React.FC<DynamicCardProps> = ({
  variant = 'default',
  size = 'md',
  direction = 'horizontal',
  className = '',
  style,
  children,
}) => {
  const cardClasses = [
    'dynamic-card',
    `dynamic-card--${variant}`,
    `dynamic-card--${size}`,
    `dynamic-card--${direction}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} style={style}>
      {children}
    </div>
  );
};

// === CARD HEADER ===
export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return <div className={`card-header ${className}`}>{children}</div>;
};

// === CARD BODY ===
export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
  direction = 'horizontal',
}) => {
  const bodyClasses = ['card-body-container', `card-body-container--${direction}`, className]
    .filter(Boolean)
    .join(' ');

  return <div className={bodyClasses}>{children}</div>;
};

// === CARD FOOTER ===
export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  variant = 'default',
  showDivider = true,
  alignment = 'space-between',
}) => {
  const footerClasses = [
    'card-footer',
    `card-footer--${variant}`,
    `card-footer--${alignment}`,
    showDivider ? 'card-footer--divider' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={footerClasses}>{children}</div>;
};

// === UTILITY COMPONENTS ===

// Status Indicator Semplice
export const StatusIndicator: React.FC<{
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  showText?: boolean;
}> = ({ isActive, activeLabel = 'ATTIVO', inactiveLabel = 'NON ATTIVO', showText = true }) => {
  return (
    <div className="card-status">
      <div
        className={`card-status-indicator ${isActive ? 'card-status-indicator--active' : 'card-status-indicator--inactive'}`}
      />
      {showText && (
        <div
          className={`card-status-text ${isActive ? 'card-status-text--active' : 'card-status-text--inactive'}`}
        >
          {isActive ? activeLabel : inactiveLabel}
        </div>
      )}
    </div>
  );
};

// Button per Actions
export const CardButton: React.FC<{
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}> = ({
  variant = 'default',
  size = 'sm',
  disabled = false,
  onClick,
  children,
  className = '',
}) => {
  const buttonClasses = [
    'card-action',
    `card-action--${variant}`,
    `card-action--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
};

// Image Container
export const CardImage: React.FC<{
  src: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  aspectRatio?: string;
  className?: string;
}> = ({ src, alt = 'Image', size = 'md', aspectRatio = '1/1', className = '' }) => {
  const imageStyle: React.CSSProperties = {
    aspectRatio: aspectRatio,
  };

  return (
    <div className={`card-image card-image--${size} ${className}`}>
      <div className="card-image__wrapper" style={imageStyle}>
        <img src={src} alt={alt} className="card-image__img" />
      </div>
    </div>
  );
};

// Badge per categorie
export const CardBadge: React.FC<{
  children: React.ReactNode;
  variant?: string;
  className?: string;
}> = ({ children, variant = '', className = '' }) => {
  const badgeClasses = [
    'card-category',
    variant ? `card-category--${variant.toLowerCase().replace(/\s+/g, '-')}` : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={badgeClasses}>{children}</div>;
};

// Export dei tipi
export type { DynamicCardProps, CardHeaderProps, CardBodyProps, CardFooterProps };
