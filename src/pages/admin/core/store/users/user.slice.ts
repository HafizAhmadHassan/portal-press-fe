import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User, UsersState } from "@store_admin/users/user.types.ts"; // ✅ Aggiungi User import

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    search: "",
    role: "",
    isActive: null,
    sortBy: "createdAt",
    sortOrder: "desc",
  },
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // Imposta lista utenti
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
      state.isLoading = false;
      state.error = null;
    },

    // Aggiungi nuovo utente alla lista
    addUser: (state, action: PayloadAction<User>) => {
      state.users.unshift(action.payload);
      state.pagination.total += 1;
    },

    // Aggiorna utente esistente nella lista
    updateUserInList: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = action.payload;
      }
      // Aggiorna anche selectedUser se è lo stesso
      if (state.selectedUser?.id === action.payload.id) {
        state.selectedUser = action.payload;
      }
    },

    // Rimuovi utente dalla lista
    removeUser: (state, action: PayloadAction<number>) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
      // Rimuovi selectedUser se è lo stesso
      if (state.selectedUser?.id === action.payload) {
        state.selectedUser = null;
      }
    },

    // Rimuovi più utenti dalla lista
    removeUsers: (state, action: PayloadAction<number[]>) => {
      const idsToRemove = new Set(action.payload);
      state.users = state.users.filter((user) => !idsToRemove.has(user.id));
      state.pagination.total = Math.max(
        0,
        state.pagination.total - action.payload.length
      );
      // Rimuovi selectedUser se è incluso
      if (state.selectedUser && idsToRemove.has(state.selectedUser.id)) {
        state.selectedUser = null;
      }
    },

    // Imposta utente selezionato
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },

    // Imposta paginazione
    setPagination: (
      state,
      action: PayloadAction<{
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      }>
    ) => {
      state.pagination = action.payload;
    },

    // Imposta filtri
    setFilters: (
      state,
      action: PayloadAction<Partial<UsersState["filters"]>>
    ) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filtri
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Imposta loading
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    // Imposta errore
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Pulisci errore
    clearError: (state) => {
      state.error = null;
    },

    // Reset completo dello stato
    resetUsersState: () => {
      return initialState;
    },

    // Aggiorna stato di più utenti (per bulk actions)
    updateMultipleUsers: (
      state,
      action: PayloadAction<{
        userIds: number[];
        updates: Partial<User>;
      }>
    ) => {
      const { userIds, updates } = action.payload;
      const idsSet = new Set(userIds);

      state.users = state.users.map((user) =>
        idsSet.has(user.id) ? { ...user, ...updates } : user
      );

      // Aggiorna selectedUser se incluso
      if (state.selectedUser && idsSet.has(state.selectedUser.id)) {
        state.selectedUser = { ...state.selectedUser, ...updates };
      }
    },
  },
});

// ✅ EXPORT DEL SLICE (questo mancava!)
export { usersSlice };

// Export delle actions
export const {
  setUsers,
  addUser,
  updateUserInList,
  removeUser,
  removeUsers,
  setSelectedUser,
  setPagination,
  setFilters,
  resetFilters,
  setLoading,
  setError,
  clearError,
  resetUsersState,
  updateMultipleUsers,
} = usersSlice.actions;

// Export del reducer (default export)
export default usersSlice.reducer;
