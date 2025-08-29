// _types/TicketWithDevice.types.ts - AGGIORNATO
export type CloseTicketData = {
  // Campi per il form interno
  id: number | string;
  date_Time?: Date;
  close_Description: string; // ← Questo diventerà "close_Description" nell'API
  info?: string;
  address?: string;
  inGaranzia?: boolean;
  fuoriGaranzia?: boolean;
  machine_retrival?: boolean;
  machine_not_repairable?: boolean;
  note?: string; // Per backward compatibility con il form
  open_Description?: string; // Per mostrare la descrizione originale
  customer_Name?: string; // Per mostrare il nome del cliente
};

// Nuovo tipo per l'API
export type CloseTicketApiPayload = {
  guanratee_status: string[]; // ["in_garanzia"] o ["fuori_garanzia"] o entrambi
  status: 2; // Sempre 2 per chiuso
  close_Description: string;
  machine: number;
  customer_Name: string;
};

// Funzione helper per convertire CloseTicketData in CloseTicketApiPayload
export const mapCloseTicketToApiPayload = (
  data: CloseTicketData,
  ticket: any // TicketWithDevice
): CloseTicketApiPayload => {
  // Costruisci guanratee_status array
  const guaranteeStatus: string[] = [];
  if (data.inGaranzia) guaranteeStatus.push("in_garanzia");
  if (data.fuoriGaranzia) guaranteeStatus.push("fuori_garanzia");

  return {
    guanratee_status: guaranteeStatus,
    status: 2,
    close_Description: data.close_Description || data.note || "",
    machine: ticket.machine || ticket.device?.id || Number(ticket.id),
    customer_Name: ticket.customer_Name || "",
  };
};
