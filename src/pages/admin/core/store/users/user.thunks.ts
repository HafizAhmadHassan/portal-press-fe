import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";
import type {
  BulkActionRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UsersQueryParams,
} from "@store_admin/users/user.types.ts";
import { usersApi } from "@store_admin/users/user.api.ts";
import { setPagination, setUsers } from "@store_admin/users/user.slice.ts";

// Carica utenti con parametri di paginazione
export const loadUsers = createAsyncThunk(
  "users/load",
  async (
    params: Partial<UsersQueryParams> = {},
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const { filters: currentFilters, pagination: currentPagination } =
        state.users;

      const queryParams: UsersQueryParams = {
        page: params.page ?? currentPagination.page,
        page_size: params.page_size ?? currentPagination.limit,
        search: params.search ?? currentFilters.search,
        role: params.role ?? currentFilters.role,
        isActive: params.isActive ?? currentFilters.isActive,
        sortBy: params.sortBy ?? currentFilters.sortBy,
        sortOrder: params.sortOrder ?? currentFilters.sortOrder,
      };

      const response = await dispatch(
        usersApi.endpoints.getUsers.initiate(queryParams)
      ).unwrap();

      // 🔹 Allinea il Redux slice allo stato ricevuto da RTK Query
      dispatch(setUsers(response.data ?? response));

      // Se hai la paginazione nel payload:
      if (response.pagination) {
        dispatch(setPagination(response.pagination));
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel caricamento utenti"
      );
    }
  }
);
// Cerca utenti con debouncing (ora gestito dal custom hook)
export const searchUsers = createAsyncThunk(
  "users/search",
  async (searchQuery: string, { dispatch, rejectWithValue }) => {
    try {
      // Utilizza loadUsers con parametri di ricerca
      const response = await dispatch(
        loadUsers({
          search: searchQuery,
          page: 1, // Reset alla prima pagina per nuove ricerche
        })
      ).unwrap();

      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Errore nella ricerca");
    }
  }
);

// Crea nuovo utente
export const createNewUser = createAsyncThunk(
  "users/create",
  async (userData: CreateUserRequest, { dispatch, rejectWithValue }) => {
    try {
      const newUser = await dispatch(
        usersApi.endpoints.createUser.initiate(userData)
      ).unwrap();

      // Ricarica la lista utenti per aggiornare la paginazione
      await dispatch(loadUsers());

      return newUser;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nella creazione utente"
      );
    }
  }
);

// Aggiorna utente
export const updateExistingUser = createAsyncThunk(
  "users/update",
  async (updateData: UpdateUserRequest, { dispatch, rejectWithValue }) => {
    try {
      const updatedUser = await dispatch(
        usersApi.endpoints.updateUser.initiate(updateData)
      ).unwrap();

      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nell'aggiornamento utente"
      );
    }
  }
);

// Elimina utente
export const deleteExistingUser = createAsyncThunk(
  "users/delete",
  async (userId: string, { dispatch, rejectWithValue }) => {
    try {
      await dispatch(usersApi.endpoints.deleteUser.initiate(userId)).unwrap();

      // Ricarica la lista per aggiornare la paginazione
      await dispatch(loadUsers());

      return userId;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nell'eliminazione utente"
      );
    }
  }
);

// Operazioni bulk
export const performBulkAction = createAsyncThunk(
  "users/bulkAction",
  async (request: BulkActionRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        usersApi.endpoints.bulkActions.initiate(request)
      ).unwrap();

      // Ricarica la lista utenti dopo operazioni bulk
      await dispatch(loadUsers());

      return {
        ...response,
        action: request.action,
        affectedUserIds: request.userIds,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nell'operazione bulk"
      );
    }
  }
);

// Cambia pagina
export const changePage = createAsyncThunk(
  "users/changePage",
  async (page: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(loadUsers({ page })).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Errore nel cambio pagina");
    }
  }
);

// Cambia dimensione pagina
export const changePageSize = createAsyncThunk(
  "users/changePageSize",
  async (pageSize: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        loadUsers({
          page_size: pageSize,
          page: 1, // Reset alla prima pagina quando cambia la dimensione
        })
      ).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel cambio dimensione pagina"
      );
    }
  }
);

// Applica filtri
export const applyFilters = createAsyncThunk(
  "users/applyFilters",
  async (filters: Partial<UsersQueryParams>, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        loadUsers({
          ...filters,
          page: 1, // Reset alla prima pagina quando si applicano nuovi filtri
        })
      ).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nell'applicazione filtri"
      );
    }
  }
);

// Resetta filtri
export const resetFilters = createAsyncThunk(
  "users/resetFilters",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        loadUsers({
          page: 1,
          search: "",
          role: "",
          isActive: null,
          sortBy: "createdAt",
          sortOrder: "desc",
        })
      ).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Errore nel reset filtri");
    }
  }
);
