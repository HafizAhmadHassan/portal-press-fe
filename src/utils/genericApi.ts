import { apiSlice } from '@store_admin/apiSlice';

// Interfaccia per i metadati di paginazione standard
export interface ApiMeta {
  total: number;
  total_pages: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
}

// Interfaccia per la risposta API standard
export interface ApiResponse<T> {
  meta: ApiMeta;
  data: T[];
}

// Parametri di query standard per paginazione
export interface PaginationParams {
  page?: number;
  page_size?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function createCrudApi<
  Entity,
  CreateDto = Partial<Entity>,
  UpdateDto = Partial<Entity>,
  ListParams extends PaginationParams = PaginationParams
>(
  resourcePath: string,
  tagType: string
) {
  const pluralName = resourcePath.charAt(0).toUpperCase() + resourcePath.slice(1);
  const singularName = tagType;

  return apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      // Get lista con paginazione e meta
      [`get${pluralName}`]: builder.query<ApiResponse<Entity>, ListParams>({
        query: (params) => {
          // Filtra parametri undefined/null/empty
          const cleanParams = Object.entries(params || {}).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              acc[key] = value;
            }
            return acc;
          }, {} as Record<string, any>);

          return {
            url: resourcePath,
            params: cleanParams,
          };
        },
        providesTags: [
          { type: 'LIST' as const, id: pluralName },
          { type: 'STATS' as const, id: pluralName }
        ],
        // Mantieni i dati precedenti durante il fetch per un'esperienza UX migliore
        keepPreviousData: true,
        // Valida la struttura della risposta
        transformResponse: (response: ApiResponse<Entity>) => {
          if (!response.meta || !Array.isArray(response.data)) {
            throw new Error(`Invalid API response structure for ${resourcePath}`);
          }
          return response;
        },
      }),

      // Get singola entità
      [`get${singularName}`]: builder.query<Entity, string>({
        query: (id) => `${resourcePath}/${id}`,
        providesTags: (result, error, id) => [{ type: 'ENTITY' as const, id }],
      }),

      // Create entità
      [`create${singularName}`]: builder.mutation<Entity, CreateDto>({
        query: (body) => ({
          url: resourcePath,
          method: 'POST',
          body
        }),
        invalidatesTags: [
          { type: 'LIST' as const, id: pluralName },
          { type: 'STATS' as const, id: pluralName }
        ],
      }),

      // Update entità
      [`update${singularName}`]: builder.mutation<Entity, { id: string; data: UpdateDto }>({
        query: ({ id, data }) => ({
          url: `${resourcePath}/${id}`,
          method: 'PUT',
          body: data
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: 'ENTITY' as const, id },
          { type: 'LIST' as const, id: pluralName },
          { type: 'STATS' as const, id: pluralName }
        ],
        // Aggiornamento ottimistico per una migliore UX
        async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
          // Patch temporaneo dei dati nella cache
          const patchResult = dispatch(
            apiSlice.util.updateQueryData(`get${singularName}` as any, id, (draft) => {
              Object.assign(draft, data);
            })
          );

          try {
            await queryFulfilled;
          } catch {
            // Rollback in caso di errore
            patchResult.undo();
          }
        },
      }),

      // Delete entità
      [`delete${singularName}`]: builder.mutation<{ success: boolean; message: string }, string>({
        query: (id) => ({
          url: `${resourcePath}/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: (result, error, id) => [
          { type: 'ENTITY' as const, id },
          { type: 'LIST' as const, id: pluralName },
          { type: 'STATS' as const, id: pluralName }
        ],
        // Aggiornamento ottimistico con nuova struttura meta
        async onQueryStarted(id, { dispatch, queryFulfilled }) {
          const patches: any[] = [];

          // Aggiorna tutte le query di lista in cache
          dispatch(
            apiSlice.util.updateQueryData(`get${pluralName}` as any, {}, (draft: ApiResponse<Entity>) => {
              if (draft.data) {
                const itemIndex = draft.data.findIndex((item: any) => item.id === id);
                if (itemIndex !== -1) {
                  // Rimuovi l'elemento
                  draft.data.splice(itemIndex, 1);

                  // Aggiorna i metadati
                  draft.meta.total = Math.max(0, draft.meta.total - 1);
                  draft.meta.total_pages = Math.ceil(draft.meta.total / draft.meta.page_size);

                  // Aggiorna le informazioni di navigazione
                  if (draft.meta.page > draft.meta.total_pages && draft.meta.total_pages > 0) {
                    draft.meta.page = draft.meta.total_pages;
                    draft.meta.has_next = false;
                    draft.meta.next_page = null;
                  }

                  // Ricalcola has_prev e prev_page
                  draft.meta.has_prev = draft.meta.page > 1;
                  draft.meta.prev_page = draft.meta.has_prev ? draft.meta.page - 1 : null;

                  // Ricalcola has_next e next_page
                  draft.meta.has_next = draft.meta.page < draft.meta.total_pages;
                  draft.meta.next_page = draft.meta.has_next ? draft.meta.page + 1 : null;
                }
              }
            })
          );

          try {
            await queryFulfilled;
          } catch {
            // Rollback in caso di errore
            patches.forEach(patch => patch.undo());
          }
        },
      }),

      // Bulk operations
      [`bulk${pluralName}Actions`]: builder.mutation<
        { message: string; affectedCount: number },
        { action: string; ids: string[]; data?: any }
      >({
        query: (body) => ({
          url: `${resourcePath}/bulk`,
          method: 'POST',
          body
        }),
        invalidatesTags: [
          { type: 'LIST' as const, id: pluralName },
          { type: 'STATS' as const, id: pluralName }
        ],
      }),

      // Search endpoint
      [`search${pluralName}`]: builder.query<Entity[], { query: string; limit?: number }>({
        query: ({ query, limit = 10 }) => ({
          url: `${resourcePath}/search`,
          params: { q: query, limit },
        }),
        providesTags: [{ type: 'LIST' as const, id: `${pluralName}Search` }],
      }),

      // Stats endpoint
      [`get${pluralName}Stats`]: builder.query<any, void>({
        query: () => `${resourcePath}/stats`,
        providesTags: [{ type: 'STATS' as const, id: pluralName }],
      }),
    }),
    overrideExisting: false,
  });
}

// Utility per generare hook names
export const generateHookNames = (resourcePath: string) => {
  const pluralName = resourcePath.charAt(0).toUpperCase() + resourcePath.slice(1);
  const singularName = resourcePath.slice(0, -1); // Rimuovi 's' finale
  const capitalSingular = singularName.charAt(0).toUpperCase() + singularName.slice(1);

  return {
    useGet: `useGet${pluralName}Query`,
    useGetById: `useGet${capitalSingular}Query`,
    useCreate: `useCreate${capitalSingular}Mutation`,
    useUpdate: `useUpdate${capitalSingular}Mutation`,
    useDelete: `useDelete${capitalSingular}Mutation`,
    useBulk: `useBulk${pluralName}ActionsMutation`,
    useSearch: `useSearch${pluralName}Query`,
    useStats: `useGet${pluralName}StatsQuery`,
  };
};

// Helper per estrarre informazioni di paginazione dai metadati
export const extractPaginationInfo = (meta: ApiMeta) => ({
  page: meta.page,
  pageSize: meta.page_size,
  total: meta.total,
  totalPages: meta.total_pages,
  hasNext: meta.has_next,
  hasPrev: meta.has_prev,
  nextPage: meta.next_page,
  prevPage: meta.prev_page,
  // Utility derivate
  isFirstPage: meta.page === 1,
  isLastPage: meta.page === meta.total_pages,
  canGoNext: meta.has_next,
  canGoPrev: meta.has_prev,
});

// Helper per validare la struttura della risposta API
export const validateApiResponse = <T>(response: any, resourceName: string): ApiResponse<T> => {
  if (!response) {
    throw new Error(`Empty response for ${resourceName}`);
  }

  if (!response.meta) {
    throw new Error(`Missing meta information in ${resourceName} response`);
  }

  if (!Array.isArray(response.data)) {
    throw new Error(`Invalid data structure in ${resourceName} response`);
  }

  // Valida i campi obbligatori dei meta
  const requiredMetaFields = ['total', 'total_pages', 'page', 'page_size', 'has_next', 'has_prev'];
  for (const field of requiredMetaFields) {
    if (response.meta[field] === undefined) {
      throw new Error(`Missing required meta field '${field}' in ${resourceName} response`);
    }
  }

  return response as ApiResponse<T>;
};