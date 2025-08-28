import * as React from "react";
import { useCallback } from "react";
import { TableCell } from "./components/TableCell.component";
import { TablePagination } from "./components/TablePagination.component";
import styles from "./styles/GenericTable.module.scss";

import type { TableColumn } from "./types/GenericTable.types";

// Estensione opzionale per proprietà extra di paginazione usate nel componente
type ExtendedPagination = {
  onPageSizeChange?: (size: number) => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  nextPage?: number;
  prevPage?: number;
  totalPages?: number;
};

function computeTotalPages(totalItems: number, pageSize: number): number {
  if (pageSize <= 0) return 0;
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

function getValueFromKey<T>(item: T, key: keyof T | string): unknown {
  // Permette chiavi "virtuali" stringa e chiavi reali di T
  if (typeof key === "string") {
    const rec = item as unknown as Record<string, unknown>;
    return rec[key];
  }
  const rec = item as unknown as Record<keyof T, unknown>;
  return rec[key as keyof T];
}

function getCellValueGeneric<T, K extends keyof T | string>(
  item: T,
  column: TableColumn<T, K>
): unknown {
  if ("accessor" in column && typeof column.accessor === "function") {
    return column.accessor(item);
  }
  return getValueFromKey(item, column.key);
}

const GenericTable = <
  T,
  K extends keyof T | string = keyof T | string,
  Id extends PropertyKey = PropertyKey
>({
  config,
  paginatedData,
  currentPage,
  totalPages,
  selectedItems,
  sortConfig,
  onSort,
  onPageChange,
  onSelectAll,
  onSelectItem,
}: any): React.JSX.Element => {
  const getCellValue = useCallback(
    (item: T, column: TableColumn<T, K>) => getCellValueGeneric(item, column),
    []
  );

  // Loading state
  if (config.loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // Paginazione (server-side friendly)
  const totalItems = config.pagination?.totalItems ?? 0;
  const pageSize = config.pagination?.pageSize ?? 10;

  const pgExtra = (config.pagination ?? {}) as NonNullable<
    typeof config.pagination
  > &
    ExtendedPagination;

  const calculatedTotalPages =
    pgExtra.totalPages ?? totalPages ?? computeTotalPages(totalItems, pageSize);

  return (
    <div className={`${styles.tableContainer} ${config.className || ""}`}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          {/* Table Header */}
          <thead className={styles.tableHeader}>
            <tr className={styles.headerRow}>
              {/* Selection column */}
              {config.selection?.enabled && (
                <th className={`${styles.headerCell} ${styles.selectionCell}`}>
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === paginatedData.length &&
                      paginatedData.length > 0
                    }
                    onChange={(e) => onSelectAll(e.currentTarget.checked)}
                    className={styles.checkbox}
                  />
                </th>
              )}

              {/* Column headers */}
              {config.columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`${styles.headerCell} ${
                    column.sortable && config.sorting?.enabled
                      ? styles.sortable
                      : ""
                  }`}
                  style={{ width: column.width }}
                  onClick={() =>
                    column.sortable &&
                    config.sorting?.enabled &&
                    onSort(column.key as K)
                  }
                >
                  <div className={styles.headerContent}>
                    <span>{column.header}</span>
                    {column.sortable && config.sorting?.enabled && (
                      <span className={styles.sortIcon}>
                        {sortConfig?.key === column.key
                          ? sortConfig.direction === "asc"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={styles.tableBody}>
            {paginatedData.map((item, index) => {
              const idField = config.selection?.idField ?? ("id" as keyof T);
              const itemId = (item as unknown as Record<PropertyKey, unknown>)[
                idField as unknown as PropertyKey
              ] as Id;
              const isSelected = selectedItems.includes(itemId);

              return (
                <tr
                  key={(itemId as unknown as string) ?? String(index)}
                  className={`${styles.bodyRow} ${
                    isSelected ? styles.selected : ""
                  }`}
                >
                  {/* Selection cell */}
                  {config.selection?.enabled && (
                    <td className={`${styles.selectionCell}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          onSelectItem(item, e.currentTarget.checked)
                        }
                        className={styles.checkbox}
                      />
                    </td>
                  )}

                  {/* Data cells */}
                  {config.columns.map((column) => (
                    <TableCell
                      key={String(column.key)}
                      column={column}
                      item={item}
                      value={getCellValue(item, column)}
                    />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {paginatedData.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>Nessun dato trovato</div>
          <p className={styles.emptyMessage}>
            {config.emptyMessage || "Non ci sono elementi da visualizzare"}
          </p>
        </div>
      )}

      {/* Pagination */}
      {config.pagination?.enabled && (
        <TablePagination
          currentPage={currentPage}
          totalPages={calculatedTotalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={pgExtra.onPageSizeChange}
          showPageSizeSelector={Boolean(pgExtra.onPageSizeChange)}
          hasNext={pgExtra.hasNext}
          hasPrev={pgExtra.hasPrev}
          nextPage={pgExtra.nextPage}
          prevPage={pgExtra.prevPage}
        />
      )}
    </div>
  );
};

export default GenericTable;
