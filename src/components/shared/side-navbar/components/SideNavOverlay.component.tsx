import React from 'react';
import styles from '../styles/SideNavOverlay.module.scss';

interface Props {
    onClick: () => void;
}

export function SideNavOverlay({ onClick }: Props) {
    return (
        <div
            className={styles.overlay}
            onClick={onClick}
            role="button"
            tabIndex={-1}
            aria-label="Close navigation"
        />
    );
}