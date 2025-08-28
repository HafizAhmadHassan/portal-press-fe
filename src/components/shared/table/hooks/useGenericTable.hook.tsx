import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  TableConfig,
  TableColumn,
  FilterDef,
  SortDirection,
} from "../types/GenericTable.types";

// ---------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------
function getValueFromKey<T>(item: T, key: keyof T | string): unknown {
  if (typeof key === "string") {
    const rec = item as unknown as Record<string, unknown>;
    return rec[key];
  }
  const rec = item as unknown as Record<keyof T, unknown>;
  return rec[key];
}

function getItemId<T, Id extends PropertyKey>(
  item: T,
  idField: keyof T | undefined
): Id | undefined {
  if (!idField) return undefined as unknown as Id;
  const rec = item as unknown as Record<PropertyKey, unknown>;
  return rec[idField as unknown as PropertyKey] as Id;
}

function compare(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  // Date
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();

  // Number-like
  if (typeof a === "number" && typeof b === "number") return a - b;

  // Boolean
  if (typeof a === "boolean" && typeof b === "boolean")
    return Number(a) - Number(b);

  // BigInt (fallback to string compare to avoid throws)
  if (typeof a === "bigint" && typeof b === "bigint")
    return a === b ? 0 : a > b ? 1 : -1;

  const as = String(a).toLowerCase();
  const bs = String(b).toLowerCase();
  if (as < bs) return -1;
  if (as > bs) return 1;
  return 0;
}

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------
export type UseGenericTableParams<
  T,
  K extends keyof T | string = keyof T | string,
  Id extends PropertyKey = PropertyKey
> = {
  config: TableConfig<T, K, Id>;
  searchFields?: Array<Extract<keyof T, string>>;
  searchValue?: string;
  customFilters?: Array<FilterDef<T>>;
  onDataChange?: (filteredData: T[]) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
};

export type SortState<K extends PropertyKey> = {
  key: K;
  direction: SortDirection;
} | null;

export type UseGenericTableReturn<
  T,
  K extends keyof T | string = keyof T | string,
  Id extends PropertyKey = PropertyKey
> = {
  currentPage: number;
  sortConfig: SortState<K>;
  selectedItems: Id[];
  filteredData: T[];
  sortedData: T[];
  paginatedData: T[];
  totalPages: number;
  handleSort: (key: K) => void;
  handlePageChange: (page: number) => void;
  handleSelectAll: (checked: boolean) => void;
  handleSelectItem: (item: T, checked: boolean) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Id[]>>;
};

// ---------------------------------------------------------------
// Hook
// ---------------------------------------------------------------
export function useGenericTable<
  T,
  K extends keyof T | string = keyof T | string,
  Id extends PropertyKey = PropertyKey
