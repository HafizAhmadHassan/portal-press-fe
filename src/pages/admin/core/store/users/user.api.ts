// @store_admin/users/user.api.ts
import { apiSlice } from "@store_admin/apiSlice";
import type {
  BulkActionRequest,
  CreateUserRequest,
  UpdateUserRequest,
  User,
  UsersQueryParams,
  UsersResponse,
  UsersStatsResponse,
} from "./user.types";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, UsersQueryParams>({
      query: (params = {}) => {
        const cleanParams = Object.entries(params).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              (acc as any)[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>
        );
        return { url: "user/", params: cleanParams };
      },
      providesTags: [
        { type: "LIST" as const, id: "Users" },
        { type: "STATS" as const, id: "Users" },
      ],
      keepPreviousData: true,
      transformResponse: (response: UsersResponse) => {
        if (!response?.meta || !Array.isArray(response?.data)) {
          throw new Error("Invalid API response structure");
        }
        return response;
      },
    }),

    getUserById: builder.query<User, string>({
      query: (id) => `user/${id}`,
      providesTags: (_r, _e, id) => [{ type: "ENTITY" as const, id }],
    }),

    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({ url: "users", method: "POST", body }),
      invalidatesTags: [
        { type: "LIST" as const, id: "Users" },
        { type: "STATS" as const, id: "Users" },
      ],
    }),

    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, data }) => ({
        url: `user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Users" },
        { type: "STATS" as const, id: "Users" },
      ],
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          apiSlice.util.updateQueryData("getUserById", id, (draft: any) => {
            Object.assign(draft, data);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          (patch as any).undo?.();
        }
      },
    }),

    deleteUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({ url: `user/${id}`, method: "DELETE" }),
        invalidatesTags: (_r, _e, id) => [
          { type: "ENTITY" as const, id },
          { type: "LIST" as const, id: "Users" },
          { type: "STATS" as const, id: "Users" },
        ],
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patch = dispatch(
            apiSlice.util.updateQueryData(
              "getUsers",
              {},
              (draft: UsersResponse) => {
                if (draft?.data) {
                  const i = draft.data.findIndex((u) => u.id === id);
                  if (i !== -1) {
                    draft.data.splice(i, 1);
                    draft.meta.total = Math.max(0, draft.meta.total - 1);
                    draft.meta.total_pages = Math.ceil(
                      draft.meta.total / draft.meta.page_size
                    );
                    if (
                      draft.meta.page > draft.meta.total_pages &&
                      draft.meta.total_pages > 0
                    ) {
                      draft.meta.page = draft.meta.total_pages;
                      draft.meta.has_next = false;
                      draft.meta.next_page = null;
                    }
                  }
                }
              }
            )
          );
          try {
            await queryFulfilled;
          } catch {
            (patch as any).undo?.();
          }
        },
      }
    ),

    searchUsers: builder.query<User[], { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => ({
        url: "user/search",
        params: { q: query, limit },
      }),
      providesTags: [{ type: "LIST" as const, id: "Users" }],
    }),

    bulkActions: builder.mutation<
      { message: string; affectedCount: number },
      BulkActionRequest
    >({
      query: (body) => ({ url: "user/bulk", method: "POST", body }),
      invalidatesTags: [
        { type: "LIST" as const, id: "Users" },
        { type: "STATS" as const, id: "Users" },
      ],
    }),

    getUserStats: builder.query<UsersStatsResponse, void>({
      query: () => "user/stats",
      providesTags: [{ type: "STATS" as const, id: "Users" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSearchUsersQuery,
  useBulkActionsMutation,
  useGetUserStatsQuery,
} = usersApi;
