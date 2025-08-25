export type CustomerName = string;

export interface CustomersQueryParams {
  search?: string; // opzionale, se supportato dal backend
  q?: string; // alias opzionale
  limit?: number; // opzionale
}

// Nuove shape per robustezza
export type CustomersEnvelope = { customers: unknown };
export type CustomersWrappedResponse = CustomersEnvelope[]; // es: [{ customers: [ ... ] }
