import React from 'react';

export const ResolveIcon = (
  iconInput: string | React.ReactNode | null,
  getIcon: (name: string) => React.ReactNode | null,
  fallback?: React.ReactNode
): React.ReactNode | null => {
    if (!iconInput) return fallback || null;

    // If it's already a React node, return it
    if (React.isValidElement(iconInput)) {
        return iconInput;
    }

    // If it's a string, try to resolve it
    if (typeof iconInput === 'string') {
        const resolved = getIcon(iconInput);
        return resolved || fallback || null;
    }

    return fallback || null;
};