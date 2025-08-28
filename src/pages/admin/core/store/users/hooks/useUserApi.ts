import { usersApi } from "@store_admin/users/user.api.ts";

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useBulkActionsMutation,
  useGetUserStatsQuery,
  useSearchUsersQuery,
} = usersApi;
