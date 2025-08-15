import { useContext, useMemo } from 'react';
import type { ButtonConfigDefaults, ButtonProps } from '../types/Button.types';
import { ButtonConfigContext } from '../context/ButtonConfig.context';

// Defaults di fallback quando il context non è disponibile
const fallbackDefaults: ButtonConfigDefaults = {
    variant: 'primary',
    size: 'md',
    iconPosition: 'left',
};

export const useButtonConfig = (props: ButtonProps) => {
    // Usa useContext direttamente per gestire l'assenza del provider
    const context = useContext(ButtonConfigContext);

    // Se il context non è disponibile, usa i defaults di fallback
    const defaults = context?.defaults || fallbackDefaults;
    const getPreset = context?.getPreset || (() => undefined);

    const resolvedConfig = useMemo(() => {
        const presetConfig = props.preset ? getPreset(props.preset) : undefined;

        return {
            variant: props.variant || presetConfig?.variant || defaults.variant,
            size: props.size || presetConfig?.size || defaults.size,
            iconPosition: props.iconPosition || defaults.iconPosition,
            icon: props.icon || presetConfig?.icon || null,
            label: props.label || presetConfig?.label || '',
        };
    }, [props, defaults, getPreset]);

    return resolvedConfig;
};

// Export default per compatibilità
export default useButtonConfig;