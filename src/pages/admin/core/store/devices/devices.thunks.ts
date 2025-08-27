import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@store_admin/store.ts";
import type {
  BulkActionRequest,
  CreateDeviceRequest,
  DevicesQueryParams,
  UpdateDeviceRequest,
} from "@store_admin/devices/devices.types.ts";
import { devicesApi } from "@store_admin/devices/devices.api.ts";
import {
  setAllDevices,
  setDevices,
  setPagination,
} from "@store_admin/devices/devices.slice.ts";

export const loadDevices = createAsyncThunk(
  "devices/load",
  async (
    params: Partial<DevicesQueryParams> = {},
    { getState, dispatch, rejectWithValue }
  ) => {
    try {
      const state = getState() as RootState;
      const { filters: currentFilters, pagination: currentPagination } =
        state.devices;

      const queryParams: DevicesQueryParams = {
        page: params.page ?? currentPagination.page,
        page_size: params.page_size ?? currentPagination.limit,
        search: params.search ?? currentFilters.search,
        waste: params.waste ?? currentFilters.waste,
        status: params.status ?? currentFilters.status,
        city: params.city ?? currentFilters.city,
        province: params.province ?? currentFilters.province,
        customer: params.customer ?? currentFilters.customer,
        status_Machine_Blocked:
          params.status_Machine_Blocked ?? currentFilters.statusMachineBlocked,
        status_ready_d75_3_7:
          params.status_ready_d75_3_7 ?? currentFilters.statusReadyD75_3_7,
        sortBy: params.sortBy ?? currentFilters.sortBy,
        sortOrder: params.sortOrder ?? currentFilters.sortOrder,
      };

      const response = await dispatch(
        devicesApi.endpoints.getDevices.initiate(queryParams)
      ).unwrap();

      dispatch(setDevices(response.data ?? response));

      if (response.pagination) {
        dispatch(setPagination(response.pagination));
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel caricamento devices"
      );
    }
  }
);

// NUOVO: Thunk per caricare tutti i devices (per la mappa)
export const loadAllDevices = createAsyncThunk(
  "devices/loadAll",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const allDevices = await dispatch(
        devicesApi.endpoints.getAllDevices.initiate()
      ).unwrap();

      dispatch(setAllDevices(allDevices));

      return allDevices;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel caricamento di tutti i devices"
      );
    }
  }
);

export const searchDevices = createAsyncThunk(
  "devices/search",
  async (searchQuery: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        loadDevices({
          search: searchQuery,
          page: 1,
        })
      ).unwrap();

      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Errore nella ricerca");
    }
  }
);

export const createNewDevice = createAsyncThunk(
  "devices/create",
  async (deviceData: CreateDeviceRequest, { dispatch, rejectWithValue }) => {
    try {
      console.log("THUNK - Creating device with data:", deviceData);
      console.log("THUNK - DeviceData type:", typeof deviceData);
      console.log(
        "THUNK - DeviceData keys:",
        deviceData ? Object.keys(deviceData) : "NO KEYS"
      );

      if (!deviceData) {
        console.error("THUNK - deviceData is null or undefined!");
        return rejectWithValue("Device data is required");
      }

      if (!deviceData.machine__Name) {
        console.error("THUNK - machine__Name is missing from deviceData!");
        return rejectWithValue("machine__Name is required");
      }

      // ✅ Assicurati che il payload abbia tutti i campi richiesti
      const payload: CreateDeviceRequest = {
        machine__Name: deviceData.machine__Name,
        status: deviceData.status ?? 1,
        waste: deviceData.waste || null,
        linux_Version: deviceData.linux_Version || null,
        start_Available: deviceData.start_Available || null,
        end_Available: deviceData.end_Available || null,
        street: deviceData.street || null,
        postal_Code: deviceData.postal_Code || null,
        province: deviceData.province || null,
        city: deviceData.city || null,
        country: deviceData.country || null,
        municipality: deviceData.municipality || null,
        address: deviceData.address || null,
        status_ready_d75_3_7: deviceData.status_ready_d75_3_7 ?? false,
        status_Machine_Blocked: deviceData.status_Machine_Blocked ?? false,
        codice_Gps: deviceData.codice_Gps || null,
        sheet_Name: deviceData.sheet_Name || null,
        customer_Name: deviceData.customer_Name || null,
        matricola_Bte: deviceData.matricola_Bte || null,
        matricola_Kgn: deviceData.matricola_Kgn || null,
        customer: deviceData.customer || null,
        ip_Router: deviceData.ip_Router || null,
        gps_x: deviceData.gps_x || null,
        gps_y: deviceData.gps_y || null,
        note: deviceData.note || null,
      };

      console.log("THUNK - Final payload:", payload);
      console.log(
        "THUNK - Final payload JSON:",
        JSON.stringify(payload, null, 2)
      );

      const newDevice = await dispatch(
        devicesApi.endpoints.createDevice.initiate(payload)
      ).unwrap();

      console.log("THUNK - Device created successfully:", newDevice);

      // Ricarica sia i devices paginati che tutti i devices
      await dispatch(loadDevices());
      await dispatch(loadAllDevices());

      return newDevice;
    } catch (error: any) {
      console.error("THUNK - Error creating device:", error);
      console.error("THUNK - Error details:", JSON.stringify(error, null, 2));
      return rejectWithValue(
        error.data?.message || error.message || "Errore nella creazione device"
      );
    }
  }
);

