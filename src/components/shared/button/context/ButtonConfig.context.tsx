import React, { createContext, type ReactNode, useContext, useState } from 'react';
import type { ButtonConfigDefaults, ButtonPreset } from '../types/Button.types';
import { defaultPresets } from '../utils/DefaultIcons.utils';

interface ButtonConfigContextType {
  defaults: ButtonConfigDefaults;
  presets: Record<string, ButtonPreset>;
  setDefaults: (defaults: Partial<ButtonConfigDefaults>) => void;
  addPreset: (key: string, preset: ButtonPreset) => void;
  removePreset: (key: string) => void;
  getPreset: (key: string) => ButtonPreset | undefined;
}

// Crea e esporta il context
export const ButtonConfigContext = createContext<ButtonConfigContextType | undefined>(undefined);

interface ButtonConfigProviderProps {
  children: ReactNode;
  initialDefaults?: Partial<ButtonConfigDefaults>;
  initialPresets?: Record<string, ButtonPreset>;
}

export const ButtonConfigProvider: React.FC<ButtonConfigProviderProps> = ({
                                                                            children,
                                                                            initialDefaults = {},
                                                                            initialPresets = {},
                                                                          }) => {
  const [defaults, setDefaultsState] = useState<ButtonConfigDefaults>({
    variant: 'primary',
    size: 'md',
    iconPosition: 'left',
    ...initialDefaults,
  });

  const [presets, setPresets] = useState<Record<string, ButtonPreset>>({
    ...defaultPresets,
    ...initialPresets,
  });

  const setDefaults = (newDefaults: Partial<ButtonConfigDefaults>) => {
    setDefaultsState(prev => ({ ...prev, ...newDefaults }));
  };

  const addPreset = (key: string, preset: ButtonPreset) => {
    setPresets(prev => ({ ...prev, [key]: preset }));
  };

  const removePreset = (key: string) => {
    setPresets(prev => {
      const newPresets = { ...prev };
      delete newPresets[key];
      return newPresets;
    });
  };

  const getPreset = (key: string) => presets[key];

  return (
    <ButtonConfigContext.Provider
      value={{
        defaults,
        presets,
        setDefaults,
        addPreset,
        removePreset,
        getPreset,
      }}
    >
      {children}
    </ButtonConfigContext.Provider>
  );
};

// Hook personalizzato per usare il context
export const useButtonConfigContext = (): ButtonConfigContextType => {
  const context = useContext(ButtonConfigContext);

  if (context === undefined) {
    throw new Error('useButtonConfigContext deve essere usato all\'interno di ButtonConfigProvider');
  }

  return context;
};