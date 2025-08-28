import { useAppDispatch, useAppSelector } from "@store_admin/store.hooks";
import {
  closeAllCollapses,
  closeCollapse,
  openCollapse,
  registerCollapse,
  resetCollapseState,
  setActiveGroup,
  toggleCollapse,
  unregisterCollapse,
} from "@store_admin/ui/collapse/collapse.slice";
import {
  selectActiveGroup,
  selectCollapseById,
  selectCollapseError,
  selectCollapseLoading,
  selectIsCollapseOpen,
  selectOpenCollapses,
} from "@store_admin/ui/collapse/collapse.selectors";

export const useCollapse = (id?: number) => {
  const dispatch = useAppDispatch();

  // Stato specifico per ID
  const collapseItem = useAppSelector(id ? selectCollapseById(id) : () => null);
  const isCollapseOpen = useAppSelector(
    id ? selectIsCollapseOpen(id) : () => false
  );

  // Stato globale
  const openCollapses = useAppSelector(selectOpenCollapses);
  const activeGroup = useAppSelector(selectActiveGroup);
  const isLoading = useAppSelector(selectCollapseLoading);
  const error = useAppSelector(selectCollapseError);

  return {
    // Stato
    collapseItem,
    isCollapseOpen,
    openCollapses,
    activeGroup,
    isLoading,
    error,

    // Azioni specifiche per l'ID (se fornito)
    register: (autoClose = false) => {
      if (id) dispatch(registerCollapse({ id, autoClose }));
    },
    unregister: () => {
      if (id) dispatch(unregisterCollapse(id));
    },
    toggle: () => {
      if (id) dispatch(toggleCollapse(id));
    },
    open: () => {
      if (id) dispatch(openCollapse(id));
    },
    close: () => {
      if (id) dispatch(closeCollapse(id));
    },

    // Azioni globali
    closeAll: () => dispatch(closeAllCollapses()),
    setActiveGroup: (group: string) => dispatch(setActiveGroup(group)),
    resetState: () => dispatch(resetCollapseState()),

    // Azioni per ID dinamici
    toggleById: (collapseid: number) => dispatch(toggleCollapse(collapseid)),
    openById: (collapseid: number) => dispatch(openCollapse(collapseid)),
    closeById: (collapseid: number) => dispatch(closeCollapse(collapseid)),
  };
};
