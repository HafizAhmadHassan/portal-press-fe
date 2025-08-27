import React, { useEffect, useMemo } from "react";
import { useLogs } from "@store_admin/logs/hooks/useLogs";
import { useListQueryParams } from "@hooks/useListQueryParams";
import { createLogsTableConfig } from "./_config/logsTableConfig";
import { createLogsFilterConfig, LogsFields } from "./_config/logsFilterConfig";

import styles from "./_styles/Logs-list.module.scss";

import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";
import { Download, RefreshCw } from "lucide-react";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { usePagination } from "@hooks/usePagination";
import { Divider } from "@shared/divider/Divider.component";

// customer globale dall'header
import { useAppSelector } from "@root/pages/admin/core/store/store.hooks";
import { selectScopedCustomer } from "@store_admin/scope/scope.selectors";

export const LogsListSections: React.FC = () => {
  // 🔗 cliente scelto nell'header
  const scopedCustomer = useAppSelector(selectScopedCustomer);

  const {
    filters,
    sortBy,
    sortOrder,
    page,
    pageSize,
    setFilter,
    setSort,
    setPage,
    setPageSize,
    resetAll,
  } = useListQueryParams({
    initialFilters: {
      [LogsFields.MACHINE_IP]: "",
      [LogsFields.CODE_ALARM]: "",
      [LogsFields.NAME_ALARM]: "",
      [LogsFields.DATE_FROM]: "",
      [LogsFields.DATE_TO]: "",
      [LogsFields.SEARCH]: "",
    },
    initialSortBy: "date_and_time",
    initialSortOrder: "desc",
  });

  const queryParams = {
    ...filters,
    sortBy,
    sortOrder,
    page,
    page_size: pageSize,
  };

  const { logs, isLoading, meta, refetch } = useLogs(queryParams);

  const pagination = usePagination({
    initialPage: page,
    initialPageSize: pageSize,
    totalItems: meta?.total,
    totalPages: meta?.total_pages,
    onChange: (newPage, newSize) => {
      setPage(newPage);
      setPageSize(newSize);
    },
  });

  const handleResetAll = () => {
    resetAll();
    pagination.resetPagination();
  };

  const onExportClick = () => console.log("Esporta logs");
  const onRefreshClick = () => refetch();

  const baseConfig = createLogsTableConfig({
    logs,
    isLoading,
    sortBy,
    sortOrder,
    onSort: setSort,
  });

  // 🔁 quando cambia il cliente scelto in header:
  // - reset pagina
  // - refetch dei logs
  useEffect(() => {
    setPage(1);
    refetch();
  }, [scopedCustomer]); // eslint-disable-line react-hooks/exhaustive-deps

  const tableConfig = {
    ...baseConfig,
    pagination: {
      enabled: true,
      currentPage: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: meta?.total_pages,
      totalItems: meta?.total ?? 0,
      onPageChange: pagination.setPage,
      onPageSizeChange: pagination.setPageSize,
      hasNext: meta?.has_next,
      hasPrev: meta?.has_prev,
      nextPage: meta?.next_page,
      prevPage: meta?.prev_page,
    },
  };

  const filtersConfig = useMemo(
    () => createLogsFilterConfig({ filters, setFilter }),
    [filters, setFilter]
  );

  return (
    <div className={styles["logs-list-page"]}>
      <SectionHeaderComponent
        title="Logs"
        subTitle={`Eventi di sistema (${meta?.total ?? 0} totali)`}
        buttons={[
          {
            onClick: onRefreshClick,
            variant: "outline",
            color: "secondary",
            size: "sm",
            icon: RefreshCw,
            label: "Aggiorna",
            disabled: isLoading,
          },
          {
            onClick: onExportClick,
            variant: "outline",
            color: "success",
            size: "sm",
            icon: Download,
            label: "Esporta",
          },
        ]}
      />

      <div className={styles["logs-list-page__filters"]}>
        <SectionFilterComponent
          filters={filtersConfig}
          onResetFilters={handleResetAll}
          // isLoading={isLoading}
        />
      </div>
      <Divider />

      <div className={styles["logs-list-page__table-wrapper"]}>
        <GenericTableWithLogic config={tableConfig} /* loading={isLoading} */ />
      </div>
    </div>
  );
};

export default LogsListSections;
