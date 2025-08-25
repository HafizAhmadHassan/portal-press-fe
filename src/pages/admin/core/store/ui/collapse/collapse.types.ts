export interface CollapseItem {
  id: string;
  isOpen: boolean;
  autoClose?: boolean; // Se true, chiude automaticamente altri collapse
}

export interface CollapseState {
  items: Record<string, CollapseItem>;
  activeGroup?: string; // Per gestire gruppi di collapse
}