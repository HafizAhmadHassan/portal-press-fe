import React from 'react';
import { ChevronDown, ChevronRight, ChevronUp, ChevronLeft } from 'lucide-react';
import styles from '../styles/SideNavChevron.module.scss';
import type { AccordionDirection } from '../types/MenuItem';

interface Props {
    direction: AccordionDirection;
    isOpen: boolean;
}

export function SideNavChevron({ direction, isOpen }: Props) {
    const getChevronIcon = () => {
        const size = 16;

        switch (direction) {
            case 'down':
                return isOpen ? <ChevronDown size={size} /> : <ChevronRight size={size} />;
            case 'right':
                return <ChevronRight size={size} />;
            case 'left':
                return <ChevronLeft size={size} />;
            case 'up':
                return isOpen ? <ChevronUp size={size} /> : <ChevronRight size={size} />;
            default:
                return <ChevronRight size={size} />;
        }
    };

    return (
        <div className={`${styles.chevronContainer} ${isOpen ? styles.open : ''}`}>
            {getChevronIcon()}
        </div>
    );
}