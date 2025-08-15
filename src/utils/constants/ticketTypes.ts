export const TicketTypes = {
    MECCANICO: 'MECCANICO',
    BANCA_DATI: 'BANCA_DATI',
    IDRAULICO: 'IDRAULICO',
    ELETTRICO: 'ELETTRICO',
    ALTRO: 'ALTRO',
} as const;

export type TicketTypes = typeof TicketTypes[keyof typeof TicketTypes];