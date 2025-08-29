import { apiSlice } from "@store_admin/apiSlice";
import type {
  TicketRead,
  TicketsQueryParams,
  ApiResponse,
  BulkActionRequest,
} from "./ticket.types";
import { createCrudEndpoints } from "../api.factory";

/**
 * Endpoint CRUD generati con NOMI specifici:
 *  - getTickets, getTicketById, createTicket, updateTicket, deleteTicket, getTicketStats
 * Extra: getAllTickets, bulkTickets
 *
 * Nota TS: i nomi generati dinamicamente non vengono tipizzati da RTK Query
 * quando si usa lo spread (...obj). Exportiamo quindi wrapper hooks tipizzati
 * "light" che delegano a ticketsApi.endpoints.<name>.* con un cast a any.
 */
export const ticketsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // CRUD via factory con override dei nomi
    ...createCrudEndpoints<
      TicketRead,
      TicketsQueryParams,
      ApiResponse<TicketRead>
    >(
      builder,
      {
        entity: "Ticket",
        baseUrl: "message/",
        idTag: "Tickets",
        keepUnusedDataFor: 60,
        enableStats: true,
        statsPath: "stats/",
        transformListResponse: (res: any): ApiResponse<TicketRead> => {
          if (!res?.meta || !Array.isArray(res?.data)) {
            throw new Error("Invalid tickets list response");
          }
          return res as ApiResponse<TicketRead>;
        },
        endpointNameOverrides: {
          getList: "getTickets",
          getById: "getTicketById",
          create: "createTicket",
          update: "updateTicket",
          delete: "deleteTicket",
          getStats: "getTicketStats",
        },
      },
      apiSlice // per optimistic patch su updateTicket
    ),

    // Tutti i ticket (no paginazione)
    getAllTickets: builder.query<TicketRead[], void>({
      query: () => "message/all/",
      providesTags: [{ type: "LIST" as const, id: "AllTickets" }],
    }),

    // Operazioni bulk
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
  }),
  overrideExisting: false,
});

// ATTENZIONE: questi wrapper delegano agli endpoint dinamici generati dalla factory.
// A runtime esistono sempre; il cast a `any` serve solo per “bucare” il limite di inferenza di TS.

export const useGetTicketsQuery = (params?: TicketsQueryParams) =>
  (ticketsApi.endpoints as any).getTickets.useQuery(params);

export const useGetTicketByIdQuery = (id: number, options?: any) =>
  (ticketsApi.endpoints as any).getTicketById.useQuery(id, options);

export const useCreateTicketMutation = () =>
  (ticketsApi.endpoints as any).createTicket.useMutation();

export const useUpdateTicketMutation = () =>
  (ticketsApi.endpoints as any).updateTicket.useMutation();

export const useDeleteTicketMutation = () =>
  (ticketsApi.endpoints as any).deleteTicket.useMutation();

export const useGetTicketStatsQuery = (arg?: void) =>
  (ticketsApi.endpoints as any).getTicketStats.useQuery(arg);

// Questi due sono statici (scritti esplicitamente), quindi li puoi esportare normalmente:
export const { useGetAllTicketsQuery, useBulkTicketsMutation } = ticketsApi;
