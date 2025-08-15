import { apiSlice } from '@store_admin/apiSlice';
import type {
  TicketRead,
  TicketCreate,
  TicketUpdate,
  BulkActionRequest,
  TicketsQueryParams,
} from './ticket.types';
import type { Device } from '@store_admin/devices/devices.types';

// Tipo esteso per ticket con device incluso
export interface TicketWithDevice extends TicketRead {
  device?: Device;
}

export const ticketsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<{ data: TicketWithDevice[]; meta: any }, TicketsQueryParams>({
      query: (params = {}) => ({ url: 'messages/', params }),
      providesTags: [
        { type: 'LIST' as const, id: 'Tickets' },
        { type: 'STATS' as const, id: 'Tickets' },
      ],
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          // Prima ottieni i ticket
          const { data: ticketsResponse } = await queryFulfilled;
          
          // Poi ottieni tutti i device
          const devicesPromise = dispatch(apiSlice.endpoints.getAllDevices.initiate());
          const devicesResult = await devicesPromise;
          
          if (devicesResult.data) {
            // Crea una mappa device_id -> device per lookup veloce
            const deviceMap = new Map<number, Device>();
            devicesResult.data.forEach(device => {
              deviceMap.set(device.id, device);
            });

            // Arricchisci ogni ticket con i dati del device
            const ticketsWithDevices: TicketWithDevice[] = ticketsResponse.data.map(ticket => ({
              ...ticket,
              device: ticket.machine ? deviceMap.get(ticket.machine) : undefined,
            }));

            // Aggiorna la cache con i dati enriched
            dispatch(
              apiSlice.util.updateQueryData('getTickets', args, (draft) => {
                draft.data = ticketsWithDevices;
              })
            );
          }
        } catch (error) {
          console.error('Error enriching tickets with devices:', error);
        }
      },
    }),

    getAllTickets: builder.query<TicketWithDevice[], void>({
      query: () => 'messages/all/',
      providesTags: [{ type: 'LIST' as const, id: 'AllTickets' }],
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          // Prima ottieni i ticket
          const { data: ticketsResponse } = await queryFulfilled;
          
          // Poi ottieni tutti i device
          const devicesPromise = dispatch(apiSlice.endpoints.getAllDevices.initiate());
          const devicesResult = await devicesPromise;
          
          if (devicesResult.data) {
            // Crea una mappa device_id -> device per lookup veloce
            const deviceMap = new Map<number, Device>();
            devicesResult.data.forEach(device => {
              deviceMap.set(device.id, device);
            });

            // Arricchisci ogni ticket con i dati del device
            const ticketsWithDevices: TicketWithDevice[] = ticketsResponse.map(ticket => ({
              ...ticket,
              device: ticket.machine ? deviceMap.get(ticket.machine) : undefined,
            }));

            // Aggiorna la cache con i dati enriched
            dispatch(
              apiSlice.util.updateQueryData('getAllTickets', args, () => {
                return ticketsWithDevices;
              })
            );
          }
        } catch (error) {
          console.error('Error enriching all tickets with devices:', error);
        }
      },
    }),

    getTicketById: builder.query<TicketWithDevice, string>({
      query: (id) => `messages/${id}/`,
      providesTags: (_result, _error, id) => [{ type: 'ENTITY' as const, id }],
      async onQueryStarted(id, { queryFulfilled, dispatch }) {
        try {
          // Prima ottieni il ticket
          const { data: ticket } = await queryFulfilled;
          
          if (ticket.machine) {
            // Ottieni il device specifico
            const devicePromise = dispatch(apiSlice.endpoints.getDeviceById.initiate(ticket.machine.toString()));
            const deviceResult = await devicePromise;
            
            if (deviceResult.data) {
              // Aggiorna la cache con i dati del device
              dispatch(
                apiSlice.util.updateQueryData('getTicketById', id, (draft) => {
                  draft.device = deviceResult.data;
                })
              );
            }
          }
        } catch (error) {
          console.warn(`Device ${ticket?.machine} not found for ticket ${id}`, error);
        }
      },
    }),

    createTicket: builder.mutation<TicketRead, TicketCreate>({
      query: (body) => ({ url: 'messages/', method: 'POST', body }),
      invalidatesTags: [
        { type: 'LIST' as const, id: 'Tickets' },
        { type: 'LIST' as const, id: 'AllTickets' },
        { type: 'STATS' as const, id: 'Tickets' },
      ],
    }),

    updateTicket: builder.mutation<TicketRead, { id: string; data: TicketUpdate }>({
      query: ({ id, data }) => ({ url: `tickets/${id}/`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'ENTITY' as const, id },
        { type: 'LIST' as const, id: 'Tickets' },
        { type: 'LIST' as const, id: 'AllTickets' },
        { type: 'STATS' as const, id: 'Tickets' },
      ],
    }),

    deleteTicket: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({ url: `messages/${id}/`, method: 'DELETE' }),
      invalidatesTags: (_r, _e, id) => [
        { type: 'ENTITY' as const, id },
        { type: 'LIST' as const, id: 'Tickets' },
        { type: 'LIST' as const, id: 'AllTickets' },
        { type: 'STATS' as const, id: 'Tickets' },
      ],
    }),

    bulkTickets: builder.mutation<{ message: string; affectedCount: number }, BulkActionRequest>({
      query: (body) => ({ url: 'messages/bulk/', method: 'POST', body }),
      invalidatesTags: [
        { type: 'LIST' as const, id: 'Tickets' },
        { type: 'LIST' as const, id: 'AllTickets' },
        { type: 'STATS' as const, id: 'Tickets' },
      ],
    }),

    getTicketStats: builder.query<any, void>({
      query: () => 'messages/stats/',
      providesTags: [{ type: 'STATS' as const, id: 'Tickets' }],
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