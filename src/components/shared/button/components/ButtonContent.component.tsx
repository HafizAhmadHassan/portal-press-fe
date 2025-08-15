import React from 'react';
import { ButtonIcon } from './ButtonIcon.component';

interface ButtonContentProps {
  icon: string | React.ReactNode | null;
  iconPosition: 'left' | 'right';
  iconOnly: boolean;
  label: string;
  children?: React.ReactNode;
}

export const ButtonContent: React.FC<ButtonContentProps> = ({
                                                              icon,
                                                              iconPosition,
                                                              iconOnly,
                                                              label,
                                                              children,
                                                            }) => {
  const hasIcon = !!icon;
  const content = children || label;

  if (iconOnly && hasIcon) {
    return (
      <span className="btn-icon">
                {icon}
            </span>
    );
  }

  return (
    <>
      {hasIcon && iconPosition === 'left' && (
        <ButtonIcon
          icon={icon}
          position="left"
          isVisible={true}
        />
      )}

      {!iconOnly && content && (
        <span className="btn-text">{content}</span>
      )}

      {hasIcon && iconPosition === 'right' && (
        <ButtonIcon
          icon={icon}
          position="right"
          isVisible={true}
        />
      )}
    </>
  );
};