// @store/_shared/api.factory.ts
import type { Api, EndpointBuilder } from "@reduxjs/toolkit/query";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

type Builder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  string,
  string
>;

type FactoryConfig<TListResponse> = {
  entity: string; // solo descrittivo
  baseUrl: string; // es: "plc/"
  idTag: string; // es: "Plc"
  keepUnusedDataFor?: number;

  enableSearch?: boolean;
  searchPath?: string; // default: "search"

  enableStats?: boolean;
  statsPath?: string; // default: "stats"

  transformListResponse?: (res: any) => TListResponse;

  /**
   * Passa la tua apiSlice per abilitare il patch ottimistico su getById
   * (opzionale: se non lo passi, niente optimistic update).
   */
  apiForOptimisticPatch?: Api<BaseQueryFn, any, any>;
};

/**
 * Crea endpoint RTKQ generici con nomi FISSI:
 *  - getList, getById, create, update, delete, (opz.) search, (opz.) getStats
 * Consumali facendo alias per avere useGetPlcQuery ecc.
 */
export function createCrudEndpoints<
  TItem,
  TQueryParams extends Record<string, any> = Record<string, any>,
  TListResponse extends { data: TItem[]; meta?: any } = {
    data: TItem[];
    meta?: any;
  }
>(builder: Builder, cfg: FactoryConfig<TListResponse>) {
  const {
    baseUrl,
    idTag,
    keepUnusedDataFor = 60,
    enableSearch = false,
    searchPath = "search",
    enableStats = false,
    statsPath = "stats",
    transformListResponse,
    apiForOptimisticPatch,
  } = cfg;

  const cleanParams = (params: Record<string, any> = {}) =>
    Object.fromEntries(
      Object.entries(params).filter(
        ([, v]) => v !== undefined && v !== null && v !== ""
      )
    );

  const endpoints: any = {
    // LIST
    getList: builder.query<TListResponse, TQueryParams>({
      query: (params = {} as TQueryParams) => ({
        url: baseUrl,
        params: cleanParams(params),
      }),
      providesTags: [
        { type: "LIST", id: idTag },
        { type: "STATS", id: idTag },
      ],
      keepUnusedDataFor,
      ...(transformListResponse
        ? { transformResponse: transformListResponse }
        : {}),
    }),

    // BY ID
    getById: builder.query<TItem, number>({
      query: (id) => `${baseUrl}${id}`,
      providesTags: (_r, _e, id) => [{ type: "ENTITY", id }],
      keepUnusedDataFor,
    }),

    // CREATE
    create: builder.mutation<TItem, Partial<TItem>>({
      query: (body) => ({ url: baseUrl, method: "POST", body }),
      invalidatesTags: [
        { type: "LIST", id: idTag },
        { type: "STATS", id: idTag },
      ],
    }),

    // UPDATE
    update: builder.mutation<TItem, { id: number; data: Partial<TItem> }>({
      query: ({ id, data }) => ({
        url: `${baseUrl}${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ENTITY", id },
        { type: "LIST", id: idTag },
        { type: "STATS", id: idTag },
      ],
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        if (!apiForOptimisticPatch) return; // ottimistico opzionale
        const patch = dispatch(
          apiForOptimisticPatch.util.updateQueryData(
            "getById" as any,
            id,
            (draft: any) => {
              Object.assign(draft, data);
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    // DELETE
    delete: builder.mutation<void, number>({
      query: (id) => ({ url: `${baseUrl}${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "ENTITY", id },
        { type: "LIST", id: idTag },
        { type: "STATS", id: idTag },
      ],
    }),
  };

  if (enableSearch) {
    endpoints.search = builder.query<
      TItem[],
      { query: string; limit?: number }
    >({
      query: ({ query, limit = 10 }) => ({
        url: `${baseUrl}${searchPath}`,
        params: { q: query, limit },
      }),
      providesTags: [{ type: "LIST", id: idTag }],
      keepUnusedDataFor,
    });
  }

  if (enableStats) {
    endpoints.getStats = builder.query<any, void>({
      query: () => `${baseUrl}${statsPath}`,
      providesTags: [{ type: "STATS", id: idTag }],
      keepUnusedDataFor,
    });
  }

  return endpoints as {
    getList: typeof endpoints.getList;
    getById: typeof endpoints.getById;
    create: typeof endpoints.create;
    update: typeof endpoints.update;
    delete: typeof endpoints.delete;
    search?: typeof endpoints.search;
    getStats?: typeof endpoints.getStats;
  };
}
