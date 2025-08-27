import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";

export const selectCollapseState = (state: RootState) => state.ui.collapse;
export const selectCollapseItems = (state: RootState) =>
  state.ui.collapse.items;
export const selectActiveGroup = (state: RootState) =>
  state.ui.collapse.activeGroup;
export const selectCollapseLoading = (state: RootState) =>
  state.ui.collapse.isLoading;
export const selectCollapseError = (state: RootState) =>
  state.ui.collapse.error;

export const selectCollapseById = (id: string) => (state: RootState) =>
  state.ui.collapse.items[id];

export const selectIsCollapseOpen = (id: string) => (state: RootState) =>
  state.ui.collapse.items[id]?.isOpen || false;

export const selectOpenCollapses = createSelector(
  [selectCollapseItems],
  (items) => {
    const openItems = Object.values(items).filter((item) => item?.isOpen);
    return {
      items: openItems,
      count: openItems.length,
      ids: openItems.map((item) => item?.id),
    };
  }
);

export const selectCollapseStats = createSelector(
  [selectCollapseItems],
  (items) => {
    const itemsArray = Object.values(items);
    const open = itemsArray.filter((item) => item?.isOpen);
    const autoClose = itemsArray.filter((item) => item?.autoClose);

    return {
      total: itemsArray.length,
      open: open.length,
      closed: itemsArray.length - open.length,
      autoClose: autoClose.length,
      openPercentage:
        itemsArray.length > 0 ? (open.length / itemsArray.length) * 100 : 0,
      hasAnyOpen: open.length > 0,
      hasAutoClose: autoClose.length > 0,
    };
  }
);

export const selectCollapseStatus = createSelector(
  [selectCollapseLoading, selectCollapseError],
  (isLoading, error) => ({
    isLoading,
    error,

    hasError: !!error,
    isReady: !isLoading && !error,
    canInteract: !isLoading,
  })
);
