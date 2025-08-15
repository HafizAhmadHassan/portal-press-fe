import React, { forwardRef } from 'react';
import type { ButtonProps } from './types/Button.types';
import { ButtonClassBuilder } from './utils/ButtonClassBuilder.utils';
import { ButtonContent } from './components/ButtonContent.component';
import { useButtonConfig } from './hooks/UseButtonConfig.hook';
import { IconMappingProvider } from './context/IconMapping.context';
import { ButtonConfigProvider } from './context/ButtonConfig.context';
import './style/index.scss';

// Inline _styles (in a real app, you would import from a separate CSS file)
const buttonStyles = `
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  appearance: none;
  background: none;
  border: 1px solid transparent;
  margin: 0;
  outline: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 6px;
  min-height: 40px;
  gap: 0.5rem;
  transition: all 0.2s ease-in-out;
  transform: translateZ(0);
  will-change: transform, box-shadow;
}

a.btn {
  text-decoration: none;
}

.btn:focus {
  outline: 0;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.btn:disabled,
.btn.disabled {
  pointer-events: none;
  opacity: 0.6;
  transform: none !important;
  box-shadow: none !important;
}

.btn.loading {
  position: relative;
  pointer-events: none;
  color: transparent !important;
}

.btn.loading::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.btn.loading .btn-text,
.btn.loading .btn-icon {
  opacity: 0;
}

.btn-primary {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.btn-primary:hover:not(:disabled):not(.loading) {
  background: linear-gradient(135deg, #5a67d8 0%, #6b4395 100%);
  border-color: #5a67d8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  color: white;
  background: linear-gradient(135deg, #6c757d 0%, #495057 100%);
  border-color: #6c757d;
}

.btn-secondary:hover:not(:disabled):not(.loading) {
  background: linear-gradient(135deg, #5a6268 0%, #3d4142 100%);
  border-color: #5a6268;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.4);
}

.btn-success {
  color: white;
  background: linear-gradient(135deg, #51cf66 0%, #40c057 100%);
  border-color: #51cf66;
}

.btn-success:hover:not(:disabled):not(.loading) {
  background: linear-gradient(135deg, #40c057 0%, #37b24d 100%);
  border-color: #40c057;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(81, 207, 102, 0.4);
}

.btn-danger {
  color: white;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  border-color: #ff6b6b;
}

.btn-danger:hover:not(:disabled):not(.loading) {
  background: linear-gradient(135deg, #ff5252 0%, #f03e3e 100%);
  border-color: #ff5252;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.btn-warning {
  color: #212529;
  background: linear-gradient(135deg, #ffd43b 0%, #fab005 100%);
  border-color: #ffd43b;
}

.btn-warning:hover:not(:disabled):not(.loading) {
  background: linear-gradient(135deg, #fab005 0%, #f59f00 100%);
  border-color: #fab005;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 212, 59, 0.4);
}

.btn-info {
  color: white;
  background: linear-gradient(135deg, #74c0fc 0%, #339af0 100%);
  border-color: #74c0fc;
}

.btn-info:hover:not(:disabled):not(.loading) {
  background: linear-gradient(135deg, #339af0 0%, #228be6 100%);
  border-color: #339af0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(116, 192, 252, 0.4);
}

.btn-outline-primary {
  color: #667eea;
  border-color: #667eea;
  background: transparent;
}

.btn-outline-primary:hover:not(:disabled):not(.loading) {
  color: white;
  background: #667eea;
  border-color: #5a67d8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d;
  background: transparent;
}

.btn-outline-secondary:hover:not(:disabled):not(.loading) {
  color: white;
  background: #6c757d;
  border-color: #5a6268;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.btn-outline-success {
  color: #51cf66;
  border-color: #51cf66;
  background: transparent;
}

.btn-outline-success:hover:not(:disabled):not(.loading) {
  color: white;
  background: #51cf66;
  border-color: #40c057;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(81, 207, 102, 0.3);
}

.btn-outline-danger {
  color: #ff6b6b;
  border-color: #ff6b6b;
  background: transparent;
}

.btn-outline-danger:hover:not(:disabled):not(.loading) {
  color: white;
  background: #ff6b6b;
  border-color: #ff5252;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.btn-ghost-primary {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  border: none;
}

.btn-ghost-primary:hover:not(:disabled):not(.loading) {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
}

.btn-ghost-secondary {
  color: #6c757d;
  background: rgba(108, 117, 125, 0.1);
  border: none;
}

.btn-ghost-secondary:hover:not(:disabled):not(.loading) {
  background: rgba(108, 117, 125, 0.2);
  transform: translateY(-1px);
}

.btn-xs {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  min-height: 28px;
  border-radius: 4px;
  gap: 0.25rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  min-height: 32px;
  border-radius: 5px;
  gap: 0.375rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
  min-height: 48px;
  border-radius: 8px;
  gap: 0.625rem;
}

.btn-xl {
  padding: 1rem 2rem;
  font-size: 1.25rem;
  min-height: 56px;
  border-radius: 10px;
  gap: 0.75rem;
}

.btn-block {
  display: flex;
  width: 100%;
}

.btn-rounded {
  border-radius: 50px !important;
}

.btn-square {
  border-radius: 0 !important;
}

.btn-raised {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-raised:hover:not(:disabled):not(.loading) {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.btn-icon {
  padding: 0.5rem;
  aspect-ratio: 1;
  min-width: 40px;
  justify-content: center;
}

.btn-icon.btn-xs {
  padding: 0.25rem;
  min-width: 28px;
}

.btn-icon.btn-sm {
  padding: 0.375rem;
  min-width: 32px;
}

.btn-icon.btn-lg {
  padding: 0.75rem;
  min-width: 48px;
}

.btn-icon.btn-xl {
  padding: 1rem;
  min-width: 56px;
}

.btn-pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes spin {
  0% { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.btn-icon-left {
  margin-right: 0.5rem;
}

.btn-icon-right {
  margin-left: 0.5rem;
}

.lucide,
.btn svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.btn-xs .lucide,
.btn-xs svg {
  width: 12px;
  height: 12px;
}

.btn-sm .lucide,
.btn-sm svg {
  width: 14px;
  height: 14px;
}

.btn-lg .lucide,
.btn-lg svg {
  width: 18px;
  height: 18px;
}

.btn-xl .lucide,
.btn-xl svg {
  width: 20px;
  height: 20px;
}
`;

