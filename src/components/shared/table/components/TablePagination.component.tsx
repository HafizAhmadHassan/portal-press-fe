import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import styles from "../styles/TablePagination.module.scss";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  availablePageSizes?: number[];
  showPageSizeSelector?: boolean;
  // Props per supportare meta information
  hasNext?: boolean;
  hasPrev?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  availablePageSizes = [10, 20, 30, 40, 50],
  showPageSizeSelector = true,
  hasNext = false,
  hasPrev = false,
  nextPage = null,
  prevPage = null,
}) => {
  // Debug log per verificare le props

  // Non mostrare paginazione se non ci sono elementi
  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getVisiblePages = () => {
    const maxVisible = 5; // Ridotto per un look più pulito
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      // Mostra tutte le pagine se sono poche
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logica migliorata per ellipsis
      if (currentPage <= 3) {
        // Inizio: 1 2 3 4 ... 10
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fine: 1 ... 7 8 9 10
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Mezzo: 1 ... 4 5 6 ... 10
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
  };

  // Funzioni di navigazione che usano i metadati quando disponibili
  const handlePrevious = () => {
    if (prevPage !== null) {
      onPageChange(prevPage);
    } else {
      onPageChange(Math.max(currentPage - 1, 1));
    }
  };

  const handleNext = () => {
    if (nextPage !== null) {
      onPageChange(nextPage);
    } else {
      onPageChange(Math.min(currentPage + 1, totalPages));
    }
  };

  const visiblePages = getVisiblePages();

  // Determina lo stato dei bottoni
  const canGoPrev = hasPrev !== undefined ? hasPrev : currentPage > 1;
  const canGoNext = hasNext !== undefined ? hasNext : currentPage < totalPages;
  const canGoFirst = currentPage > 1;
  const canGoLast = currentPage < totalPages;

  return (
    <div className={styles.paginationContainer}>
      {/* Mobile Navigation */}
      <div className={styles.mobileNavigation}>
        <button
          onClick={handlePrevious}
          disabled={!canGoPrev}
          className={`${styles.mobileButton} ${
            !canGoPrev ? styles.disabled : ""
          }`}
        >
          <ChevronLeft size={16} />
          <span>Indietro</span>
        </button>

        <div className={styles.mobilePageInfo}>
          <span className={styles.currentPage}>{currentPage}</span>
          <span className={styles.separator}>di</span>
          <span className={styles.totalPages}>{totalPages}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={!canGoNext}
          className={`${styles.mobileButton} ${
            !canGoNext ? styles.disabled : ""
          }`}
        >
          <span>Avanti</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className={styles.desktopNavigation}>
        {/* Results Info */}
        <div className={styles.resultsInfo}>
          <p className={styles.infoText}>
            Mostrando{" "}
            <span className={styles.highlight}>
              {startItem.toLocaleString()}
            </span>
            {" - "}
            <span className={styles.highlight}>{endItem.toLocaleString()}</span>
            {" di "}
            <span className={styles.highlight}>
              {totalItems.toLocaleString()}
            </span>
            {" risultati"}
          </p>

          {/* Page Size Selector */}
          {showPageSizeSelector && onPageSizeChange && (
            <div className={styles.pageSizeSelector}>
              <label htmlFor="pageSize" className={styles.pageSizeLabel}>
                Righe per pagina:
              </label>
              <div className={styles.selectWrapper}>
                <select
                  id="pageSize"
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className={styles.pageSizeSelect}
                >
                  {availablePageSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <ChevronRight size={14} className={styles.selectIcon} />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className={styles.navigationControls}>
          {/* First Page */}
          <button
            onClick={() => onPageChange(1)}
            disabled={!canGoFirst}
            className={`${styles.navButton} ${styles.iconButton} ${
              !canGoFirst ? styles.disabled : ""
            }`}
            title="Prima pagina"
          >
            <ChevronsLeft size={16} />
          </button>

          {/* Previous Page */}
          <button
            onClick={handlePrevious}
            disabled={!canGoPrev}
            className={`${styles.navButton} ${styles.iconButton} ${
              !canGoPrev ? styles.disabled : ""
            }`}
            title="Pagina precedente"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Numbers */}
          <div className={styles.pageNumbers}>
            {visiblePages.map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className={styles.ellipsis}>⋯</span>
                ) : (
                  <button
                    onClick={() => onPageChange(page as number)}
                    className={`${styles.pageButton} ${
                      currentPage === page ? styles.active : ""
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next Page */}
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`${styles.navButton} ${styles.iconButton} ${
              !canGoNext ? styles.disabled : ""
            }`}
            title="Pagina successiva"
          >
            <ChevronRight size={16} />
          </button>

          {/* Last Page */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoLast}
            className={`${styles.navButton} ${styles.iconButton} ${
              !canGoLast ? styles.disabled : ""
            }`}
            title="Ultima pagina"
          >
            <ChevronsRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