>(params: UseGenericTableParams<T, K, Id>): UseGenericTableReturn<T, K, Id> {
  const {
    config,
    searchFields = [],
    searchValue = "",
    customFilters = [],
    onDataChange,
    onSelectionChange,
  } = params;

  const [currentPage, setCurrentPage] = useState<number>(
    config.pagination?.currentPage ?? 1
  );
  const [sortConfig, setSortConfig] = useState<SortState<K>>(
    config.sorting?.defaultSort ?? (null as SortState<K>)
  );
  const [selectedItems, setSelectedItems] = useState<Id[]>(
    config.selection?.selectedItems ?? ([] as Id[])
  );

  // Debugs (facoltativi): commentali in produzione
  // useEffect(() => { console.log('currentPage changed to:', currentPage); }, [currentPage]);
  // useEffect(() => { console.log('config changed, config.pagination?.currentPage:', config.pagination?.currentPage); }, [config]);

  const filteredData: T[] = useMemo(() => {
    let result = [...(config.data as T[])];

    // Search filter (solo su campi stringa)
    if (searchValue && searchFields.length > 0) {
      const searchLower = searchValue.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const v = (item as unknown as Record<PropertyKey, unknown>)[
            field as PropertyKey
          ];
          return typeof v === "string" && v.toLowerCase().includes(searchLower);
        })
      );
    }

    // Custom filters
    customFilters.forEach((filter) => {
      if (filter.value !== "" && filter.value != null) {
        result = result.filter((item) => {
          const fieldValue = (item as unknown as Record<PropertyKey, unknown>)[
            filter.field as unknown as PropertyKey
          ] as unknown;
          switch (filter.operator) {
            case "equals":
              return fieldValue === filter.value;
            case "includes":
              return String(fieldValue ?? "")
                .toLowerCase()
                .includes(String(filter.value).toLowerCase());
            case "startsWith":
              return String(fieldValue ?? "")
                .toLowerCase()
                .startsWith(String(filter.value).toLowerCase());
            case "custom":
              return filter.customFilter
                ? filter.customFilter(item, filter.value as never)
                : true;
            default:
              return (
                String(fieldValue ?? "").toLowerCase() ===
                String(filter.value).toLowerCase()
              );
          }
        });
      }
    });

    return result;
  }, [config.data, searchValue, searchFields, customFilters]);

  const sortedData: T[] = useMemo(() => {
    if (!sortConfig || !config.sorting?.enabled) return filteredData;

    return [...filteredData].sort((a, b) => {
      const column = (config.columns as Array<TableColumn<T, K>>).find(
        (col) => col.key === sortConfig.key
      );
      if (!column) return 0;

      const aValue =
        "accessor" in column && typeof column.accessor === "function"
          ? column.accessor(a)
          : getValueFromKey(a, sortConfig.key);
      const bValue =
        "accessor" in column && typeof column.accessor === "function"
          ? column.accessor(b)
          : getValueFromKey(b, sortConfig.key);

      const base = compare(aValue, bValue);
      return sortConfig.direction === "asc" ? base : -base;
    });
  }, [filteredData, sortConfig, config.columns, config.sorting?.enabled]);

  const paginatedData: T[] = useMemo(() => {
    if (!config.pagination?.enabled) return sortedData;
    const pageSize = config.pagination.pageSize ?? 10;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, config.pagination]);

  const handleSort = useCallback(
    (key: K) => {
      if (!config.sorting?.enabled) return;
      const nextDirection: SortDirection =
        sortConfig && sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc";
      const newConfig: NonNullable<SortState<K>> = {
        key,
        direction: nextDirection,
      };
      setSortConfig(newConfig);
      config.sorting.onSort?.(key, nextDirection);
    },
    [sortConfig, config.sorting]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      config.pagination?.onPageChange?.(page);
    },
    [config.pagination]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (!config.selection?.enabled) return;
      const idField = config.selection.idField ?? ("id" as keyof T);
      const newSelected: Id[] = checked
        ? paginatedData.map((item) => getItemId<T, Id>(item, idField) as Id)
        : [];
      setSelectedItems(newSelected);
      const selectedObjs: T[] = checked ? paginatedData : [];
      onSelectionChange?.(selectedObjs);
      config.selection.onSelectionChange?.(newSelected);
    },
    [paginatedData, config.selection, onSelectionChange]
  );

  const handleSelectItem = useCallback(
    (item: T, checked: boolean) => {
      if (!config.selection?.enabled) return;
      const idField = config.selection.idField ?? ("id" as keyof T);
      const itemId = getItemId<T, Id>(item, idField) as Id;
      const newSelected: Id[] = checked
        ? [...selectedItems, itemId]
        : selectedItems.filter((id) => id !== itemId);

      setSelectedItems(newSelected);

      const selectedObjects: T[] = newSelected
        .map((id) =>
          (config.data as T[]).find(
            (itm) => getItemId<T, Id>(itm, idField) === id
          )
        )
        .filter((x): x is T => Boolean(x));

      onSelectionChange?.(selectedObjects);
      config.selection.onSelectionChange?.(newSelected);
    },
    [selectedItems, config.data, config.selection, onSelectionChange]
  );

  // Reset page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, JSON.stringify(customFilters)]);

  // Reset page if current page exceeds total pages
  useEffect(() => {
    const totalItems = config.pagination?.totalItems ?? filteredData.length;
    const pageSize = config.pagination?.pageSize ?? 10;
    const totalPagesCount = Math.max(1, Math.ceil(totalItems / pageSize));
    if (currentPage > totalPagesCount) {
      setCurrentPage(1);
    }
  }, [filteredData.length, config.pagination]);

  // Notify filtered data changes
  useEffect(() => {
    onDataChange?.(filteredData);
  }, [filteredData, onDataChange]);

  const totalPages = useMemo(() => {
    const totalItems = config.pagination?.totalItems ?? filteredData.length;
    const pageSize = config.pagination?.pageSize ?? 10;
    return Math.max(1, Math.ceil(totalItems / pageSize));
  }, [filteredData.length, config.pagination]);

  return {
    currentPage,
    sortConfig,
    selectedItems,
    filteredData,
    sortedData,
    paginatedData,
    totalPages,
    handleSort,
    handlePageChange,
    handleSelectAll,
    handleSelectItem,
    setCurrentPage,
    setSelectedItems,
  };
}

export default useGenericTable;
