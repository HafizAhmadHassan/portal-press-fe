import { useCallback, useState } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  totalItems?: number;
  totalPages?: number;
  onChange?: (page: number, pageSize: number) => void;
}

export const usePagination = ({
                                initialPage = 1,
                                initialPageSize = 2,
                                totalItems,
                                totalPages,
                                onChange
                              }: UsePaginationOptions = {}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Calcolo totale pagine: preferisco `totalPages` se fornito dall'API
  const computedTotalPages = totalPages ?? (totalItems ? Math.ceil(totalItems / pageSize) : undefined);

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

  return {
    page,
    pageSize,
    totalPages: computedTotalPages,
    setPage: goToPage,
    setPageSize: changePageSize,
    resetPagination,
  };
};
