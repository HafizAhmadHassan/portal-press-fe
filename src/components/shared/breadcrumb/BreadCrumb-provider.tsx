import React, { useState, ReactNode } from 'react';
import { BreadcrumbContext } from './breadcrumb-context';
import { KgnBreadcrumbItem, NavGroup, NavItem } from './types';

interface BreadcrumbProviderProps {
    children: ReactNode;
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({ children }) => {
    const [breadcrumbItems, setBreadcrumbItems] = useState<KgnBreadcrumbItem[]>([]);
    const [navItems, setNavItems] = useState<NavGroup[]>([]);

    const setNavLeft = (...items: NavItem[]) => {
        setNavItems([{ items }]);
    };

    const clear = () => {
        setBreadcrumbItems([]);
        setNavItems([]);
    };

    return (
        <BreadcrumbContext.Provider
            value={{
                breadcrumbItems,
                navItems,
                setBreadcrumbItems,
                setNavItems,
                setNavLeft,
                clear,
            }}
        >
            {children}
        </BreadcrumbContext.Provider>
    );
};