import * as React from "react";
import { useCallback } from "react";
import { TableCell } from "./components/TableCell.component";
import { TablePagination } from "./components/TablePagination.component";
import styles from "./styles/GenericTable.module.scss";

import type { TableColumn, TableConfig } from "./types/GenericTable.types";

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

interface GenericTableInnerProps<
  T,
  K extends keyof T | string,
  Id extends PropertyKey
> {
  config: TableConfig<T, K> & {
    collapsible?: {
      enabled: boolean;
      getRowKey?: (item: T, index: number) => string | number;
      initialCollapsedKeys?: Array<string | number>;
      exclusive?: boolean;
      renderExpanded?: (item: T) => React.ReactNode;
      expandLabel?: string;
      collapseLabel?: string;
    };
  };
  paginatedData: T[];
  currentPage: number;
  totalPages: number;
  selectedItems: Id[];
  sortConfig: { key: K; direction: string } | null;
  onSort: (key: K) => void;
  onPageChange: (page: number) => void;
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (item: T, checked: boolean) => void;
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
}: GenericTableInnerProps<T, K, Id>): React.JSX.Element => {
  const getCellValue = useCallback(
    (item: T, column: TableColumn<T, K>) => getCellValueGeneric(item, column),
    []
  );

  // Stato locale per tracciare quali righe sono collassate/espanso
  // (DEVE stare prima di qualsiasi return condizionale per non cambiare l'ordine degli hooks!)
  const [collapsedKeys, setCollapsedKeys] = React.useState<
    Set<string | number>
  >(
    () =>
      new Set(
        config.collapsible?.enabled
          ? config.collapsible.initialCollapsedKeys || []
          : []
      )
  );

  // Loading state (dopo gli hooks, così l'ordine è stabile)
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

  const toggleRow = (key: string | number) => {
    setCollapsedKeys((prev) => {
      const next = new Set(prev);
      const isCollapsed = next.has(key);
      if (isCollapsed) {
        next.delete(key); // espando (rimuovo da collassati)
      } else {
        if (config.collapsible?.exclusive) {
          // se esclusivo, collasso tutti gli altri (quindi set vuoto prima)
          next.clear();
        }
        next.add(key); // aggiungo ai collassati => riga principale resta visibile, seconda nascosta, invertiamo logica?
      }
      return next;
    });
  };

  const isExpanded = (key: string | number) => {
    // Convenzione: se nella Set dei collassati => CHIUSA, altrimenti APERTA.
    // Più intuitivo invertire? Manteniamo così: Set=collapsed
    return !collapsedKeys.has(key);
  };

  return (
    <div className={`${styles.tableContainer} ${config.className || ""}`}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          {/* Table Header */}
          <thead className={styles.tableHeader}>
            <tr className={styles.headerRow}>
              {config.collapsible?.enabled && (
                <th
                  className={`${styles.headerCell} ${styles.collapseCell}`}
                ></th>
              )}
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
              const rowKey = config.collapsible?.getRowKey
                ? config.collapsible.getRowKey(item, index)
                : (itemId as unknown as string | number) ?? index;
              const expanded = config.collapsible?.enabled
                ? isExpanded(rowKey)
                : true;

              return (
                <React.Fragment key={String(rowKey)}>
                  <tr
                    className={`${styles.bodyRow} ${
                      isSelected ? styles.selected : ""
                    }`}
                  >
                    {config.collapsible?.enabled && (
                      <td className={`${styles.collapseCell}`}>
                        {config.collapsible.renderExpanded ? (
                          <button
                            type="button"
                            className={styles.collapseBtn}
                            aria-label={
                              expanded
                                ? config.collapsible.collapseLabel || "Comprimi"
                                : config.collapsible.expandLabel || "Espandi"
                            }
                            onClick={() => toggleRow(rowKey)}
                          >
                            {expanded ? "−" : "+"}
                          </button>
                        ) : null}
                      </td>
                    )}
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
                  {config.collapsible?.enabled &&
                    config.collapsible.renderExpanded &&
                    expanded && (
                      <tr className={styles.expandedRow}>
                        <td
                          className={styles.expandedContentCell}
                          colSpan={
                            config.columns.length +
                            (config.selection?.enabled ? 1 : 0) +
                            (config.collapsible?.enabled ? 1 : 0)
                          }
                        >
                          {config.collapsible.renderExpanded(item)}
                        </td>
                      </tr>
                    )}
                </React.Fragment>
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
