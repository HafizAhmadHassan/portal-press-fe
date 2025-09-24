import React, { useMemo } from "react";
import { RefreshCw, Download } from "lucide-react";
import styles from "./_styles/Logs-list.module.scss";
import { getLogsColumns } from "./_config/logsTableConfig";
import { Divider } from "@shared/divider/Divider.component";
import logsListHeaderBtns from "./_config/logsListHeaderBtns";
import { useGetLogsQuery } from "../../core/store/logs/logs.api";
import { useListController } from "@root/hooks/useListController";
import { createLogsFilterConfig } from "./_config/logsFilterConfig";
import { LogsFields } from "@root/utils/constants/logsFields.constants";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";

export const LogsListSections: React.FC = () => {
  const {
    meta,
    isLoading,
    refetch,
    filters,
    setFilter,
    resetAll,
    buildTableConfig,
  } = useListController<any, any>({
    listHook: useGetLogsQuery, // <— come per Users con useGetUsersQuery
    initialFilters: {
      [LogsFields.MACHINE_IP]: "",
      [LogsFields.CODE_ALARM]: "",
      [LogsFields.NAME_ALARM]: "",
      [LogsFields.DATE_FROM]: "",
      [LogsFields.DATE_TO]: "",
      [LogsFields.SEARCH]: "",
    },
    initialSort: { sortBy: "date_and_time", sortOrder: "desc" },
  });

  const onExportClick = () => console.log("Esporta logs");
  const onRefreshClick = () => refetch();

  const columns = useMemo(() => getLogsColumns(), []);

  const tableConfig = useMemo(
    () => buildTableConfig(columns),
    [buildTableConfig, columns]
  );

  const filtersConfig = useMemo(
    () =>
      createLogsFilterConfig({
        filters,
        setFilter,
      }),
    [filters, setFilter]
  );

  return (
    <div className={styles["logs-list-page"]}>
      <SectionHeaderComponent
        title="Logs"
        subTitle={`Eventi di sistema (${meta?.total ?? 0} totali)`}
        buttons={logsListHeaderBtns(
          onRefreshClick,
          RefreshCw,
          isLoading,
          onExportClick,
          Download
        )}
      />

      {/* <div className={styles["logs-list-page__filters"]}>
        <SectionFilterComponent
          isLoading={isLoading}
          filters={filtersConfig}
          onResetFilters={resetAll}
        />
      </div> */}

      <Divider />

      <div className={styles["logs-list-page__table-wrapper"]}>
        <GenericTableWithLogic config={tableConfig} />
      </div>
    </div>
  );
};

export default LogsListSections;
