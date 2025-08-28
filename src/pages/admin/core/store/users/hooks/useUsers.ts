import { useMemo } from "react";
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "@store_admin/users/user.api";
import type {
  CreateUserRequest,
  UpdateUserRequest,
  UsersQueryParams,
} from "@store_admin/users/user.types";

export const useUsers = (params: UsersQueryParams) => {
  const {
    data: apiResponse,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetUsersQuery(params, {
    pollingInterval: 0,
  });

  const [deleteMutation] = useDeleteUserMutation();
  const [createMutation] = useCreateUserMutation();
  const [updateMutation] = useUpdateUserMutation();

  const users = useMemo(() => apiResponse?.data ?? [], [apiResponse?.data]);
  const meta = apiResponse?.meta ?? null;

  const deleteUser = (userId: number) => deleteMutation(userId);
  const createUser = (userData: CreateUserRequest) => createMutation(userData);
  const updateUser = (userData: UpdateUserRequest) => updateMutation(userData);

  return {
    users,
    meta, // Passo i meta così come sono, sarà il componente a gestirli
    isLoading: isLoading || isFetching,
    error,
    deleteUser,
    createUser,
    updateUser,
    refetch,
  };
};
