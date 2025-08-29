// @store/_shared/api.factory.ts
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type {
  Api as RtkApi,
  EndpointBuilder,
} from "@reduxjs/toolkit/query/react";
import { METHODS_TYPE } from "./api.types";

export type CreateCrudEndpointsConfig<TListRes = any> = {
  entity: string; // "Ticket"
  baseUrl: string; // "message/"
  idTag: string; // "Tickets"
  keepUnusedDataFor?: number;

  // opzionali
  enableSearch?: boolean;
  searchPath?: string;
  enableStats?: boolean;
  statsPath?: string;

  transformListResponse?: (res: any) => TListRes;

  /** permette di rinominare gli endpoint generati */
  endpointNameOverrides?: Partial<{
    getList: string; // default: get{EntityPlural?} → es. getTicket(s)
    getById: string; // default: get{Entity}ById
    create: string; // default: create{Entity}
    update: string; // default: update{Entity}
    delete: string; // default: delete{Entity}
    search: string; // default: search{Entity}
    getStats: string; // default: get{Entity}Stats
  }>;
};

type Builder = EndpointBuilder<
  BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError>,
  "LIST" | "ENTITY" | "STATS",
  "api"
>;

export function createCrudEndpoints<TItem, TListParams, TListRes = any>(
  builder: Builder,
  cfg: CreateCrudEndpointsConfig<TListRes>,
  apiSliceForOptimistic?: RtkApi<any, any, any, any>
) {
  const {
    entity,
    baseUrl,
    idTag,
    keepUnusedDataFor = 60,
    enableSearch,
    searchPath = "search",
    enableStats,
    statsPath = "stats",
    transformListResponse,
    endpointNameOverrides,
  } = cfg;

  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const ent = cap(entity);

  const names = {
    getList:
      endpointNameOverrides?.getList ??
      `get${ent}${ent.endsWith("s") ? "" : "s"}`,
    getById: endpointNameOverrides?.getById ?? `get${ent}ById`,
    create: endpointNameOverrides?.create ?? `create${ent}`,
    update: endpointNameOverrides?.update ?? `update${ent}`,
    delete: endpointNameOverrides?.delete ?? `delete${ent}`,
    search: endpointNameOverrides?.search ?? `search${ent}`,
    getStats: endpointNameOverrides?.getStats ?? `get${ent}Stats`,
  };

  const endpoints: Record<string, any> = {};

  // LIST
  endpoints[names.getList] = builder.query<TListRes, TListParams>({
    query: (params: any = {}) => {
      const clean = Object.entries(params).reduce((acc, [k, v]) => {
        if (v !== undefined && v !== null && v !== "") (acc as any)[k] = v;
        return acc;
      }, {} as Record<string, any>);
      return { url: baseUrl, params: clean };
    },
    providesTags: [
      { type: "LIST" as const, id: idTag },
      { type: "STATS" as const, id: idTag },
    ],
    keepUnusedDataFor,
    ...(transformListResponse
      ? { transformResponse: transformListResponse }
      : {}),
  });

  // BY ID
  endpoints[names.getById] = builder.query<TItem, number>({
    query: (id) => `${baseUrl}${id}/`,
    providesTags: (_r, _e, id) => [{ type: "ENTITY" as const, id }],
  });

  // CREATE
  endpoints[names.create] = builder.mutation<TItem, Partial<TItem>>({
    query: (body) => ({
      url: baseUrl,
      method: METHODS_TYPE.POST,
      body,
    }),
    invalidatesTags: [
      { type: "LIST" as const, id: idTag },
      { type: "STATS" as const, id: idTag },
    ],
  });

  // UPDATE (con optimistic patch opzionale)
  endpoints[names.update] = builder.mutation<
    TItem,
    { id: number; data: Partial<TItem> }
  >({
    query: ({ id, data }) => ({
      url: `${baseUrl}${id}/`,
      method: METHODS_TYPE.PUT,
      body: data,
    }),
    invalidatesTags: (_r, _e, { id }) => [
      { type: "ENTITY" as const, id },
      { type: "LIST" as const, id: idTag },
      { type: "STATS" as const, id: idTag },
    ],
    ...(apiSliceForOptimistic && {
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          (apiSliceForOptimistic as any).util.updateQueryData(
            names.getById,
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
  });

  // DELETE
  endpoints[names.delete] = builder.mutation<void, number>({
    query: (id) => ({
      url: `${baseUrl}${id}/`,
      method: METHODS_TYPE.DELETE,
    }),
    invalidatesTags: (_r, _e, id) => [
      { type: "ENTITY" as const, id },
      { type: "LIST" as const, id: idTag },
      { type: "STATS" as const, id: idTag },
    ],
  });

  // SEARCH (opzionale)
  if (enableSearch) {
    endpoints[names.search] = builder.query<
      TItem[],
      { query: string; limit?: number }
    >({
      query: ({ query, limit = 10 }) => ({
        url: `${baseUrl}${searchPath}`,
        params: { q: query, limit },
      }),
      providesTags: [{ type: "LIST" as const, id: idTag }],
    });
  }

  // STATS (opzionale)
  if (enableStats) {
    endpoints[names.getStats] = builder.query<any, void>({
      query: () => `${baseUrl}${statsPath}`,
      providesTags: [{ type: "STATS" as const, id: idTag }],
    });
  }

  return endpoints;
}
