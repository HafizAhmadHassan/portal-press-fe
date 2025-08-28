// useListController.ts - VERSIONE CORRETTA SENZA LOOP INFINITO
import { useCallback, useMemo, useState } from "react";
import { usePagination } from "@hooks/usePagination";
import type {
  TableColumn,
  TableConfig,
} from "@components/shared/table/types/GenericTable.types";
import type { ApiMeta, ApiResponse } from "@store_admin/api.types";
import { createTableConfig } from "@root/components/shared/table/helper/TableConfigHelper";

type SortOrder = "asc" | "desc";

/** Firma generica degli hook RTK Query per le liste */
export type ListHook<P, T> = (
  params: P,
  options?: { refetchOnMountOrArgChange?: boolean }
) => {
  data?: ApiResponse<T>;
  isLoading: boolean;
  isFetching: boolean;
  error?: unknown;
  refetch: () => unknown;
};

export interface UseListControllerOptions<P extends object, T> {
  listHook: ListHook<P, T>;
  initialFilters?: Record<string, string | number | boolean | null | undefined>;
  initialPage?: number;
  initialPageSize?: number;
  initialSort?: { sortBy?: string; sortOrder?: SortOrder };
  staticParams?: Partial<P>;
  refetchOnMountOrArgChange?: boolean;
}

export function useListController<P extends object, T>({
  listHook,
  initialFilters = {},
  initialPage = 1,
  initialPageSize = 10,
  initialSort = { sortBy: "date_joined", sortOrder: "desc" },
  staticParams = {},
  refetchOnMountOrArgChange = true,
}: UseListControllerOptions<P, T>) {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [sortBy, setSortBy] = useState(initialSort.sortBy ?? "date_joined");
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialSort.sortOrder ?? "desc"
  );

  const queryParams = useMemo(
    () =>
      ({
        ...staticParams,
        ...filters,
        sortBy,
        sortOrder,
        page,
        page_size: pageSize,
      } as P),
    [filters, sortBy, sortOrder, page, pageSize, staticParams]
  );

  const { data, isLoading, isFetching, error, refetch } = listHook(
    queryParams,
    {
      refetchOnMountOrArgChange,
    }
  );

  const items = useMemo<T[]>(() => data?.data ?? [], [data]);
  const meta = useMemo<ApiMeta | null>(() => data?.meta ?? null, [data]);

  const pagination = usePagination({
    initialPage,
    initialPageSize,
    apiMeta: meta ?? undefined,
    onChange: (newPage, newSize) => {
      setPage(newPage);
      setPageSize(newSize);
    },
  });

  const setFilter = useCallback(
    (key: string, value: string | number | boolean | null | undefined) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
      setPage(1);
    },
    []
  );

  // PROBLEMA RISOLTO: Rimossa dipendenza instabile da pagination
  const resetAll = useCallback(() => {
    setFilters(initialFilters);
    setSortBy(initialSort.sortBy ?? "date_joined");
    setSortOrder(initialSort.sortOrder ?? "desc");
    setPage(initialPage); // Usa direttamente initialPage invece di pagination.resetPagination()
    setPageSize(initialPageSize); // Usa direttamente initialPageSize
  }, [initialFilters, initialSort, initialPage, initialPageSize]);

  const setSort = useCallback((key: string, order: SortOrder) => {
    setSortBy(key);
    setSortOrder(order);
  }, []);

  // PROBLEMA RISOLTO: Dipendenze stabili per buildTableConfig
  const buildTableConfig = useCallback(
    <K extends keyof T | string = keyof T | string>(
      columns: TableColumn<T, K>[],
      extra?: Partial<Omit<TableConfig<T, K>, "columns" | "data">>
    ): TableConfig<T, K> => {
      return createTableConfig<T, K>({
        data: items,
        columns,
        apiMeta: meta ?? undefined,
        loading: isLoading || isFetching,
        onPageChange: setPage, // Usa direttamente setPage invece di pagination.setPage
        onPageSizeChange: setPageSize, // Usa direttamente setPageSize
        onSort: (key, direction) =>
          setSort(String(key), direction as SortOrder),
        enablePagination: true,
        enableSorting: true,
        enableSelection: false,
        ...(extra ?? {}),
      });
    },
    [
      items,
      meta,
      isLoading,
      isFetching,
      setPage, // Dipendenza stabile
      setPageSize, // Dipendenza stabile
      setSort,
    ]
  );

  return {
    // dati
    items,
    meta,
    isLoading: isLoading || isFetching,
    error,
    refetch,

    // stato lista
    page,
    pageSize,
    sortBy,
    sortOrder,
    filters,

    // azioni - usa direttamente le funzioni di stato invece di pagination
    setPage,
    setPageSize,
    setSort,
    setFilter,
    resetAll,

    // oggetto paginazione per compatibilità (se serve)
    pagination,

    // builder per la table config
    buildTableConfig,
  } as const;
}
