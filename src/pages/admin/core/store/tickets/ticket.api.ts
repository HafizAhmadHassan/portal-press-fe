// @store_admin/tickets/ticket.api.ts
import { apiSlice } from "@store_admin/apiSlice";
import type {
  TicketRead,
  TicketUpdate,
  BulkActionRequest,
  TicketsQueryParams,
  MessageCreate,
} from "./ticket.types";
import { devicesApi } from "@store_admin/devices/devices.api";
import type { Device } from "@store_admin/devices/devices.types";

// Ridefiniamo TicketWithDevice per evitare conflitti di tipo
export interface TicketWithDevice extends Omit<TicketRead, "device"> {
  device?: Device; // Usa il tipo Device invece di DeviceInfo
}

export const ticketsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<
      { data: TicketWithDevice[]; meta: any },
      TicketsQueryParams
    >({
      query: (params = {}) => ({ url: "message/", params }),
      providesTags: [
        { type: "LIST" as const, id: "Tickets" },
        { type: "STATS" as const, id: "Tickets" },
      ],
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const { data: ticketsResponse } = await queryFulfilled;

          // usa devicesApi per garantire che l'endpoint esista
          const devicesResult = await dispatch(
            devicesApi.endpoints.getAllDevices.initiate()
          ).unwrap();

          if (devicesResult) {
            const deviceMap = new Map<number, Device>();
            devicesResult.forEach((d) => deviceMap.set(Number(d.id), d));

            const enriched: TicketWithDevice[] = ticketsResponse.data.map(
              (t) => ({
                ...t,
                device: t.machine ? deviceMap.get(t.machine) : undefined,
              })
            );

            dispatch(
              ticketsApi.util.updateQueryData(
                "getTickets",
                args,
                (draft: any) => {
                  draft.data = enriched;
                }
              )
            );
          }
        } catch (error) {
          console.error("Error enriching tickets with devices:", error);
        }
      },
    }),

    getAllTickets: builder.query<TicketWithDevice[], void>({
      query: () => "message/all/",
      providesTags: [{ type: "LIST" as const, id: "AllTickets" }],
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const ticketsResponse = await queryFulfilled;
          const devices = await dispatch(
            devicesApi.endpoints.getAllDevices.initiate()
          ).unwrap();

          if (devices) {
            const deviceMap = new Map<number, Device>();
            devices.forEach((d) => deviceMap.set(d.id, d));

            const enriched: TicketWithDevice[] = ticketsResponse.data.map(
              (t) => ({
                ...t,
                device: t.machine ? deviceMap.get(t.machine) : undefined,
              })
            );

            dispatch(
              ticketsApi.util.updateQueryData(
                "getAllTickets",
                args,
                () => enriched
              )
            );
          }
        } catch (error) {
          console.error("Error enriching all tickets with devices:", error);
        }
      },
    }),

    getTicketById: builder.query<TicketWithDevice, number>({
      query: (id) => `message/${id}/`,
      providesTags: (_r, _e, id) => [{ type: "ENTITY" as const, id }],
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        try {
          const { data: ticket } = await queryFulfilled;

          if (ticket?.machine) {
            const device = await dispatch(
              devicesApi.endpoints.getDeviceById.initiate(ticket.machine)
            ).unwrap();

            if (device) {
              dispatch(
                ticketsApi.util.updateQueryData(
                  "getTicketById",
                  id,
                  (draft: any) => {
                    draft.device = device;
                  }
                )
              );
            }
          }
        } catch (error) {
          console.warn(`Error while enriching ticket ${id} with device`, error);
        }
      },
    }),

    createTicket: builder.mutation<TicketRead, MessageCreate>({
      query: (body) => ({ url: "message/", method: "POST", body }),
      invalidatesTags: [
        { type: "LIST" as const, id: "Tickets" },
        { type: "LIST" as const, id: "AllTickets" },
        { type: "STATS" as const, id: "Tickets" },
      ],
    }),

    updateTicket: builder.mutation<
      TicketRead,
      { id: number; data: TicketUpdate }
    >({
      query: ({ id, data }) => ({
        url: `message/${id}/`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (_r, _e, { id }) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Tickets" },
        { type: "LIST" as const, id: "AllTickets" },
        { type: "STATS" as const, id: "Tickets" },
      ],
    }),

    deleteTicket: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `message/${id}/`, method: "DELETE" }),
      invalidatesTags: (_r, _e, id) => [
        { type: "ENTITY" as const, id },
        { type: "LIST" as const, id: "Tickets" },
        { type: "LIST" as const, id: "AllTickets" },
        { type: "STATS" as const, id: "Tickets" },
      ],
    }),

    bulkTickets: builder.mutation<
      { message: string; affectedCount: number },
      BulkActionRequest
    >({
      query: (body) => ({ url: "message/bulk/", method: "POST", body }),
      invalidatesTags: [
        { type: "LIST" as const, id: "Tickets" },
        { type: "LIST" as const, id: "AllTickets" },
        { type: "STATS" as const, id: "Tickets" },
      ],
    }),

    getTicketStats: builder.query<any, void>({
      query: () => "message/stats/",
      providesTags: [{ type: "STATS" as const, id: "Tickets" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTicketsQuery,
  useGetAllTicketsQuery,
  useGetTicketByIdQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useBulkTicketsMutation,
  useGetTicketStatsQuery,
} = ticketsApi;
