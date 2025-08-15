import React from 'react';
import { UseIconResolver } from '../hooks/UseIconResolver.hook';

interface ButtonIconProps {
    icon: string | React.ReactNode | null;
    position: 'left' | 'right';
    isVisible: boolean;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({ icon, position, isVisible }) => {
    const resolvedIcon = UseIconResolver(icon);

    if (!isVisible || !resolvedIcon) {
        return null;
    }

    return (
      <span className={`btn-icon btn-icon-${position}`}>
            {resolvedIcon}
        </span>
    );
};