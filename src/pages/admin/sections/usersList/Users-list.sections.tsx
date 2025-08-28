import React, { useCallback, useMemo, useEffect } from "react";
import { useUsers } from "@store_admin/users/hooks/useUsers";
import { useListQueryParams } from "@hooks/useListQueryParams";
import { createUsersTableConfig } from "./config/usersTableConfig";
import {
  createUsersFilterConfig,
  UserFields,
} from "@sections_admin/usersList/config/userFilterConfig";
import { ModalCreateUpdateUser } from "@root/pages/admin/sections/usersList/_modals/ModalCreateUpdateUser/ModalCreateUpdateUser.component";
import type { CreateUserRequest, User } from "@store_admin/users/user.types";
import styles from "./styles/User-list.sections.module.scss";
import { SectionHeaderComponent } from "@sections_admin/_commons/components/SectionHeader/Section-header.component";
import { SectionFilterComponent } from "@sections_admin/_commons/components/SectionFilters/Section-filters.component";
import { Download, Plus, RefreshCw } from "lucide-react";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { usePagination } from "@hooks/usePagination.ts";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { Divider } from "@shared/divider/Divider.component.tsx";

// 👇 NEW: ascolta il cliente globale scelto nell'header
import { useAppSelector } from "@root/pages/admin/core/store/store.hooks";
import { selectScopedCustomer } from "@store_admin/scope/scope.selectors";

export const UsersListSections: React.FC = () => {
  // 🔗 customer globale (selezionato nell'header)
  const scopedCustomer = useAppSelector(selectScopedCustomer);

  const {
    filters,
    sortBy,
    sortOrder,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    resetAll,
  } = useListQueryParams({
    initialFilters: {
      [UserFields.EMAIL]: "",
      [UserFields.USERNAME]: "",
      [UserFields.USER_PERMISSIONS]: "",
      [UserFields.isActive]: "",
      // ❌ nessun filtro customer qui: è globale
    },
  });

  const queryParams = {
    ...filters,
    sortBy,
    sortOrder,
    page,
    page_size: pageSize,
  };

  const {
    users,
    isLoading,
    meta,
    deleteUser,
    refetch,
    createUser,
    updateUser,
  } = useUsers(queryParams);

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

  const handleViewUser = useCallback((_u: User) => {}, []);

  const handleEditUser = useCallback(
    async (userData: Partial<User> & { id: number | string }) => {
      try {
        const { id, ...data } = userData;
        await updateUser({ id, data }).unwrap();
        refetch();
      } catch (error: any) {
        console.error("Errore nella modifica utente:", error);
        throw new Error(
          error?.data?.detail || "Errore durante la modifica dell'utente"
        );
      }
    },
    [updateUser, refetch]
  );

  const handleDeleteUser = useCallback(
    async (u: User) => {
      const name = u.username || u.email;
      if (window.confirm(`Sei sicuro di voler eliminare l'utente ${name}?`)) {
        try {
          await deleteUser(u.id).unwrap();
        } catch (e: any) {
          alert(`Errore: ${e.message || "sconosciuto"}`);
        }
      }
    },
    [deleteUser]
  );

  const handleCreateUser = useCallback(
    async (userData: CreateUserRequest) => {
      try {
        await createUser(userData).unwrap();
        refetch();
      } catch (error: any) {
        console.error("Errore nella creazione utente:", error);
        throw new Error(
          error?.data?.detail || "Errore durante la creazione dell'utente"
        );
      }
    },
    [createUser, refetch]
  );

  const onExportClick = () => console.log("Esporta utenti");
  const onRefreshClick = () => refetch();

  const baseConfig = createUsersTableConfig({
    users,
    onView: handleViewUser,
    onEdit: handleEditUser,
    onDelete: handleDeleteUser,
    isLoading,
  });

  const tableConfig = {
    ...baseConfig,
    pagination: {
      enabled: true,
      currentPage: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: pagination.totalPages,
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
    () =>
      createUsersFilterConfig({
        filters,
        setFilter,
      }),
    [filters, setFilter]
  );

  // 🔁 Quando cambia il cliente scelto in header:
  // - resetta paginazione
  // - rifai la fetch degli utenti
  useEffect(() => {
    setPage(1);
    refetch();
  }, [scopedCustomer]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles["users-list-page"]}>
      <SectionHeaderComponent
        title="Utenti"
        subTitle={`Gestisci gli utenti (${meta?.total ?? 0} totali)`}
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
            component: (
              <ModalCreateUpdateUser
                mode="create"
                onSave={handleCreateUser}
                triggerButton={
                  <SimpleButton
                    variant="outline"
                    color="primary"
                    size="sm"
                    icon={Plus}
                  >
                    Nuovo
                  </SimpleButton>
                }
              />
            ),
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

      <div className={styles["users-list-page__filters"]}>
        <SectionFilterComponent
          filters={filtersConfig}
          onResetFilters={handleResetAll}
          // isLoading={isLoading}
        />
      </div>
      <Divider />

      <div className={styles["users-list-page__table-wrapper"]}>
        <GenericTableWithLogic config={tableConfig} /* loading={isLoading} */ />
      </div>
    </div>
  );
};
