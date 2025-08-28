import { RefreshCw } from "lucide-react";
import React, { useCallback, useMemo } from "react";

import { Divider } from "@shared/divider/Divider.component";
import styles from "./styles/User-list.sections.module.scss";

import { createUsersFilterConfig } from "./config/userFilterConfig";

import type { User, UsersQueryParams } from "@store_admin/users/user.types";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@store_admin/users/user.api";

import { getUsersColumns } from "./config/usersTableConfig";
import { useCrud } from "@root/hooks/useCrud";
import { useListController } from "@root/hooks/useListController";
import { UserFields } from "@root/utils/constants/userFields.constants";
import { toAppError } from "@root/utils/errorHandling";
import usersListHeaderBtns from "./config/usersListHeaderBtns";

export const UsersListSections: React.FC = () => {
  const {
    meta,
    isLoading,
    refetch,
    filters,
    setFilter,
    resetAll,
    buildTableConfig,
  } = useListController<UsersQueryParams, User>({
    listHook: useGetUsersQuery,
    initialFilters: {
      [UserFields.EMAIL]: "",
      [UserFields.USERNAME]: "",
      [UserFields.USER_PERMISSIONS]: "",
      [UserFields.IS_ACTIVE]: "",
    },
    initialSort: { sortBy: "date_joined", sortOrder: "desc" },
  });

  const [updateUserTrigger] = useUpdateUserMutation();
  const [deleteUserTrigger] = useDeleteUserMutation();
  const { execUpdate, execDelete } = useCrud();

  const handleEditUser = useCallback(
    async (userData: Partial<User> & { id: number | string }) => {
      const { id, ...data } = userData;
      const res = await execUpdate(updateUserTrigger, {
        id: String(id),
        data: data as Partial<User>,
      });
      if (!res.success) throw new Error(res.error);
      refetch();
    },
    [execUpdate, updateUserTrigger, refetch]
  );

  const handleDeleteUser = useCallback(
    async (user: User) => {
      const res = await execDelete(deleteUserTrigger, String(user.id));
      if (!res.success) {
        const appErr = toAppError(
          res.error,
          "Errore durante l'eliminazione dell'utente"
        );
        console.error(appErr.message);
        throw new Error(appErr.message);
      }
      refetch();
    },
    [execDelete, deleteUserTrigger, refetch]
  );

  const onExportClick = () => console.log("Esporta utenti");
  const onRefreshClick = () => refetch();

  const columns = useMemo(
    () =>
      getUsersColumns({
        onEdit: handleEditUser,
        onDelete: handleDeleteUser,
      }),
    [handleEditUser, handleDeleteUser]
  );

  const tableConfig = useMemo(
    () => buildTableConfig(columns),
    [buildTableConfig, columns]
  );

  const filtersConfig = useMemo(
    () =>
      createUsersFilterConfig({
        filters,
        setFilter,
      }),
    [filters, setFilter]
  );

  return (
    <div className={styles["users-list-page"]}>
      <SectionHeaderComponent
        title="Utenti"
        subTitle={`Gestisci gli utenti (${meta?.total ?? 0} totali)`}
        buttons={usersListHeaderBtns(
          onRefreshClick,
          RefreshCw,
          isLoading,
          onExportClick
        )}
      />

      <div className={styles["users-list-page__filters"]}>
        <SectionFilterComponent
          isLoading={isLoading}
          filters={filtersConfig}
          onResetFilters={resetAll}
        />
      </div>
      <Divider />

      <div className={styles["users-list-page__table-wrapper"]}>
        <GenericTableWithLogic config={tableConfig} />
      </div>
    </div>
  );
};
