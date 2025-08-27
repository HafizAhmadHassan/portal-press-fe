// devices.types.ts - Versione finale con le chiavi esatte del backend

export interface Device {
  id: string;
  machine__Name: string;
  status: number; // 0 = inactive, 1 = active
  waste:
    | "Plastica"
    | "Secco"
    | "Umido"
    | "Vetro"
    | "Indifferenziato"
    | "Carta"
    | "vpl"
    | null;
  linux_Version?: string | null;
  start_Available?: string | null;
  end_Available?: string | null;
  street?: string | null;
  postal_Code?: string | null;
  province?: string | null;
  city?: string | null;
  country?: string | null;
  municipality?: string | null;
  address?: string | null;
  status_ready_d75_3_7: boolean;
  status_Machine_Blocked: boolean;
  codice_Gps?: string | null;
  sheet_Name?: string | null;
  customer_Name?: string | null;
  matricola_Bte?: string | null;
  matricola_Kgn?: string | null;
  customer?: string | null;
  ip_Router?: string | null;
  gps_x?: string | null;
  gps_y?: string | null;
  note?: string | null;
  created_At: string;
  updated_At: string;
}

export interface CreateDeviceRequest {
  machine__Name: string;
  status?: number;
  waste?:
    | "Plastica"
    | "Secco"
    | "Umido"
    | "Vetro"
    | "Indifferenziato"
    | "Carta"
    | "vpl";
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
  data: Partial<Omit<Device, "id" | "created_at" | "updated_at">>;
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
  sortOrder?: "asc" | "desc";
}

export interface BulkActionRequest {
  deviceIds: string[];
  action:
    | "activate"
    | "deactivate"
    | "block"
    | "unblock"
    | "delete"
    | "updateWaste";
  data?: {
    status?: number;
    status_machine_blocked?: boolean;
    waste?:
      | "Plastica"
      | "Secco"
      | "Umido"
      | "Vetro"
      | "Indifferenziato"
      | "Carta"
      | "vpl";
  };
}
