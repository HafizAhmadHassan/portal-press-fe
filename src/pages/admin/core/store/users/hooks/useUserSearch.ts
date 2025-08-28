import { usersApi } from "@store_admin/users/user.api.ts";
import { useUsers } from "@store_admin/users/hooks/useUsers.ts";
import { useCallback } from "react";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  User,
} from "@store_admin/users/user.types.ts";

export const useUserSearch = (query: string, limit = 10) => {
  const {
    data: users,
    isLoading,
    error,
  } = usersApi.useSearchUsersQuery(
    { query, limit },
    { skip: !query || query.length < 2 }
  );

  return {
    users: users || [],
    isLoading,
    error,
  };
};

// _hooks/useUserForm.ts (per gestire form di creazione/modifica)
export const useUserForm = (initialUser?: User) => {
  const { createUser, updateUser, isLoading, error } = useUsers({});

  const handleSubmit = useCallback(
    async (formData: CreateUserRequest | UpdateUserRequest) => {
      try {
        if (initialUser) {
          // Modalità modifica
          await updateUser({
            id: initialUser.id,
            data: formData as Partial<User>,
          }).unwrap();
        } else {
          // Modalità creazione
          await createUser(formData as CreateUserRequest).unwrap();
        }
        return { success: true };
      } catch (error: any) {
        return {
          success: false,
          error: error.message || "Errore nel salvataggio",
        };
      }
    },
    [createUser, updateUser, initialUser]
  );

  return {
    handleSubmit,
    isLoading,
    error,
    isEditing: !!initialUser,
  };
};
