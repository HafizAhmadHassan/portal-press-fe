import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@root/store.ts";
import { UserRoles } from "@root/utils/constants/userRoles";

// Selettori base
export const selectUsersState = (state: RootState) => state.users;

export const selectAllUsers = createSelector(
  [selectUsersState],
  (users) => users.users || [] // FIX: aggiungi fallback
);

export const selectSelectedUser = createSelector(
  [selectUsersState],
  (users) => users.selectedUser
);

export const selectUsersLoading = createSelector(
  [selectUsersState],
  (users) => users.isLoading
);

export const selectUsersError = createSelector(
  [selectUsersState],
  (users) => users.error
);

export const selectUsersPagination = createSelector(
  [selectUsersState],
  (users) =>
    users.pagination || {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    }
);

export const selectUsersFilters = createSelector(
  [selectUsersState],
  (users) =>
    users.filters || {
      search: "",
      role: "",
      isActive: null,
      sortBy: "createdAt",
      sortOrder: "desc",
    }
);

// Selettori computati
export const selectUserById = createSelector(
  [selectAllUsers, (state: RootState, userId: number) => userId],
  (users, userId) => users.find((user) => user.id === userId)
);

export const selectActiveUsers = createSelector([selectAllUsers], (users) =>
  users.filter((user) => user.isActive)
);

export const selectInactiveUsers = createSelector([selectAllUsers], (users) =>
  users.filter((user) => !user.isActive)
);

export const selectUsersByRole = createSelector(
  [selectAllUsers, (state: RootState, role: string) => role],
  (users, role) => users.filter((user) => user.role === role)
);

export const selectAdminUsers = createSelector([selectAllUsers], (users) =>
  users.filter((user) => user.role === UserRoles.ADMIN)
);

export const selectRegularUsers = createSelector([selectAllUsers], (users) =>
  users.filter((user) => user.role === UserRoles.USER)
);

export const selectUsersCount = createSelector([selectAllUsers], (users) => {
  // FIX: controlla che users sia un array valido
  if (!Array.isArray(users)) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      admin: 0,
      moderator: 0,
      user: 0,
    };
  }

  return {
    total: users.length,
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
    admin: users.filter((u) => u.role === UserRoles.ADMIN).length,
    user: users.filter((u) => u.role === UserRoles.USER).length,
  };
});

export const selectFilteredUsers = createSelector(
  [selectAllUsers, selectUsersFilters],
  (users, filters) => {
    // FIX: controlla che users sia un array valido
    if (!Array.isArray(users)) {
      return [];
    }

    return users.filter((user) => {
      // FIX: usa i campi che esistono nell'API reale
      const matchesSearch =
        !filters.search ||
        (user.username &&
          user.username.toLowerCase().includes(filters.search.toLowerCase())) ||
        (user.email &&
          user.email.toLowerCase().includes(filters.search.toLowerCase())) ||
        (user.fullName &&
          user.fullName.toLowerCase().includes(filters.search.toLowerCase()));

      const matchesRole = !filters.role || user.role === filters.role;

      const matchesStatus =
        filters.isActive === null || user.isActive === filters.isActive;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }
);

export const selectHasUsersFilters = createSelector(
  [selectUsersFilters],
  (filters) => {
    return (
      filters.search !== "" || filters.role !== "" || filters.isActive !== null
    );
  }
);

export const selectCanLoadMore = createSelector(
  [selectUsersPagination],
  (pagination) => {
    // FIX: controlla che pagination esista
    if (!pagination) {
      return false;
    }
    return pagination.page < pagination.totalPages;
  }
);
