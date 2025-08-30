// hooks/useListController.ts - Versione integrata con pagination corretta
import { useCallback, useMemo, useState, useEffect } from "react";
import { usePagination } from "@hooks/usePagination";
import type { ApiMeta } from "@store_admin/api.types";

interface ListControllerConfig<TQueryParams, TItem> {
  listHook: (params: any) => any;
  initialFilters: Partial<TQueryParams>;
  initialSort?: { sortBy: string; sortOrder: "asc" | "desc" };
  additionalParams?: Record<string, any>;
}

export function useListController<TQueryParams, TItem>({
  listHook,
  initialFilters,
  initialSort,
  additionalParams,
}: ListControllerConfig<TQueryParams, TItem>) {
  const [filters, setFiltersState] =
    useState<Partial<TQueryParams>>(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortBy, setSortBy] = useState(initialSort?.sortBy || "id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    initialSort?.sortOrder || "desc"
  );

  // Costruisci i parametri della query
  const queryParams = useMemo(() => {
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    return {
      ...cleanFilters,
      ...additionalParams,
      page,
      page_size: pageSize,
      sortBy,
      sortOrder,
    };
  }, [filters, additionalParams, page, pageSize, sortBy, sortOrder]);

  console.log("useListController - Query params:", queryParams);

  // Usa l'hook di lista - RTK Query hooks accettano solo queryParams come primo parametro
  const {
    data: response,
    isLoading,
    error,
    refetch,
    isFetching,
  } = listHook(queryParams);

  // Estrai items e meta dalla response
  const items = response?.data || response || [];
  const meta: ApiMeta | null = response?.meta || null;

  console.log("useListController - Response:", {
    itemsCount: items.length,
    meta,
    isLoading,
    isFetching,
  });

  // Usa usePagination per gestire la paginazione correttamente
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: pageSize,
    apiMeta: meta ?? undefined,
    onChange: (newPage, newSize) => {
      setPage(newPage);
      setPageSize(newSize);
    },
  });

  // Enhanced setFilter con auto-reset page
  const setFilter = useCallback(
    (key: string, value: any) => {
      console.log("useListController - Setting filter:", key, "=", value);

      setFiltersState((prev) => ({
        ...prev,
        [key]: value,
      }));

      // Reset alla pagina 1 quando cambia un filtro
      if (page !== 1) {
        setPage(1);
        pagination.setPage(1);
      }
    },
    [page, pagination]
  );

  // Enhanced reset con callback
  const resetAll = useCallback(() => {
    console.log("useListController - Resetting all filters");
    setFiltersState(initialFilters);
    setPage(1);
    setSortBy(initialSort?.sortBy || "id");
    setSortOrder(initialSort?.sortOrder || "desc");
    pagination.resetPagination();
  }, [initialFilters, initialSort, pagination]);

  // Enhanced refetch
  const enhancedRefetch = useCallback(() => {
    console.log("useListController - Force refetching");
    return refetch();
  }, [refetch]);

  // Set sort con logging
  const setSort = useCallback(
    (newSortBy: string, newSortOrder: "asc" | "desc") => {
      console.log("useListController - Setting sort:", newSortBy, newSortOrder);
      setSortBy(newSortBy);
      setSortOrder(newSortOrder);
    },
    []
  );

  // Build table config helper - Usa la struttura corretta per la paginazione
  const buildTableConfig = useCallback(
    (columns: any, additionalConfig: any = {}) => {
      const paginationConfig = pagination.getTablePaginationConfig();

      console.log("useListController - Building table config:", {
        itemsCount: items.length,
        paginationConfig,
      });

      return {
        columns,
        data: items,
        pagination: {
          enabled: true,
          currentPage: paginationConfig.currentPage,
          pageSize: paginationConfig.pageSize,
          totalItems: paginationConfig.totalItems,
          totalPages: paginationConfig.totalPages,
          hasNext: paginationConfig.hasNext,
          hasPrev: paginationConfig.hasPrev,
          nextPage: paginationConfig.nextPage,
          prevPage: paginationConfig.prevPage,
          onPageChange: paginationConfig.onPageChange,
          onPageSizeChange: paginationConfig.onPageSizeChange,
        },
        sorting: {
          sortBy,
          sortOrder,
          onSort: setSort,
        },
        loading: isLoading || isFetching,
        ...additionalConfig,
      };
    },
    [items, pagination, sortBy, sortOrder, isLoading, isFetching, setSort]
  );

  // Log changes per debug
  useEffect(() => {
    console.log("useListController - State changed:", {
      filtersActive: Object.values(filters).filter((v) => v).length,
      page,
      pageSize,
      sortBy,
      sortOrder,
      paginationState: {
        currentPage: pagination.page,
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages,
      },
    });
  }, [filters, page, pageSize, sortBy, sortOrder, pagination]);

  return {
    // Data
    items,
    meta,

    // Loading states
    isLoading: isLoading || isFetching,
    error,

    // Actions
    refetch: enhancedRefetch,

    // Filters
    filters,
    setFilter,
    resetAll,

    // Pagination (mantieni compatibilità con la versione precedente)
    page: pagination.page,
    setPage: pagination.setPage,
    pageSize: pagination.pageSize,
    setPageSize: pagination.setPageSize,

    // Sorting
    sortBy,
    sortOrder,
    setSort,

    // Oggetto paginazione completo (come nella versione moderna)
    pagination,

    // Helpers
    buildTableConfig,
    queryParams,
  };
}
