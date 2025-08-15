import React from 'react';
import GenericTable from '../GenericTable';

interface GenericTableWithLogicProps<T = any> {
  config: any;
  searchFields?: string[];
  searchValue?: string;
  customFilters?: Array<{
    field: string;
    value: any;
    operator?: 'equals' | 'includes' | 'startsWith' | 'custom';
    customFilter?: (item: T, value: any) => boolean;
  }>;
  onDataChange?: (filteredData: T[]) => void;
  onSelectionChange?: (selectedItems: T[]) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  loading?: boolean;
  onPageChange?: (page: number) => void;
}

export const GenericTableWithLogic = <T,>({
  config,
  onSelectionChange,
  pagination,
  loading = false,
  onPageChange,
}: GenericTableWithLogicProps<T>) => {
  const paginatedData = config.data || [];

  const currentPage = config.pagination?.currentPage || pagination?.page || 1;
  const totalPages = config.pagination?.totalPages || pagination?.totalPages || 1;

  const [selectedItems, setSelectedItems] = React.useState<any[]>([]);

  const handleSort = React.useCallback(
    (key: string) => {
      if (!config.sorting?.enabled) return;
    },
    [config.sorting]
  );

  const handlePageChange = React.useCallback(
    (page: number) => {
      if (config.pagination?.onPageChange) {
        config.pagination.onPageChange(page);
      } else if (onPageChange) {
        onPageChange(page);
      }
    },
    [config.pagination, onPageChange]
  );

  const handleSelectAll = React.useCallback(
    (checked: boolean) => {
      if (!config.selection?.enabled) return;

      const idField = config.selection.idField || 'id';
      const newSelected = checked ? paginatedData.map((item: any) => item[idField]) : [];
      setSelectedItems(newSelected);

      const selectedObjs = checked ? paginatedData : [];
      onSelectionChange?.(selectedObjs);
      config.selection?.onSelectionChange?.(newSelected);
    },
    [paginatedData, config.selection, onSelectionChange]
  );

  const handleSelectItem = React.useCallback(
    (item: any, checked: boolean) => {
      if (!config.selection?.enabled) return;

      const idField = config.selection.idField || 'id';
      const itemId = item[idField];
      const newSelected = checked
        ? [...selectedItems, itemId]
        : selectedItems.filter((id) => id !== itemId);

      setSelectedItems(newSelected);

      const selectedObjects = newSelected
        .map((id) => config.data.find((itm: any) => itm[idField] === id))
        .filter(Boolean);

      onSelectionChange?.(selectedObjects);
      config.selection.onSelectionChange?.(newSelected);
    },
    [selectedItems, config.data, config.selection, onSelectionChange]
  );

  const updatedConfig = React.useMemo(
    () => ({
      ...config,
      loading: loading || config.loading,
    }),
    [config, loading]
  );

  return (
    <GenericTable
      config={updatedConfig}
      paginatedData={paginatedData}
      currentPage={currentPage}
      totalPages={totalPages}
      selectedItems={selectedItems}
      sortConfig={null}
      onSort={handleSort}
      onPageChange={handlePageChange}
      onSelectAll={handleSelectAll}
      onSelectItem={handleSelectItem}
    />
  );
};
