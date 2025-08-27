// @store_admin/devices/devices.api.ts
import { apiSlice } from "@store_admin/apiSlice";
import type {
  BulkActionRequest,
  CreateDeviceRequest,
  Device,
  DevicesQueryParams,
  UpdateDeviceRequest,
} from "./devices.types";

export const devicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query<any, DevicesQueryParams>({
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
        return {
          url: "joined-machines-gps/",
          params: cleanParams,
        };
      },
      providesTags: [
        { type: "LIST" as const, id: "Devices" },
        { type: "STATS" as const, id: "Devices" },
      ],
      transformResponse: (response: any) => {
        if (!response?.meta || !Array.isArray(response?.data)) {
          throw new Error("Invalid API response structure");
        }
        return response;
      },
    }),

    getAllDevices: builder.query<Device[], { filters?: any } | void>({
      query: (args) => {
        const filters = args?.filters ?? {};
        const cleanParams = Object.entries(filters).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              (acc as any)[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>
        );
        return { url: "joined-machines-gps/?all=true", params: cleanParams };
      },
      providesTags: [{ type: "LIST" as const, id: "AllDevices" }],
      transformResponse: (response: { data: Device[] }) => {
        if (!Array.isArray(response?.data)) {
          throw new Error("Invalid API response structure");
        }
        return response.data || [];
      },
    }),

    getDeviceById: builder.query<Device, string>({
      query: (id) => `joined-machines-gps/${id}`,
      providesTags: (_r, _e, id) => [{ type: "ENTITY" as const, id }],
    }),

    createDevice: builder.mutation<Device, CreateDeviceRequest>({
      query: (body) => {
        if (!body?.machine__Name) throw new Error("machine__Name is required");
        return {
          url: "joined-machines-gps/",
          method: "POST",
          body,
          headers: { "Content-Type": "application/json" },
        };
      },
      invalidatesTags: [
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],
    }),

    updateDevice: builder.mutation<Device, UpdateDeviceRequest>({
      query: ({ id, data }) => ({
        url: `joined-machines-gps/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          apiSlice.util.updateQueryData("getDeviceById", id, (draft: any) => {
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

    deleteDevice: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => ({ url: `joined-machines-gps/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch1 = dispatch(
          apiSlice.util.updateQueryData("getDevices", {}, (draft: any) => {
            if (draft?.data) {
              const i = draft.data.findIndex((d: Device) => d.id === id);
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
          })
        );

        const patch2 = dispatch(
          apiSlice.util.updateQueryData(
            "getAllDevices",
            undefined,
            (draft: Device[]) => {
              const i = draft.findIndex((d) => d.id === id);
              if (i !== -1) draft.splice(i, 1);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          (patch1 as any).undo?.();
          (patch2 as any).undo?.();
        }
      },
    }),

    toggleDeviceStatus: builder.mutation<
      Device,
      { id: string; status: number }
    >({
      query: ({ id, status }) => ({
        url: `joined-machines-gps/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],
    }),

    toggleDeviceBlock: builder.mutation<
      Device,
      { id: string; blocked: boolean }
    >({
      query: ({ id, blocked }) => ({
        url: `joined-machines-gps/${id}`,
        method: "PUT",
        body: { status_machine_blocked: blocked },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],
    }),

    updateDeviceWaste: builder.mutation<Device, { id: string; waste: string }>({
      query: ({ id, waste }) => ({
        url: `joined-machines-gps/${id}`,
        method: "PUT",
        body: { waste },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],
    }),

    searchDevices: builder.query<Device[], { query: string; limit?: number }>({
      query: ({ query, limit = 10 }) => ({
        url: "joined-machines-gps/search/",
        params: { q: query, limit },
      }),
      providesTags: [{ type: "LIST" as const, id: "Devices" }],
    }),

    bulkActions: builder.mutation<
      { message: string; affectedCount: number },
      BulkActionRequest
    >({
      query: (body) => ({
        url: "joined-machines-gps/bulk/",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],
    }),

    getDeviceStats: builder.query<any, void>({
      query: () => "joined-machines-gps/stats/summary/",
      providesTags: [{ type: "STATS" as const, id: "Devices" }],
    }),

    exportDevices: builder.mutation<Blob, DevicesQueryParams>({
      query: (params) => ({
        url: "joined-machines-gps/export/",
        method: "POST",
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetDevicesQuery,
  useGetAllDevicesQuery,
  useGetDeviceByIdQuery,
  useCreateDeviceMutation,
  useUpdateDeviceMutation,
  useDeleteDeviceMutation,
  useToggleDeviceStatusMutation,
  useToggleDeviceBlockMutation,
  useUpdateDeviceWasteMutation,
  useBulkActionsMutation,
  useGetDeviceStatsQuery,
  useSearchDevicesQuery,
  useExportDevicesMutation,
} = devicesApi;
