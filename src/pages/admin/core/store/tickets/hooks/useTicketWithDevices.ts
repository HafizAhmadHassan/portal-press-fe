// src/hooks/useTicketsWithDevices.ts
import { useMemo } from 'react';
import { useGetTicketsQuery } from '@store_admin/tickets/ticket.api';
import { useGetAllDevicesQuery } from '@store_admin/devices/devices.api';
import type { TicketsQueryParams, TicketRead } from '@store_admin/tickets/ticket.types';
import type { Device } from '@store_admin/devices/devices.types';
import {
  createNewTicket,
  updateExistingTicket,
  deleteExistingTicket,
  performBulkTicketAction,
} from '@store_admin/tickets/ticket.thunks';

export interface TicketWithDevice extends TicketRead {
  device?: Device;
}

export const useTicketsWithDevices = (params: TicketsQueryParams) => {
  // Ottieni i ticket
  const { 
    data: ticketsResponse, 
    isLoading: ticketsLoading, 
    error: ticketsError, 
    refetch: refetchTickets 
  } = useGetTicketsQuery(params);

  // Ottieni tutti i device
  const { 
    data: devices, 
    isLoading: devicesLoading, 
    error: devicesError 
  } = useGetAllDevicesQuery();

  // Combina ticket e device
  const ticketsWithDevices = useMemo(() => {
    if (!ticketsResponse?.data || !devices) {
      return [];
    }

    // Crea una mappa device_id -> device per lookup veloce
    const deviceMap = new Map<number, Device>();
    devices.forEach(device => {
      deviceMap.set(device.id, device);
    });

    // Arricchisci ogni ticket con i dati del device
    const enrichedTickets: TicketWithDevice[] = ticketsResponse.data.map(ticket => ({
      ...ticket,
      device: ticket.machine ? deviceMap.get(ticket.machine) : undefined,
    }));

    return enrichedTickets;
  }, [ticketsResponse?.data, devices]);

  const isLoading = ticketsLoading || devicesLoading;
  const error = ticketsError || devicesError;

  return {
    tickets: ticketsWithDevices,
    meta: ticketsResponse?.meta,
    isLoading,
    error,
    refetch: refetchTickets,
    createNewTicket,
    updateExistingTicket,
    deleteExistingTicket,
    performBulkTicketAction,
  };
};