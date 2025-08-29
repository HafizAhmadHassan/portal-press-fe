import { RefreshCw } from "lucide-react";
import { useCrud } from "@root/hooks/useCrud";
import React, { useCallback, useEffect, useMemo } from "react";
import { toAppError } from "@root/utils/errorHandling";
import { Divider } from "@shared/divider/Divider.component";
import { getUsersColumns } from "./_config/usersTableConfig";
import styles from "./_styles/User-list.sections.module.scss";
import usersListHeaderBtns from "./_config/usersListHeaderBtns";
import { useListController } from "@root/hooks/useListController";
import { createUsersFilterConfig } from "./_config/userFilterConfig";
import { UserFields } from "@root/utils/constants/userFields.constants";
import type { User, UsersQueryParams } from "@store_admin/users/user.types";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@store_admin/users/user.api";
import { useAppSelector } from "../../core/store/store.hooks";
import { selectScopedCustomer } from "../../core/store/scope/scope.selectors";

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
      [UserFields.IS_ACTIVE]: "",
      [UserFields.USER_PERMISSIONS]: "",
    },
    initialSort: { sortBy: "date_joined", sortOrder: "desc" },
  });

  const { execUpdate, execDelete } = useCrud();
  const [updateUserTrigger] = useUpdateUserMutation();
  const [deleteUserTrigger] = useDeleteUserMutation();

  const handleEditUser = useCallback(
    async (userData: Partial<User> & { id: number | string }) => {
      const { id, ...data } = userData;
      const res = await execUpdate(updateUserTrigger, {
        id: id,
        data: data as Partial<User>,
      });
      if (!res.success) throw new Error(res.error);
      refetch();
    },
    [execUpdate, updateUserTrigger, refetch]
  );

  const handleDeleteUser = useCallback(
    async (user: User) => {
      const res = await execDelete(deleteUserTrigger, user.id);
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

  // 🔗 cliente scelto in header
  const scopedCustomer = useAppSelector(selectScopedCustomer);
  // 🔁 quando cambia il cliente: reset ricerca e refetch
  useEffect(() => {
    refetch();
  }, [scopedCustomer, refetch]);

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
