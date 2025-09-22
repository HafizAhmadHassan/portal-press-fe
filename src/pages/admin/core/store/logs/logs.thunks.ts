// @store_admin/logs/logs.thunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";
import { logsApi } from "./logs.api";
import type { LogsQueryParams } from "./logs.types";
import { setItems, setPagination } from "./logs.slice";

export const loadLogs = createAsyncThunk(
  "logs/load",
  async (
    params: Partial<LogsQueryParams> = {},
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const { filters, pagination } = (state as any).logs;

      const query: LogsQueryParams = {
        page: params.page ?? pagination.page,
        page_size: params.page_size ?? pagination.limit,
        machine_ip: params.machine_ip ?? filters.machine_ip,
        code_alarm: params.code_alarm ?? filters.code_alarm,
        name_alarm: params.name_alarm ?? filters.name_alarm,
        date_from: params.date_from ?? filters.date_from,
        date_to: params.date_to ?? filters.date_to,
        search: params.search ?? filters.search,
        sortBy: params.sortBy ?? filters.sortBy,
        sortOrder: params.sortOrder ?? filters.sortOrder,
      };

      const res = await dispatch(
        logsApi.endpoints.getLogs.initiate(query)
      ).unwrap();

      dispatch(setItems(Array.isArray(res) ? res : res.data ?? []));

      if ((res as any).meta) {
        const m = (res as any).meta;
        dispatch(
          setPagination({
            page: m.page,
            limit: m.page_size,
            total: m.total,
            totalPages: m.total_pages,
          })
        );
      }

      return res;
    } catch (e: any) {
      return rejectWithValue(e?.data?.message || "Errore nel caricamento logs");
    }
  }
);
