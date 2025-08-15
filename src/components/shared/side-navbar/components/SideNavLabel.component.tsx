import React from 'react';
import styles from '../styles/SideNavLabel.module.scss';

interface Props {
    text: string;
}

export function SideNavLabel({ text }: Props) {
    return (
        <span className={styles.label}>{text}</span>
    );
}