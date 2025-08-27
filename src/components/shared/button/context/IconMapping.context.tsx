import React, {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";
import type { IconMapping } from "../types/Button.types";
import { defaultIconMapping } from "../utils/DefaultIcons.utils";

interface IconMappingContextType {
  icons: IconMapping;
  addIcon: (name: string, icon: React.ReactNode) => void;
  addIcons: (icons: IconMapping) => void;
  removeIcon: (name: string) => void;
  getIcon: (name: string) => React.ReactNode | null;
}

// Crea e esporta il context
export const IconMappingContext = createContext<
  IconMappingContextType | undefined
>(undefined);

// Hook con naming corretto (lowercase) e doppio export per compatibilità
export const useIconMappingContext = () => {
  const context = useContext(IconMappingContext);
  if (!context) {
    // Fallback quando il context non è disponibile
    return {
      icons: defaultIconMapping,
      addIcon: () => {},
      addIcons: () => {},
      removeIcon: () => {},
      getIcon: (name: string) => defaultIconMapping[name] || null,
    };
  }
  return context;
};

// Export alternativo per retrocompatibilità
export const UseIconMappingContext = useIconMappingContext;

interface IconMappingProviderProps {
  children: ReactNode;
  initialIcons?: IconMapping;
}

export const IconMappingProvider: React.FC<IconMappingProviderProps> = ({
  children,
  initialIcons = {},
}) => {
  const [icons, setIcons] = useState<IconMapping>({
    ...defaultIconMapping,
    ...initialIcons,
  });

  const addIcon = (name: string, icon: React.ReactNode) => {
    setIcons((prev) => ({ ...prev, [name]: icon }));
  };

  const addIcons = (newIcons: IconMapping) => {
    setIcons((prev) => ({ ...prev, ...newIcons }));
  };

  const removeIcon = (name: string) => {
    setIcons((prev) => {
      const newIcons = { ...prev };
      delete newIcons[name];
      return newIcons;
    });
  };

  const getIcon = (name: string): React.ReactNode | null => {
    // Try exact match first
    if (icons[name]) {
      return icons[name];
    }

    // Try without 'fa' prefix
    const cleanName = name.replace(/^fa/, "").toLowerCase();
    if (icons[cleanName]) {
      return icons[cleanName];
    }

    return null;
  };

  return (
    <IconMappingContext.Provider
      value={{
        icons,
        addIcon,
        addIcons,
        removeIcon,
        getIcon,
      }}
    >
      {children}
    </IconMappingContext.Provider>
  );
};
