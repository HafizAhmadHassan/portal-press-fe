// useMapDevices.ts - Hook personalizzato per gestire i devices nella mappa - CORRETTO

import { useMemo } from "react";
import { devicesApi } from "@store_admin/devices/devices.api.ts";

interface MapFilters {
  wasteType?: string;
  status?: number; // 0 = inactive, 1 = active, undefined = all
  isBlocked?: boolean;
  city?: string;
  customer?: string;
}

// Configurazione colori per i tipi di waste
const WASTE_COLORS = {
  Plastica: "#ffeb3b", // Giallo
  Secco: "#9e9e9e", // Grigio
  Umido: "#8bc34a", // Verde
  Vetro: "#2196f3", // Blu
  Indifferenziato: "#607d8b", // Blu grigio
  Carta: "#ff9800", // Arancione
  vpl: "#e91e63", // Rosa
} as const;

export const useMapDevices = (filters: MapFilters = {}) => {
  // Prepara i filtri per l'API - SICURO: gestisce undefined
  const apiFilters = useMemo(() => {
    const f: any = {};

    // Solo aggiungi i filtri se hanno valori validi
    if (filters.wasteType && filters.wasteType.trim()) {
      f.waste = filters.wasteType;
    }
    if (filters.status !== undefined && filters.status !== null) {
      f.status = filters.status;
    }
    if (filters.isBlocked !== undefined && filters.isBlocked !== null) {
      f.status_Machine_Blocked = filters.isBlocked;
    }
    if (filters.city && filters.city.trim()) {
      f.city = filters.city;
    }
    if (filters.customer && filters.customer.trim()) {
      f.customer = filters.customer;
    }

    return f;
  }, [filters]);

  // Query per tutti i devices con filtri applicati dal backend
  const {
    data: allDevices = [],
    isLoading,
    error,
    refetch,
  } = devicesApi.useGetAllDevicesQuery(
    { filters: apiFilters },
    {
      // IMPORTANTE: Evita loop infiniti
      refetchOnMountOrArgChange: true,
      skip: false, // Non skippa mai la query
    }
  );

  // Filtra ulteriormente i devices per quelli con GPS
  const devicesWithGPS = useMemo(() => {
    if (!Array.isArray(allDevices)) {
      return [];
    }

    const withGPS = allDevices.filter((device) => {
      const hasGPS =
        device.gps_x &&
        device.gps_y &&
        device.gps_x.toString().trim() !== "" &&
        device.gps_y.toString().trim() !== "";
      return hasGPS;
    });

    return withGPS;
  }, [allDevices]);

  // I device filtrati sono già quelli con GPS che rispettano i filtri del backend
  const filteredDevices = devicesWithGPS;

  // Raggruppa i devices per tipo di waste per la visualizzazione sulla mappa

  // Statistiche per la mappa (calcolate sui device filtrati dal backend)
  const mapStats = useMemo(() => {
    const stats = {
      total: filteredDevices.length,
      active: filteredDevices.filter((d) => d.status === 1).length,
      inactive: filteredDevices.filter((d) => d.status === 0).length,
      blocked: filteredDevices.filter((d) => d.status_Machine_Blocked === true)
        .length,
      ready: filteredDevices.filter((d) => d.status_READY_D75_3_7 === true)
        .length,
      byWaste: {} as Record<string, number>,
      byCities: {} as Record<string, number>,
      byCustomers: {} as Record<string, number>,
    };

    // Conta per tipo di waste
    filteredDevices.forEach((device) => {
      const waste = device.waste || "Unknown";
      stats.byWaste[waste] = (stats.byWaste[waste] || 0) + 1;

      if (device.city) {
        stats.byCities[device.city] = (stats.byCities[device.city] || 0) + 1;
      }

      if (device.customer) {
        stats.byCustomers[device.customer] =
          (stats.byCustomers[device.customer] || 0) + 1;
      }
    });

    return stats;
  }, [filteredDevices]);

  // Conteggi totali (tutti i dispositivi, non solo quelli filtrati)
  const totalDevicesCount = useMemo(() => {
    if (!Array.isArray(allDevices)) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        blocked: 0,
        ready: 0,
        plastic: 0,
        dry: 0,
        wet: 0,
        glass: 0,
        indifferenziato: 0,
        carta: 0,
        vpl: 0,
      };
    }

    return {
      total: allDevices.length,
      active: allDevices.filter((d) => d.status === 1).length,
      inactive: allDevices.filter((d) => d.status === 0).length,
      blocked: allDevices.filter((d) => d.status_Machine_Blocked === true)
        .length,
      ready: allDevices.filter((d) => d.status_READY_D75_3_7 === true).length,
      plastic: allDevices.filter((d) => d.waste === "Plastica").length,
      dry: allDevices.filter((d) => d.waste === "Secco").length,
      wet: allDevices.filter((d) => d.waste === "Umido").length,
      glass: allDevices.filter((d) => d.waste === "Vetro").length,
      indifferenziato: allDevices.filter((d) => d.waste === "Indifferenziato")
        .length,
      carta: allDevices.filter((d) => d.waste === "Carta").length,
      vpl: allDevices.filter((d) => d.waste === "vpl").length,
    };
  }, [allDevices]);

  return {
    // Dati
    allDevices,
    filteredDevices,

    // Statistiche
    totalDevicesCount,
    mapStats,

    // Stato
    isLoading,
    error,

    refetch,

    // Configurazione
    wasteColors: WASTE_COLORS,
  };
};

// Hook semplificato per componenti che vogliono solo i devices con GPS
export const useMapDevicesSimple = () => {
  const {
    data: allDevices = [],
    isLoading,
    error,
    refetch,
  } = devicesApi.useGetAllDevicesQuery({});

  const devicesWithGPS = useMemo(() => {
    if (!Array.isArray(allDevices)) {
      return [];
    }
    return allDevices.filter((device) => device.gps_x && device.gps_y);
  }, [allDevices]);

  return {
    devices: devicesWithGPS,
    isLoading,
    error,
    refetch,
  };
};
