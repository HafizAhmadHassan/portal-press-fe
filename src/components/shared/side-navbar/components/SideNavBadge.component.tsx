import React from 'react';
import styles from '../styles/SideNavBadge.module.scss';

interface Props {
    value?: string | number;
}

export function SideNavBadge({ value }: Props) {
    if (!value) return null;

    return (
        <span className={styles.badge}>{value}</span>
    );
}