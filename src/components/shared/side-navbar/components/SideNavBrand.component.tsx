import React from 'react';
import styles from '../styles/SideNavBrand.module.scss';

interface Props {
    logo?: string;
    title?: string;
    subtitle?: string;
    collapsed: boolean;
}

export function SideNavBrand({ logo, title, subtitle, collapsed }: Props) {
    return (
        <div className={styles.brand}>
            {logo && (
                <img
                    src={logo}
                    alt="Logo"
                    className={styles.logo}
                />
            )}
            {!collapsed && (
                <div className={styles.brandText}>
                    {title && <h1 className={styles.title}>{title}</h1>}
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
            )}
        </div>
    );
}