// devices.types.ts - Versione finale con le chiavi esatte del backend

export interface Device {
  id: string;
  machine_name: string;
  status: number; // 0 = inactive, 1 = active
  waste: 'Plastica' | 'Secco' | 'Umido' | 'Vetro' | 'Indifferenziato' | 'Carta' | 'vpl' | null;
  linux_version?: string | null;
  start_available?: string | null;
  end_available?: string | null;
  street?: string | null;
  postal_code?: string | null;
  province?: string | null;
  city?: string | null;
  country?: string | null;
  municipality?: string | null;
  address?: string | null;
  status_ready_d75_3_7: boolean;
  status_machine_blocked: boolean;
  codice_gps?: string | null;
  sheet_name?: string | null;
  customer_name?: string | null;
  matricola_bte?: string | null;
  matricola_kgn?: string | null;
  customer?: string | null;
  ip_router?: string | null;
  gps_x?: string | null;
  gps_y?: string | null;
  note?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDeviceRequest {
  machine_name: string;
  status?: number;
  waste?: 'Plastica' | 'Secco' | 'Umido' | 'Vetro' | 'Indifferenziato' | 'Carta' | 'vpl';
  linux_version?: string;
  start_available?: string;
  end_available?: string;
  street?: string;
  postal_code?: string;
  province?: string;
  city?: string;
  country?: string;
  municipality?: string;
  address?: string;
  status_ready_d75_3_7?: boolean;
  status_machine_blocked?: boolean;
  codice_gps?: string;
  sheet_name?: string;
  customer_name?: string;
  matricola_bte?: string;
  matricola_kgn?: string;
  customer?: string;
  ip_router?: string;
  gps_x?: string;
  gps_y?: string;
  note?: string;
}

export interface UpdateDeviceRequest {
  id: string;
  data: Partial<Omit<Device, 'id' | 'created_at' | 'updated_at'>>;
}

export interface DevicesQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  waste?: string;
  status?: number | string;
  city?: string;
  province?: string;
  customer?: string;
  status_machine_blocked?: boolean | string;
  status_ready_d75_3_7?: boolean | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkActionRequest {
  deviceIds: string[];
  action: 'activate' | 'deactivate' | 'block' | 'unblock' | 'delete' | 'updateWaste';
  data?: {
    status?: number;
    status_machine_blocked?: boolean;
    waste?: 'Plastica' | 'Secco' | 'Umido' | 'Vetro' | 'Indifferenziato' | 'Carta' | 'vpl';
  };
}