export const updateExistingDevice = createAsyncThunk(
  "devices/update",
  async (updateData: UpdateDeviceRequest, { dispatch, rejectWithValue }) => {
    try {
      console.log("Updating device with data:", updateData); // Debug log

      // ✅ Pulisci i dati di update rimuovendo campi undefined/null/empty
      const cleanData = Object.entries(updateData.data).reduce(
        (acc, [key, value]) => {
          // Mantieni i valori boolean anche se false
          if (
            typeof value === "boolean" ||
            (value !== undefined && value !== null && value !== "")
          ) {
            acc[key] = value;
          }
          return acc;
        },
        {} as any
      );

      const payload = {
        id: updateData.id,
        data: cleanData,
      };

      console.log("Final update payload:", payload); // Debug log

      const updatedDevice = await dispatch(
        devicesApi.endpoints.updateDevice.initiate(payload)
      ).unwrap();

      // Ricarica sia i devices paginati che tutti i devices
      await dispatch(loadDevices());
      await dispatch(loadAllDevices());

      return updatedDevice;
    } catch (error: any) {
      console.error("Error updating device:", error); // Debug log
      return rejectWithValue(
        error.data?.message || "Errore nell'aggiornamento device"
      );
    }
  }
);

export const deleteExistingDevice = createAsyncThunk(
  "devices/delete",
  async (deviceId: string, { dispatch, rejectWithValue }) => {
    try {
      await dispatch(
        devicesApi.endpoints.deleteDevice.initiate(deviceId)
      ).unwrap();

      // Ricarica sia i devices paginati che tutti i devices
      await dispatch(loadDevices());
      await dispatch(loadAllDevices());

      return deviceId;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nell'eliminazione device"
      );
    }
  }
);

export const toggleDeviceStatus = createAsyncThunk(
  "devices/toggleStatus",
  async (
    { deviceId, status }: { deviceId: string; status: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const updatedDevice = await dispatch(
        devicesApi.endpoints.toggleDeviceStatus.initiate({
          id: deviceId,
          status,
        })
      ).unwrap();

      return updatedDevice;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel cambio stato device"
      );
    }
  }
);

export const toggleDeviceBlock = createAsyncThunk(
  "devices/toggleBlock",
  async (
    { deviceId, blocked }: { deviceId: string; blocked: boolean },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const updatedDevice = await dispatch(
        devicesApi.endpoints.toggleDeviceBlock.initiate({
          id: deviceId,
          blocked,
        })
      ).unwrap();

      return updatedDevice;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel blocco/sblocco device"
      );
    }
  }
);

export const updateDeviceWasteType = createAsyncThunk(
  "devices/updateWaste",
  async (
    { deviceId, waste }: { deviceId: string; waste: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const updatedDevice = await dispatch(
        devicesApi.endpoints.updateDeviceWaste.initiate({ id: deviceId, waste })
      ).unwrap();

      return updatedDevice;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nell'aggiornamento tipo rifiuto"
      );
    }
  }
);

export const performBulkAction = createAsyncThunk(
  "devices/bulkAction",
  async (request: BulkActionRequest, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        devicesApi.endpoints.bulkActions.initiate(request)
      ).unwrap();

      // Ricarica sia i devices paginati che tutti i devices
      await dispatch(loadDevices());
      await dispatch(loadAllDevices());

      return {
        ...response,
        action: request.action,
        affectedDeviceIds: request.deviceIds,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nell'operazione bulk"
      );
    }
  }
);

export const changePage = createAsyncThunk(
  "devices/changePage",
  async (page: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(loadDevices({ page })).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Errore nel cambio pagina");
    }
  }
);

export const changePageSize = createAsyncThunk(
  "devices/changePageSize",
  async (pageSize: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        loadDevices({
          page_size: pageSize,
          page: 1,
        })
      ).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel cambio dimensione pagina"
      );
    }
  }
);

export const applyFilters = createAsyncThunk(
  "devices/applyFilters",
  async (
    filters: Partial<DevicesQueryParams>,
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await dispatch(
        loadDevices({
          ...filters,
          page: 1,
        })
      ).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nell'applicazione filtri"
      );
    }
  }
);

export const resetFilters = createAsyncThunk(
  "devices/resetFilters",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        loadDevices({
          page: 1,
          search: "",
          waste: "",
          status: undefined,
          city: "",
          province: "",
          customer: "",
          status_Machine_Blocked: undefined,
          status_ready_d75_3_7: undefined,
          sortBy: "createdAt",
          sortOrder: "desc",
        })
      ).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.data?.message || "Errore nel reset filtri");
    }
  }
);

export const filterByWasteType = createAsyncThunk(
  "devices/filterByWaste",
  async (wasteType: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        loadDevices({
          waste: wasteType,
          page: 1,
        })
      ).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel filtro per tipo rifiuto"
      );
    }
  }
);

export const filterByCity = createAsyncThunk(
  "devices/filterByCity",
  async (city: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        loadDevices({
          city: city,
          page: 1,
        })
      ).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel filtro per città"
      );
    }
  }
);

export const filterByCustomer = createAsyncThunk(
  "devices/filterByCustomer",
  async (customer: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        loadDevices({
          customer: customer,
          page: 1,
        })
      ).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel filtro per cliente"
      );
    }
  }
);

export const filterByStatus = createAsyncThunk(
  "devices/filterByStatus",
  async (status: number, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        loadDevices({
          status: status,
          page: 1,
        })
      ).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel filtro per stato"
      );
    }
  }
);

export const filterByBlockStatus = createAsyncThunk(
  "devices/filterByBlock",
  async (blocked: boolean, { dispatch, rejectWithValue }) => {
    try {
      const response = await dispatch(
        loadDevices({
          status_Machine_Blocked: blocked,
          page: 1,
        })
      ).unwrap();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.data?.message || "Errore nel filtro per stato blocco"
      );
    }
  }
);
