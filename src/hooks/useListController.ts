// hooks/useListController.ts - Enhanced version
import { useCallback, useMemo, useState, useEffect } from "react";

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

  // Usa l'hook di lista con refetchOnMountOrArgChange per force refresh
  const {
    data: response,
    isLoading,
    error,
    refetch,
    isFetching,
  } = listHook(queryParams, {
    refetchOnMountOrArgChange: true, // Force refetch quando cambiano i parametri
    refetchOnFocus: false, // Non refetch quando si torna alla finestra
    refetchOnReconnect: true, // Refetch se la connessione si riconnette
  });

  // Estrai items e meta dalla response
  const items = response?.data || response || [];
  const meta = response?.meta || {
    page: 1,
    page_size: items.length,
    total: items.length,
    total_pages: 1,
    has_next: false,
    has_prev: false,
  };

  console.log("useListController - Response:", {
    itemsCount: items.length,
    meta,
    isLoading,
    isFetching,
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
      }
    },
    [page]
  );

  // Enhanced reset con callback
  const resetAll = useCallback(() => {
    console.log("useListController - Resetting all filters");
    setFiltersState(initialFilters);
    setPage(1);
    setSortBy(initialSort?.sortBy || "id");
    setSortOrder(initialSort?.sortOrder || "desc");
  }, [initialFilters, initialSort]);

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

  // Build table config helper
  const buildTableConfig = useCallback(
    (columns: any, additionalConfig: any = {}) => {
      return {
        columns,
        data: items,
        pagination: {
          page,
          pageSize,
          total: meta.total,
          totalPages: meta.total_pages,
          hasNext: meta.has_next,
          hasPrev: meta.has_prev,
          onPageChange: setPage,
          onPageSizeChange: (newSize: number) => {
            setPageSize(newSize);
            setPage(1);
          },
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
    [
      items,
      meta,
      page,
      pageSize,
      sortBy,
      sortOrder,
      isLoading,
      isFetching,
      setSort,
    ]
  );

  // Log changes per debug
  useEffect(() => {
    console.log("useListController - State changed:", {
      filtersActive: Object.values(filters).filter((v) => v).length,
      page,
      pageSize,
      sortBy,
      sortOrder,
    });
  }, [filters, page, pageSize, sortBy, sortOrder]);

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

    // Pagination
    page,
    setPage,
    pageSize,
    setPageSize,

    // Sorting
    sortBy,
    sortOrder,
    setSort,

    // Helpers
    buildTableConfig,
    queryParams,
  };
}
