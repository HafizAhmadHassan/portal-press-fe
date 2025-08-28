import * as React from "react";
import GenericTable from "../GenericTable";

// Helper: safe extraction of an ID value from item
function getItemId<T, Id extends PropertyKey>(
  item: T,
  idField: keyof T | undefined
): Id | undefined {
  if (!idField) return undefined as unknown as Id;
  const rec = item as unknown as Record<PropertyKey, unknown>;
  return rec[idField as unknown as PropertyKey] as Id;
}

export const GenericTableWithLogic = <
  T,
  K extends keyof T | string = keyof T | string,
  Id extends PropertyKey = PropertyKey
>({
  config,
  onSelectionChange,
}: any): React.JSX.Element => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const paginatedData: T[] = (config.data ?? []) as T[];

  const currentPage: number = config.pagination?.currentPage ?? 1;
  const totalPages: number =
    config.pagination &&
    config.pagination.pageSize &&
    config.pagination.totalItems
      ? Math.ceil(config.pagination.totalItems / config.pagination.pageSize)
      : 1;

  const [selectedItems, setSelectedItems] = React.useState<Id[]>([]);

  const handleSort = React.useCallback(
    (key: K) => {
      // Delego lo sort al livello superiore (server-side) se presente nella config
      config.sorting?.onSort?.(key, "asc");
    },
    [config.sorting]
  );

  const handlePageChange = React.useCallback(
    (page: number) => {
      config.pagination?.onPageChange?.(page);
    },
    [config.pagination]
  );

  const handleSelectAll = React.useCallback(
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
    [config.selection, onSelectionChange, paginatedData]
  );

  const handleSelectItem = React.useCallback(
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

  // Usa direttamente la config (niente props top-level `loading`/`pagination`)
  const updatedConfig = React.useMemo(() => config, [config]);

  return (
    <GenericTable<T, K, Id>
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

export default GenericTableWithLogic;
