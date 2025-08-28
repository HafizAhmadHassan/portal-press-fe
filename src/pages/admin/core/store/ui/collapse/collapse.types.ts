export interface CollapseItem {
  id: number;
  isOpen: boolean;
  autoClose?: boolean; // Se true, chiude automaticamente altri collapse
}

export interface CollapseState {
  items: Record<string, CollapseItem>;
  activeGroup?: string; // Per gestire gruppi di collapse
}
