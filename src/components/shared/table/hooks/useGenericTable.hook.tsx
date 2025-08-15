// useGenericTable.js
import { useCallback, useEffect, useMemo, useState } from 'react';

export const useGenericTable = (
  config,
  searchFields = [],
  searchValue = '',
  customFilters = [],
  onDataChange,
  onSelectionChange
) => {
  const [currentPage, setCurrentPage] = useState(config.pagination?.currentPage || 1);
  const [sortConfig, setSortConfig] = useState(config.sorting?.defaultSort || null);
  const [selectedItems, setSelectedItems] = useState(config.selection?.selectedItems || []);

  // Debug: monitora i cambiamenti della currentPage
  useEffect(() => {
    console.log('currentPage changed to:', currentPage);
  }, [currentPage]);

  // Debug: monitora i cambiamenti del _config
  useEffect(() => {
    console.log(
      '_config changed, _config.pagination?.currentPage:',
      config.pagination?.currentPage
    );
    if (config.pagination?.currentPage && config.pagination.currentPage !== currentPage) {
      console.log('Config is overriding currentPage');
    }
  }, [config]);

  const filteredData = useMemo(() => {
    let result = [...config.data];

    // Apply search filter
    if (searchValue && searchFields.length > 0) {
      const searchLower = searchValue.toLowerCase();
      result = result.filter((item) =>
        searchFields.some((field) => {
          const value = item[field];
          return value?.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply custom filters
    customFilters.forEach((filter) => {
      if (filter.value !== '' && filter.value != null) {
        result = result.filter((item) => {
          const fieldValue = item[filter.field];
          switch (filter.operator) {
            case 'equals':
              return fieldValue === filter.value;
            case 'includes':
              return fieldValue
                ?.toString()
                .toLowerCase()
                .includes(filter.value.toString().toLowerCase());
            case 'startsWith':
              return fieldValue
                ?.toString()
                .toLowerCase()
                .startsWith(filter.value.toString().toLowerCase());
            case 'custom':
              return filter.customFilter ? filter.customFilter(item, filter.value) : true;
            default:
              return fieldValue?.toString().toLowerCase() === filter.value.toString().toLowerCase();
          }
        });
      }
    });

    return result;
  }, [config.data, searchValue, searchFields, customFilters]);

  const sortedData = useMemo(() => {
    if (!sortConfig || !config.sorting?.enabled) return filteredData;

    return [...filteredData].sort((a, b) => {
      const column = config.columns.find((col) => col.key === sortConfig.key);
      if (!column) return 0;

      const aValue = column.accessor ? column.accessor(a) : a[sortConfig.key];
      const bValue = column.accessor ? column.accessor(b) : b[sortConfig.key];

      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle different data types
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return sortConfig.direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      const aStr = aValue.toString().toLowerCase();
      const bStr = bValue.toString().toLowerCase();

      if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, config.columns, config.sorting?.enabled]);

  const paginatedData = useMemo(() => {
    if (!config.pagination?.enabled) return sortedData;
    const pageSize = config.pagination.pageSize || 10;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, config.pagination]);

  const handleSort = useCallback(
    (key) => {
      if (!config.sorting?.enabled) return;
      const direction = sortConfig?.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
      const newConfig = { key, direction };
      setSortConfig(newConfig);
      config.sorting.onSort?.(key, direction);
    },
    [sortConfig, config.sorting]
  );

  const handlePageChange = useCallback(
    (page) => {
      console.log('handlePageChange called with page:', page, 'current page:', currentPage);
      setCurrentPage(page);
      config.pagination?.onPageChange?.(page);
    },
    [config.pagination]
  );

  const handleSelectAll = useCallback(
    (checked) => {
      if (!config.selection?.enabled) return;
      const idField = config.selection.idField || 'id';
      const newSelected = checked ? paginatedData.map((item) => item[idField]) : [];
      setSelectedItems(newSelected);
      const selectedObjs = checked ? paginatedData : [];
      onSelectionChange?.(selectedObjs);
      config.selection?.onSelectionChange?.(newSelected);
    },
    [paginatedData, config.selection, onSelectionChange]
  );

  const handleSelectItem = useCallback(
    (item, checked) => {
      if (!config.selection?.enabled) return;
      const idField = config.selection.idField || 'id';
      const itemId = item[idField];
      const newSelected = checked
        ? [...selectedItems, itemId]
        : selectedItems.filter((id) => id !== itemId);

      setSelectedItems(newSelected);

      const selectedObjects = newSelected
        .map((id) => config.data.find((itm) => itm[idField] === id))
        .filter(Boolean);

      onSelectionChange?.(selectedObjects);
      config.selection.onSelectionChange?.(newSelected);
    },
    [selectedItems, config.data, config.selection, onSelectionChange]
  );

  // Reset page when filters change
  useEffect(() => {
    console.log('🔄 RESET: Filters/search changed, resetting to page 1');
    console.log('searchValue:', searchValue);
    console.log('customFilters:', customFilters);
    setCurrentPage(1);
  }, [searchValue, JSON.stringify(customFilters)]);

  // Reset page if current page exceeds total pages
  useEffect(() => {
    const totalPagesCount = Math.ceil(
      (config.pagination?.totalItems || filteredData.length) / (config.pagination?.pageSize || 10)
    );
    if (currentPage > totalPagesCount && totalPagesCount > 0) {
      console.log('🔄 RESET: Page exceeds total pages, resetting to page 1');
      console.log('currentPage:', currentPage, 'totalPages:', totalPagesCount);
      setCurrentPage(1);
    }
  }, [filteredData.length, config.pagination]);

  // Call onDataChange when filtered data changes
  useEffect(() => {
    onDataChange?.(filteredData);
  }, [filteredData, onDataChange]);

  return {
    currentPage,
    sortConfig,
    selectedItems,
    filteredData,
    sortedData,
    paginatedData,
    totalPages: Math.ceil(
      (config.pagination?.totalItems || filteredData.length) / (config.pagination?.pageSize || 10)
    ),
    handleSort,
    handlePageChange,
    handleSelectAll,
    handleSelectItem,
    setCurrentPage,
    setSelectedItems,
  };
};