const ButtonInner = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (
    {
      type = 'button',
      disabled = false,
      loading = false,
      block = false,
      rounded = false,
      raised = false,
      square = false,
      pulse = false,
      iconOnly = false,
      href,
      target = '_self',
      rel,
      className,
      style,
      children,
      onClick,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const config = useButtonConfig(props);

    const buttonClasses = ButtonClassBuilder.create()
      .variant(config.variant)
      .size(config.size)
      .block(block)
      .rounded(rounded)
      .raised(raised)
      .square(square)
      .iconOnly(iconOnly)
      .loading(loading)
      .pulse(pulse)
      .iconPosition(config.iconPosition, !!config.icon, iconOnly)
      .custom(className)
      .build();

    const handleClick = (event: React.MouseEvent) => {
      if (disabled || loading) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    };
    const ariaLabel = iconOnly && config.label ? config.label : undefined;

    const commonProps = {
      className: buttonClasses,
      style,
      onClick: handleClick,
      onFocus,
      onBlur,
      'aria-label': ariaLabel,
    };

    if (href) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={rel}
          {...commonProps}
        >
          <ButtonContent
            icon={config.icon}
            iconPosition={config.iconPosition}
            iconOnly={iconOnly}
            label={config.label}
          >
            {children}
          </ButtonContent>
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        disabled={disabled}
        {...commonProps}
      >
        <ButtonContent
          icon={config.icon}
          iconPosition={config.iconPosition}
          iconOnly={iconOnly}
          label={config.label}
        >
          {children}
        </ButtonContent>
      </button>
    );
  }
);

ButtonInner.displayName = 'Button';

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: buttonStyles }} />
        <IconMappingProvider>
          <ButtonConfigProvider>
            <ButtonInner ref={ref} {...props} />
          </ButtonConfigProvider>
        </IconMappingProvider>
      </>
    );
  }
);

Button.displayName = 'Button';
