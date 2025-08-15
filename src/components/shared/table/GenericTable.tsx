import React, { useCallback } from 'react';
import { TableCell } from './components/TableCell.component.tsx';
import { TablePagination } from './components/TablePagination.component.tsx';
import styles from './styles/GenericTable.module.scss';

const GenericTable = <T,>({
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
}: any) => {
  const getCellValue = useCallback((item: any, column: any) => {
    if (column.accessor) {
      return column.accessor(item);
    }
    return (item as any)[column.key];
  }, []);

  // Loading state
  if (config.loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  // ✅ FIX: Usa sempre i valori dalla configurazione per la paginazione server-side
  // Non calcolare totalItems da _config.data.length perché contiene solo la pagina corrente
  const totalItems = config.pagination?.totalItems ?? 0;
  const pageSize = config.pagination?.pageSize ?? 10;
  const calculatedTotalPages =
    config.pagination?.totalPages ?? totalPages ?? Math.ceil(totalItems / pageSize);

  // Debug per verificare i valori corretti

  return (
    <div className={`${styles.tableContainer} ${config.className || ''}`}>
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
                      selectedItems.length === paginatedData.length && paginatedData.length > 0
                    }
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className={styles.checkbox}
                  />
                </th>
              )}

              {/* Column headers */}
              {config.columns.map((column) => (
                <th
                  key={column.key}
                  className={`${styles.headerCell} ${
                    column.sortable && config.sorting?.enabled ? styles.sortable : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && config.sorting?.enabled && onSort(column.key)}
                >
                  <div className={styles.headerContent}>
                    <span>{column.header}</span>
                    {column.sortable && config.sorting?.enabled && (
                      <span className={styles.sortIcon}>
                        {sortConfig?.key === column.key
                          ? sortConfig.direction === 'asc'
                            ? '↑'
                            : '↓'
                          : '↕'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={styles.tableBody}>
            {paginatedData.map((item: any, index: number) => {
              const idField = config.selection?.idField || 'id';
              const itemId = (item as any)[idField];
              const isSelected = selectedItems.includes(itemId);

              return (
                <tr
                  key={itemId || index}
                  className={`${styles.bodyRow} ${isSelected ? styles.selected : ''}`}
                >
                  {/* Selection cell */}
                  {config.selection?.enabled && (
                    <td className={`${styles.selectionCell}`}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => onSelectItem(item, e.target.checked)}
                        className={styles.checkbox}
                      />
                    </td>
                  )}

                  {/* Data cells */}
                  {config.columns.map((column) => (
                    <TableCell
                      key={column.key}
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
            {config.emptyMessage || 'Non ci sono elementi da visualizzare'}
          </p>
        </div>
      )}

      {/* ✅ FIX: Paginazione con valori corretti - DEBUG TEMPORANEO */}
      {config.pagination?.enabled && (
        <TablePagination
          currentPage={currentPage}
          totalPages={calculatedTotalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={config.pagination?.onPageSizeChange}
          showPageSizeSelector={!!config.pagination?.onPageSizeChange}
          hasNext={config.pagination?.hasNext}
          hasPrev={config.pagination?.hasPrev}
          nextPage={config.pagination?.nextPage}
          prevPage={config.pagination?.prevPage}
        />
      )}
    </div>
  );
};

export default GenericTable;
