import React from 'react';
import { Menu, X } from 'lucide-react';
import styles from '../styles/SideNavMobileToggle.module.scss';

interface Props {
    isOpen: boolean;
    onToggle: () => void;
}

export function SideNavMobileToggle({ isOpen, onToggle }: Props) {
    return (
        <button
            className={styles.mobileToggle}
            onClick={onToggle}
            aria-label="Toggle navigation"
        >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
    );
}
