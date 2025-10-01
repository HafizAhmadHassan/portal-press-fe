// @store_admin/devices/devices.api.ts
import { apiSlice } from "@store_admin/apiSlice";
import type {
  BulkActionRequest,
  CreateDeviceRequest,
  Device,
  DevicesQueryParams,
  UpdateDeviceRequest,
} from "./devices.types";

// Helper per normalizzare i record provenienti dal BE (es. rinomina municipility -> municipality)
type RawDevice = Device & { municipility?: string; municipality?: string };
interface DevicesMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
  next_page: number | null;
  prev_page: number | null;
}

const normalizeDevice = (raw: RawDevice): Device => {
  if (!raw || typeof raw !== "object") return raw as Device;
  if (raw.municipility !== undefined && raw.municipality === undefined) {
    const { municipility, ...rest } = raw as { municipility: string } & Omit<
      RawDevice,
      "municipility"
    >;
    return { ...(rest as Device), municipality: municipility };
  }
  return raw as Device;
};

// Type guard per risposta con meta & data
const isListResponse = (
  resp: unknown
): resp is { meta: DevicesMeta; data: RawDevice[] } => {
  if (typeof resp !== "object" || resp === null) return false;
  const maybe = resp as { meta?: unknown; data?: unknown };
  return (
    Array.isArray(maybe.data) &&
    typeof maybe.meta === "object" &&
    maybe.meta !== null
  );
};

export const devicesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * getDevices
     * Integra i filtri REST del BE:
     * - search: testo libero applicato a machine_Name, ip_Router, matricola (Bte/Kgn/Customer), address, municipility
     * - customer (FE) viene tradotto in customer_Name (BE)
     * - municipility (BE) viene normalizzato in municipality nel modello FE
     */
    getDevices: builder.query<
      { meta: DevicesMeta; data: Device[] },
      DevicesQueryParams
    >({
      query: (params = {}) => {
        const cleanParams: Record<string, string | number | boolean> = {};
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (key === "customer") {
              cleanParams["customer_Name"] = value as string | number | boolean;
            } else {
              cleanParams[key] = value as string | number | boolean;
            }
          }
        });
        return { url: "joined-machines-gps/", params: cleanParams };
      },
      providesTags: [
        { type: "LIST" as const, id: "Devices" },
        { type: "STATS" as const, id: "Devices" },
      ],
      transformResponse: (response: unknown) => {
        if (!isListResponse(response)) {
          throw new Error("Invalid API response structure");
        }
        return {
          meta: response.meta,
          data: response.data.map((d) => normalizeDevice(d)),
        };
      },
    }),

    getAllDevices: builder.query<
      Device[],
      { filters?: Partial<DevicesQueryParams> } | void
    >({
      query: (args) => {
        const filters = args && args.filters ? args.filters : {};
        const cleanParams: Record<string, string | number | boolean> = {};
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            if (key === "customer") {
              cleanParams["customer_Name"] = value as string | number | boolean;
            } else {
              cleanParams[key] = value as string | number | boolean;
            }
          }
        });
        return { url: "joined-machines-gps/?all=true", params: cleanParams };
      },
      providesTags: [{ type: "LIST" as const, id: "AllDevices" }],
      transformResponse: (response: { data: RawDevice[] }) => {
        if (!Array.isArray(response?.data)) {
          throw new Error("Invalid API response structure");
        }
        return (response.data || []).map((d) => normalizeDevice(d));
      },
    }),

    getDeviceById: builder.query<Device, number>({
      query: (id) => `joined-machines-gps/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "ENTITY" as const, id }],
    }),

    createDevice: builder.mutation<Device, CreateDeviceRequest>({
      query: (body) => {
        if (!body?.machine_Name) throw new Error("machine_Name is required");
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
          devicesApi.util.updateQueryData("getDeviceById", id, (draft) => {
            Object.assign(draft, data);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    deleteDevice: builder.mutation<
      { success: boolean; message: string },
      number
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
          devicesApi.util.updateQueryData("getDevices", {}, (draft) => {
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
          devicesApi.util.updateQueryData(
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
          patch1.undo();
          patch2.undo();
        }
      },
    }),

    toggleDeviceStatus: builder.mutation<
      Device,
      { id: number; status: number }
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
      { id: number; blocked: boolean }
    >({
      query: ({ id, blocked }) => ({
        url: `joined-machines-gps/${id}`,
        method: "PUT",
        body: { status_Machine_Blocked: blocked },
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],
    }),

    updateDeviceWaste: builder.mutation<Device, { id: number; waste: string }>({
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

    // Search: riusa l'endpoint principale con parametro 'search'. Non esiste endpoint separato lato BE.
    searchDevices: builder.query<
      Device[],
      { query: string; page_size?: number }
    >({
      query: ({ query, page_size = 10 }) => ({
        url: "joined-machines-gps/",
        params: { search: query, page: 1, page_size },
      }),
      transformResponse: (response: { data?: RawDevice[] } | RawDevice[]) => {
        if (Array.isArray(response)) {
          return response.map((d) => normalizeDevice(d));
        }
        if (
          response &&
          typeof response === "object" &&
          Array.isArray((response as { data?: RawDevice[] }).data)
        ) {
          return (response as { data: RawDevice[] }).data.map((d) =>
            normalizeDevice(d)
          );
        }
        return [];
      },
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

    getDeviceStats: builder.query<Record<string, unknown>, void>({
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
