import { useMemo } from 'react';
import { useIconMappingContext } from '../context/IconMapping.context';
import { ResolveIcon } from '../utils/IconResolver.utils';

export const UseIconResolver = (
  iconInput: string | React.ReactNode | null,
  fallback?: React.ReactNode
) => {
    const { getIcon } = useIconMappingContext();

    return useMemo(() => {
        return ResolveIcon(iconInput, getIcon, fallback);
    }, [iconInput, getIcon, fallback]);
};