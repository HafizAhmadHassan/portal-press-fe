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
    // Endpoint principale per ottenere utenti con paginazione
    getUsers: builder.query<UsersResponse, UsersQueryParams>({
      query: (params = {}) => {
        // Filtra parametri undefined/null/empty
        const cleanParams = Object.entries(params).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>
        );

        return {
          url: "user/",
          params: cleanParams,
        };
      },
      providesTags: [
        { type: "LIST" as const, id: "Users" },
        { type: "STATS" as const, id: "Users" },
      ],
      // Mantieni i dati precedenti durante il fetch per UX migliore
      keepPreviousData: true,
      // Trasforma la risposta per mantenere la struttura originale
      transformResponse: (response: UsersResponse) => {
        // Valida che la risposta abbia la struttura corretta
        if (!response.meta || !Array.isArray(response.data)) {
          throw new Error("Invalid API response structure");
        }
        return response;
      },
    }),

    // Ottieni singolo utente
    getUserById: builder.query<User, string>({
      query: (id) => `user/${id}`,
      providesTags: (result, error, id) => [{ type: "ENTITY" as const, id }],
    }),

    // Crea nuovo utente
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: "users",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LIST" as const, id: "Users" },
        { type: "STATS" as const, id: "Users" },
      ],
    }),

    // Aggiorna utente
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, data }) => ({
        url: `user/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Users" },
        { type: "STATS" as const, id: "Users" },
      ],
      // Aggiornamento ottimistico
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getUserById", id, (draft) => {
            Object.assign(draft, data);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    // Elimina utente
    deleteUser: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: `user/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, id) => [
          { type: "ENTITY" as const, id },
          { type: "LIST" as const, id: "Users" },
          { type: "STATS" as const, id: "Users" },
        ],
        // Aggiornamento ottimistico della lista
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patches: any[] = [];

          // Aggiorna tutte le query di lista in cache
          dispatch(
            apiSlice.util.updateQueryData(
              "getUsers",
              {},
              (draft: UsersResponse) => {
                if (draft.data) {
                  const userIndex = draft.data.findIndex(
                    (user) => user.id === id
                  );
                  if (userIndex !== -1) {
                    draft.data.splice(userIndex, 1);
                    // Aggiorna i metadati
                    draft.meta.total = Math.max(0, draft.meta.total - 1);
                    draft.meta.total_pages = Math.ceil(
                      draft.meta.total / draft.meta.page_size
                    );

                    // Aggiorna has_next/has_prev se necessario
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
            // Rollback in caso di errore
            patches.forEach((patch) => patch.undo());
          }
        },
      }
    ),

    // Ricerca utenti
    searchUsers: builder.query<User[], { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => ({
        url: "user/search",
        params: { q: query, limit },
      }),
      providesTags: [{ type: "LIST" as const, id: "Users" }],
    }),

    // Operazioni bulk
    bulkActions: builder.mutation<
      { message: string; affectedCount: number },
      BulkActionRequest
    >({
      query: (body) => ({
        url: "user/bulk",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LIST" as const, id: "Users" },
        { type: "STATS" as const, id: "Users" },
      ],
    }),

    // Statistiche utenti
    getUserStats: builder.query<UsersStatsResponse, void>({
      query: () => "user/stats",
      providesTags: [{ type: "STATS" as const, id: "Users" }],
    }),
  }),
  overrideExisting: false,
});

// Export degli hook generati
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
