// devices.types.ts - Versione finale con le chiavi esatte del backend

export interface Device {
  id: number;
  machine_Name: string;
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
  status_READY_D75_3_7: boolean;
  status_Machine_Blocked: boolean;
  codice_GPS?: string | null;
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
  machine_Name: string;
  status?: number;
  waste?:
    | "Plastica"
    | "Secco"
    | "Umido"
    | "Vetro"
    | "Indifferenziato"
    | "Carta"
    | "vpl";
  linux_Version?: string;
  start_Available?: string;
  end_Available?: string;
  street?: string;
  postal_Code?: string;
  province?: string;
  city?: string;
  country?: string;
  municipality?: string;
  address?: string;
  status_READY_D75_3_7?: boolean;
  status_Machine_Blocked?: boolean;
  codice_GPS?: string;
  sheet_Name?: string;
  customer_Name?: string;
  matricola_Bte?: string;
  matricola_Kgn?: string;
  customer?: string;
  ip_Router?: string;
  gps_x?: string;
  gps_y?: string;
  note?: string;
}

export interface UpdateDeviceRequest {
  id: number;
  data: Partial<Omit<Device, "id" | "created_At" | "updated_At">>;
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
  status_Machine_Blocked?: boolean | string;
  status_READY_D75_3_7?: boolean | string;
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
    status_Machine_Blocked?: boolean;
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
