import { useCallback, useState } from 'react';

type ViewType = 'cards' | 'table' | 'map';

export function useDevicesListView(initialView: ViewType = 'cards') {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);

  /**
   * Cambia la vista tra 'cards' e 'table'
   */
  const toggleCardsTable = useCallback(() => {
    setCurrentView((v) => (v === 'cards' ? 'table' : 'cards'));
  }, []);

  /**
   * Cambia la vista tra 'map' e l'ultima vista non mappa (
   * se ero su mappa torno su 'cards')
   */
  const toggleMap = useCallback(() => {
    setCurrentView((v) => (v === 'map' ? 'cards' : 'map'));
  }, []);

  return {
    currentView,
    isCards: currentView === 'cards',
    isTable: currentView === 'table',
    isMap: currentView === 'map',
    toggleCardsTable,
    toggleMap,
    setView: setCurrentView,
  };
}
