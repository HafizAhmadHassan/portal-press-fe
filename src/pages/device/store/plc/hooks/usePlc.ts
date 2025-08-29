// @store_device/plc/hooks/usePlc.ts
import { useCallback, useMemo } from "react";

import {
  loadPlc,
  createNewPlc,
  updateExistingPlc,
  deleteExistingPlc,
  performBulkPlc,
  refreshPlcData,
} from "../plc.actions";
import {
  selectAllPlc,
  selectPlcLoading,
  selectPlcError,
  selectPlcPagination,
  selectPlcFilters,
  selectPlcItemById,
} from "../plc.selectors";
import {
  setFilters,
  resetFilters,
  setPagination,
  setSelected,
  clearError,
} from "../plc.slice";
import type { PlcQueryParams, PlcFilters, PlcItem } from "../plc.types";
import {
  useAppDispatch,
  useAppSelector,
} from "@root/pages/admin/core/store/store.hooks";

/**
 * Hook principale per la gestione dei PLC
 * Fornisce tutti i metodi e lo stato necessari per lavorare con i PLC
 */
export const usePlc = () => {
  const dispatch = useAppDispatch();

  // Selettori stato
  const items = useAppSelector(selectAllPlc);
  const isLoading = useAppSelector(selectPlcLoading);
  const error = useAppSelector(selectPlcError);
  const pagination = useAppSelector(selectPlcPagination);
  const filters = useAppSelector(selectPlcFilters);

  // Actions wrapped in useCallback per performance
  const actions = useMemo(
    () => ({
      // Caricamento dati
      load: (params?: PlcQueryParams) => dispatch(loadPlc(params)),
      refresh: () => dispatch(refreshPlcData()),

      // CRUD operations
      create: (data: Partial<PlcItem>) => dispatch(createNewPlc(data)),
      update: (id: number, data: Partial<PlcItem>) =>
        dispatch(updateExistingPlc({ id, data })),
      delete: (id: number) => dispatch(deleteExistingPlc(id)),
      bulkOperation: (request: any) => dispatch(performBulkPlc(request)),

      // Gestione filtri
      setFilters: (newFilters: Partial<PlcFilters>) =>
        dispatch(setFilters(newFilters)),
      resetFilters: () => dispatch(resetFilters()),

      // Gestione paginazione
      setPagination: (newPagination: any) =>
        dispatch(setPagination(newPagination)),

      // Gestione selezione
      setSelected: (item: PlcItem | null) => dispatch(setSelected(item)),

      // Gestione errori
      clearError: () => dispatch(clearError()),
    }),
    [dispatch]
  );

  // Metodi di utilità
  const utils = useMemo(
    () => ({
      // Filtra items localmente (per ricerche immediate)
      filterItems: (searchTerm: string) =>
        items.filter((item) =>
          Object.values(item.plc_data).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
          )
        ),

      // Trova item per ID in uno qualsiasi dei 3 blocchi
      findItemById: (id: number) =>
        items.find(
          (item) =>
            item.plc_data.id === id ||
            item.plc_io.id === id ||
            item.plc_status.id === id
        ),

      // Statistiche rapide
      getStats: () => ({
        total: items.length,
        // Aggiungi altre statistiche se necessarie
      }),
    }),
    [items]
  );

  return {
    // Stato
    items,
    isLoading,
    error,
    pagination,
    filters,

    // Actions
    ...actions,

    // Utilities
    ...utils,
  };
};

/**
 * Hook specifico per ottenere un singolo PLC per ID
 */
export const usePlcById = (id: number) => {
  const dispatch = useAppDispatch();
  const item = useAppSelector((state) => selectPlcItemById(state, id));
  const isLoading = useAppSelector(selectPlcLoading);
  const error = useAppSelector(selectPlcError);

  const actions = useMemo(
    () => ({
      update: (data: Partial<PlcItem>) =>
        dispatch(updateExistingPlc({ id, data })),
      delete: () => dispatch(deleteExistingPlc(id)),
      refresh: () => dispatch(loadPlc()),
    }),
    [dispatch, id]
  );

  return {
    item,
    isLoading,
    error,
    ...actions,
  };
};

/**
 * Hook per la ricerca PLC
 */
export const usePlcSearch = () => {
  const { items, setFilters, filters } = usePlc();

  const search = useCallback(
    (query: string) => {
      setFilters({ search: query });
    },
    [setFilters]
  );

  const filteredItems = useMemo(() => {
    if (!filters.search) return items;

    return items.filter((item) => {
      const searchTerm = filters.search.toLowerCase();

      // Cerca in tutti i campi dei 3 blocchi
      const searchInObject = (obj: Record<string, any>) =>
        Object.values(obj).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        );

      return (
        searchInObject(item.plc_data) ||
        searchInObject(item.plc_io) ||
        searchInObject(item.plc_status)
      );
    });
  }, [items, filters.search]);

  return {
    filteredItems,
    search,
    searchTerm: filters.search,
    isSearching: filters.search.length > 0,
  };
};
