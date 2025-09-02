// @store/_shared/thunkFactory.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ApiMeta } from "./api.types";

/**
 * Config dei nomi endpoint in RTK Query (dinamici)
 * Es: { list: "getPlc", create: "createPlc", update: "updatePlc", delete: "deletePlc", search: "searchPlc" }
 */
export type CrudEndpointKeys = {
  list: string;
  create: string;
  update: string;
  delete: string;
  search?: string;
};

export type MetaFromApi = {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
};

export type SliceActions<TItem> = {
  setItems: (payload: TItem[]) => any;
  setPagination?: (payload: ApiMeta) => any;
  setLoading?: (payload: boolean) => any;
  setError?: (payload: string | null) => any;
};

export type Selectors<State, TFilters> = {
  selectFilters: (s: State) => TFilters;
  selectPagination: (s: State) => { page: number; page_size: number };
};

export type ApiCaller = {
  endpoints: Record<
    string,
    {
      initiate: (args?: any) => any; // .unwrap() supportato da RTKQ
    }
  >;
};

export type ListResponse<TItem> = {
  data: TItem[];
  meta?: MetaFromApi;
};

export type CrudFactoryConfig<State, TItem, TListParams> = {
  /** RTK Query API slice (es. plcApi) */
  api: ApiCaller;
  /** Nomi degli endpoint nel tuo api slice */
  endpointKeys: CrudEndpointKeys;

  /** Azioni del tuo slice redux (setItems, setPagination...) */
  sliceActions: SliceActions<TItem>;

  /** Selectors per filters/pagination nello store */
  selectors: Selectors<State, any>;

  /**
   * Costruisce i parametri per la list a partire da filters/pagination nello store
   * + eventuali override passati a load()
   */
  mapStateToListParams: (
    filters: any,
    pagination: { page: number; page_size: number },
    custom?: Partial<TListParams>
  ) => TListParams;

  /**
   * Estrae items e meta dalla response API.
   * Default: { items: res.data ?? [], meta: res.meta }
   */
  extractFromListResponse?: (res: any) => {
    items: TItem[];
    meta?: MetaFromApi;
  };
};

export function createCrudThunks<
  State,
  TItem,
  TListParams,
  TSearchParams = any
>(cfg: any /*  CrudFactoryConfig<State, TItem, TListParams, TSearchParams> */) {
  const {
    api,
    endpointKeys,
    sliceActions,
    selectors,
    mapStateToListParams,
    extractFromListResponse = (res: any) => ({
      items: Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [],
      meta: res?.meta,
    }),
  } = cfg;

  // --- LOAD (lista con filtri/paginazione correnti o override) ---
  const load = createAsyncThunk<
    any,
    Partial<TListParams> | void,
    { state: State }
  >(
    `${endpointKeys.list}/load`,
    async (customParams, { getState, dispatch, rejectWithValue }) => {
      try {
        sliceActions.setLoading?.(true);

        const state = getState();
        const filters = selectors.selectFilters(state);
        const pag = selectors.selectPagination(state);

        const params: TListParams = mapStateToListParams(
          filters,
          pag,
          customParams as any
        );

        const res = await dispatch(
          (api.endpoints as any)[endpointKeys.list].initiate(params)
        ).unwrap();

        const { items, meta } = extractFromListResponse(res);
        dispatch(sliceActions.setItems(items));

        if (meta && sliceActions.setPagination) {
          dispatch(
            sliceActions.setPagination({
              page: meta.page,
              page_size: meta.page_size,
              total: meta.total,
              total_pages: meta.total_pages,
              has_next: false,
              has_prev: false,
              next_page: 0,
              prev_page: 0,
            })
          );
        }

        sliceActions.setLoading?.(false);
        return res;
      } catch (error: any) {
        const message = error?.data?.message || "Errore nel caricamento";
        sliceActions.setError?.(message);
        sliceActions.setLoading?.(false);
        return rejectWithValue(message);
      }
    }
  );

  // --- REFRESH (riusa filtri/paginazione correnti) ---
  const refresh = createAsyncThunk<void, void, { state: State }>(
    `${endpointKeys.list}/refresh`,
    async (_: void, { dispatch }) => {
      await dispatch(load());
    }
  );

  // --- CREATE (post) + reload lista ---
  const create = createAsyncThunk<any, Partial<TItem>, { state: State }>(
    `${endpointKeys.create}/create`,
    async (data, { dispatch, rejectWithValue }) => {
      try {
        const created = await dispatch(
          (api.endpoints as any)[endpointKeys.create].initiate(data)
        ).unwrap();

        await dispatch(load());
        return created;
      } catch (error: any) {
        const message = error?.data?.message || "Errore creazione";
        return rejectWithValue(message);
      }
    }
  );

  // --- UPDATE (put/patch) — non forza il reload: ci pensa cache invalidation/optimistic ---
  const update = createAsyncThunk<
    any,
    { id: number; data: Partial<TItem> },
    { state: State }
  >(
    `${endpointKeys.update}/update`,
    async (payload, { dispatch, rejectWithValue }) => {
      try {
        const updated = await dispatch(
          (api.endpoints as any)[endpointKeys.update].initiate(payload)
        ).unwrap();

        return updated;
      } catch (error: any) {
        const message = error?.data?.message || "Errore aggiornamento";
        return rejectWithValue(message);
      }
    }
  );

  // --- DELETE + reload lista ---
  const remove = createAsyncThunk<number, number, { state: State }>(
    `${endpointKeys.delete}/delete`,
    async (id, { dispatch, rejectWithValue }) => {
      try {
        await dispatch(
          (api.endpoints as any)[endpointKeys.delete].initiate(id)
        ).unwrap();
        await dispatch(load());
        return id;
      } catch (error: any) {
        const message = error?.data?.message || "Errore eliminazione";
        return rejectWithValue(message);
      }
    }
  );

  // --- SEARCH (endpoint dedicato, opzionale) ---
  const search = endpointKeys.search
    ? createAsyncThunk<any, TSearchParams, { state: State }>(
        `${endpointKeys.search}/search`,
        async (params, { dispatch, rejectWithValue }) => {
          try {
            const results = await dispatch(
              (api.endpoints as any)[endpointKeys.search!].initiate(params)
            ).unwrap();
            return results;
          } catch (error: any) {
            const message = error?.data?.message || "Errore ricerca";
            return rejectWithValue(message);
          }
        }
      )
    : undefined;

  return { load, refresh, create, update, remove, search };
}
