import { useCallback, useMemo, useState } from "react";
import type { TablePagination } from "@components/shared/table/types/GenericTable.types";
import type { ApiMeta } from "@store_admin/api.types";

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  apiMeta?: ApiMeta | null;
  totalItems?: number;
  totalPages?: number;
  onChange?: (page: number, pageSize: number) => void;
}

interface PaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
  nextPage: number | null;
  prevPage: number | null;
  setPage: (newPage: number) => void;
  setPageSize: (newSize: number) => void;
  resetPagination: () => void;
  getTablePaginationConfig: () => TablePagination;
}

export const usePagination = ({
  initialPage = 1,
  initialPageSize = 10,
  apiMeta,
  totalItems,
  totalPages,
  onChange,
}: UsePaginationOptions = {}): PaginationReturn => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const paginationData = useMemo(() => {
    if (apiMeta) {
      return {
        currentPage: apiMeta.page,
        totalPages: apiMeta.total_pages,
        totalItems: apiMeta.total,
        pageSize: apiMeta.page_size,
        hasNext: apiMeta.has_next,
        hasPrev: apiMeta.has_prev,
        nextPage: apiMeta.next_page,
        prevPage: apiMeta.prev_page,
      };
    }

    const computedTotalPages =
      totalPages ?? (totalItems ? Math.ceil(totalItems / pageSize) : 1);

    return {
      currentPage: page,
      totalPages: computedTotalPages,
      totalItems: totalItems ?? 0,
      pageSize,
      hasNext: page < computedTotalPages,
      hasPrev: page > 1,
      nextPage: page < computedTotalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }, [apiMeta, totalItems, totalPages, page, pageSize]);

  const goToPage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      onChange?.(newPage, pageSize);
    },
    [onChange, pageSize]
  );

  const changePageSize = useCallback(
    (newSize: number) => {
      setPageSize(newSize);
      setPage(1);
      onChange?.(1, newSize);
    },
    [onChange]
  );

  const resetPagination = useCallback(() => {
    setPage(1);
    setPageSize(initialPageSize);
    onChange?.(1, initialPageSize);
  }, [onChange, initialPageSize]);

  const getTablePaginationConfig = useCallback(
    (): TablePagination => ({
      enabled: true,
      currentPage: paginationData.currentPage,
      pageSize: paginationData.pageSize,
      totalPages: paginationData.totalPages,
      totalItems: paginationData.totalItems,
      onPageChange: goToPage,
      onPageSizeChange: changePageSize,
      hasNext: paginationData.hasNext,
      hasPrev: paginationData.hasPrev,
      nextPage: paginationData.nextPage,
      prevPage: paginationData.prevPage,
    }),
    [paginationData, goToPage, changePageSize]
  );

  return {
    page: paginationData.currentPage,
    pageSize: paginationData.pageSize,
    totalPages: paginationData.totalPages,
    totalItems: paginationData.totalItems,
    hasNext: paginationData.hasNext,
    hasPrev: paginationData.hasPrev,
    nextPage: paginationData.nextPage,
    prevPage: paginationData.prevPage,
    setPage: goToPage,
    setPageSize: changePageSize,
    resetPagination,
    getTablePaginationConfig,
  };
};
