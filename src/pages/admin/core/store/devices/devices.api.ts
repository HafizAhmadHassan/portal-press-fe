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
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>
        );

        return {
          /*  url: 'devices/',
          params: cleanParams, */
          url: "joined-machines-gps/",
          params: cleanParams,
        };
      },
      providesTags: [
        { type: "LIST" as const, id: "Devices" },
        { type: "STATS" as const, id: "Devices" },
      ],

      transformResponse: (response: any) => {
        if (!response.meta || !Array.isArray(response.data)) {
          throw new Error("Invalid API response structure");
        }
        return response;
      },
    }),

    // NUOVO: Endpoint specifico per ottenere tutti i devices (per la mappa)
    getAllDevices: builder.query<Device[], { filters?: any }>({
      query: ({ filters = {} } = {}) => {
        const cleanParams = Object.entries(filters).reduce(
          (acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, any>
        );

        return {
          url: "joined-machines-gps/?all=true",
          params: cleanParams,
        };
      },
      /* providesTags: [{ type: 'LIST' as const, id: 'AllDevices' }], */
      providesTags: [{ type: "LIST" as const, id: "AllDevices" }],
      transformResponse: (response: { data: Device[] }) => {
        if (!Array.isArray(response.data)) {
          throw new Error("Invalid API response structure");
        }
        return response.data || []; // Assicurati che sia un array
      },
    }),

    getDeviceById: builder.query<Device, string>({
      query: (id) => `joined-machines-gps/${id}`,
      providesTags: (_result, _error, id) => [{ type: "ENTITY" as const, id }],
    }),

    // ✅ FIXED: Aggiunto trailing slash e debug del body
    createDevice: builder.mutation<Device, CreateDeviceRequest>({
      query: (body) => {
        console.log("RTK Query - Creating device with body:", body);
        console.log("RTK Query - Body type:", typeof body);
        console.log(
          "RTK Query - Body keys:",
          body ? Object.keys(body) : "NO KEYS"
        );
        console.log("RTK Query - Body JSON:", JSON.stringify(body, null, 2));

        if (!body) {
          console.error("RTK Query - BODY IS NULL OR UNDEFINED!");
          throw new Error("Body cannot be null or undefined");
        }

        if (!body.machine_name) {
          console.error("RTK Query - machine_name is missing!");
          throw new Error("machine_name is required");
        }

        return {
          url: "joined-machines-gps/", // ✅ Aggiunto trailing slash
          method: "POST",
          body,
          headers: {
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: [
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],
    }),

    updateDevice: builder.mutation<Device, UpdateDeviceRequest>({
      query: ({ id, data }) => {
        console.log("Updating device with data:", { id, data }); // Debug log
        return {
          url: `joined-machines-gps/${id}`, // ✅ RIMOSSO trailing slash per matchare backend
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],

      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getDeviceById", id, (draft) => {
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

    deleteDevice: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (id) => {
        console.log("Deleting device with id:", id); // Debug log
        return {
          url: `joined-machines-gps/${id}`, // ✅ RIMOSSO trailing slash per matchare backend
          method: "DELETE",
        };
      },
      invalidatesTags: (_result, _error, id) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],

      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patches: any[] = [];

        // Aggiorna cache devices paginati
        dispatch(
          apiSlice.util.updateQueryData("getDevices", {}, (draft: any) => {
            if (draft.data) {
              const deviceIndex = draft.data.findIndex(
                (device: Device) => device.id === id
              );
              if (deviceIndex !== -1) {
                draft.data.splice(deviceIndex, 1);

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

        // Aggiorna cache per tutti i devices
        dispatch(
          apiSlice.util.updateQueryData(
            "getAllDevices",
            undefined,
            (draft: Device[]) => {
              const deviceIndex = draft.findIndex(
                (device: Device) => device.id === id
              );
              if (deviceIndex !== -1) {
                draft.splice(deviceIndex, 1);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patches.forEach((patch) => patch.undo());
        }
      },
    }),

    toggleDeviceStatus: builder.mutation<
      Device,
      { id: string; status: number }
    >({
      query: ({ id, status }) => {
        console.log("Toggling device status:", { id, status }); // Debug log
        return {
          url: `joined-machines-gps/${id}`, // ✅ RIMOSSO trailing slash per matchare backend
          method: "PUT",
          body: { status },
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
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
      query: ({ id, blocked }) => {
        console.log("Toggling device block:", { id, blocked }); // Debug log
        return {
          url: `joined-machines-gps/${id}`, // ✅ RIMOSSO trailing slash per matchare backend
          method: "PUT",
          body: { status_machine_blocked: blocked },
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Devices" },
        { type: "LIST" as const, id: "AllDevices" },
        { type: "STATS" as const, id: "Devices" },
      ],
    }),

    updateDeviceWaste: builder.mutation<Device, { id: string; waste: string }>({
      query: ({ id, waste }) => {
        console.log("Updating device waste:", { id, waste }); // Debug log
        return {
          url: `joined-machines-gps/${id}`, // ✅ RIMOSSO trailing slash per matchare backend
          method: "PUT",
          body: { waste },
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
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

// Export degli hook generati
export const {
  useGetDevicesQuery,
  useGetAllDevicesQuery, // NUOVO hook per tutti i devices
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
