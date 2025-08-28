import type {
  TableColumn,
  TableConfig,
} from "@components/shared/table/types/GenericTable.types";
import type { ApiMeta } from "@root/utils/genericApi";

import { useMemo } from "react";

// Aggiornato per supportare chiavi generiche K
interface CreateTableConfigOptions<
  T,
  K extends keyof T | string = keyof T | string
> {
  data: T[];
  columns: TableColumn<T, K>[];
  apiMeta?: ApiMeta | null;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSort?: (key: K, direction: "asc" | "desc") => void;

  onSelectionChange?: (selectedItems: PropertyKey[]) => void;

  enablePagination?: boolean;
  enableSorting?: boolean;
  enableSelection?: boolean;
  idField?: keyof T;
}

function toPageNumber(v: unknown): number | null {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const m = v.match(/[?&]page=(\d+)/);
    if (m) return Number(m[1]);
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

// Funzione principale aggiornata con tipizzazione generica
export function createTableConfig<
  T,
  K extends keyof T | string = keyof T | string
>({
  data,
  columns,
  apiMeta,
  loading = false,
  emptyMessage = "Nessun elemento trovato",
  className,
  onPageChange,
  onPageSizeChange,
  onSort,
  onSelectionChange,
  enablePagination = true,
  enableSorting = true,
  enableSelection = false,
  idField = "id" as keyof T,
}: CreateTableConfigOptions<T, K>): TableConfig<T, K> {
  const config: TableConfig<T, K> = {
    columns,
    data,
    loading,
    emptyMessage,
    className,
  };

  if (enablePagination && apiMeta) {
    const nextRaw =
      (apiMeta as unknown as { next_page?: unknown }).next_page ?? null;
    const prevRaw =
      (apiMeta as unknown as { prev_page?: unknown }).prev_page ?? null;

    config.pagination = {
      enabled: true,
      currentPage: apiMeta.page,
      pageSize: apiMeta.page_size,
      totalItems: apiMeta.total,
      totalPages: apiMeta.total_pages,
      onPageChange,
      hasNext: apiMeta.has_next,
      hasPrev: apiMeta.has_prev,
      nextPage: toPageNumber(nextRaw),
      prevPage: toPageNumber(prevRaw),
    };

    if (onPageSizeChange) {
      config.pagination.onPageSizeChange = onPageSizeChange;
    }
  }

  if (enableSorting) {
    config.sorting = {
      enabled: true,
      onSort,
    };
  }

  if (enableSelection) {
    config.selection = {
      enabled: true,
      selectedItems: [] as PropertyKey[],
      idField,
      onSelectionChange,
    };
  }

  return config;
}

// Hook aggiornato con tipizzazione generica
export function useApiTableConfig<
  T,
  K extends keyof T | string = keyof T | string
>(
  data: T[],
  columns: TableColumn<T, K>[],
  apiMeta: ApiMeta | null,
  options: Partial<CreateTableConfigOptions<T, K>> = {}
) {
  return useMemo(() => {
    return createTableConfig<T, K>({
      data,
      columns,
      apiMeta,
      ...options,
    });
  }, [data, columns, apiMeta, options]);
}
