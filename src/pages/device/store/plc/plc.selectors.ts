// @store_device/plc/plc.selectors.ts
import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@root/store";
import type { PlcItem, PlcData, PlcIo, PlcStatus } from "./plc.types";

/** Selettore base dello stato PLC */
export const selectPlcState = (state: RootState) => state.plc;

/** Lista completa di tutti i PLC items */
export const selectAllPlc = createSelector(
  [selectPlcState],
  (state) => state.items || []
);

/** Item PLC correntemente selezionato */
export const selectSelectedPlc = createSelector(
  [selectPlcState],
  (state) => state.selected
);

/** Stato di loading */
export const selectPlcLoading = createSelector(
  [selectPlcState],
  (state) => state.isLoading
);

/** Errore corrente */
export const selectPlcError = createSelector(
  [selectPlcState],
  (state) => state.error
);

/** Informazioni di paginazione */
export const selectPlcPagination = createSelector(
  [selectPlcState],
  (state) => state.pagination
);

/** Filtri correnti */
export const selectPlcFilters = createSelector(
  [selectPlcState],
  (state) => state.filters
);

/** --- SELETTORI PER I BLOCCHI DATI --- */

/** Tutti i plc_data */
export const selectAllPlcData = createSelector([selectAllPlc], (items) =>
  items.map((item) => item.plc_data).filter(Boolean)
);

/** Tutti i plc_io */
export const selectAllPlcIo = createSelector([selectAllPlc], (items) =>
  items.map((item) => item.plc_io).filter(Boolean)
);

/** Tutti i plc_status */
export const selectAllPlcStatus = createSelector([selectAllPlc], (items) =>
  items.map((item) => item.plc_status).filter(Boolean)
);

/** --- SELETTORI BY ID --- */

/** Utility per ottenere l'argomento ID */
const getIdArg = (_: RootState, id: number) => id;

/** PlcItem by id (cerca in tutti e 3 i blocchi) */
export const selectPlcItemById = createSelector(
  [selectAllPlc, getIdArg],
  (items: PlcItem[], id: number) =>
    items.find(
      (item) =>
        item?.plc_data?.id === id ||
        item?.plc_status?.id === id ||
        item?.plc_io?.id === id
    ) || null
);

/** plc_data by id */
export const selectPlcDataById = createSelector(
  [selectAllPlc, getIdArg],
  (items, id) =>
    items.find((item) => item?.plc_data?.id === id)?.plc_data || null
);

/** plc_io by id */
export const selectPlcIoById = createSelector(
  [selectAllPlc, getIdArg],
  (items, id) => items.find((item) => item?.plc_io?.id === id)?.plc_io || null
);

/** plc_status by id */
export const selectPlcStatusById = createSelector(
  [selectAllPlc, getIdArg],
  (items, id) =>
    items.find((item) => item?.plc_status?.id === id)?.plc_status || null
);

/** --- SELETTORI DERIVATI E STATISTICS --- */

/** Numero totale di PLC */
export const selectPlcCount = createSelector(
  [selectAllPlc],
  (items) => items.length
);

/** PLC filtrati in base alla ricerca corrente */
export const selectFilteredPlc = createSelector(
  [selectAllPlc, selectPlcFilters],
  (items, filters) => {
    if (!filters.search) return items;

    const searchTerm = filters.search.toLowerCase();
    return items.filter((item) => {
      const searchInObject = (obj: Record<string, any>) =>
        Object.values(obj).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        );

      return (
        searchInObject(item.plc_data || {}) ||
        searchInObject(item.plc_io || {}) ||
        searchInObject(item.plc_status || {})
      );
    });
  }
);

/** Statistiche PLC */
export const selectPlcStats = createSelector([selectAllPlc], (items) => {
  const stats = {
    total: items.length,
    online: 0,
    offline: 0,
    unknown: 0,
    withData: 0,
    withIo: 0,
    withStatus: 0,
  };

  items.forEach((item) => {
    // Conta items con dati
    if (item.plc_data && Object.keys(item.plc_data).length > 1) {
      stats.withData++;
    }
    if (item.plc_io && Object.keys(item.plc_io).length > 1) {
      stats.withIo++;
    }
    if (item.plc_status && Object.keys(item.plc_status).length > 1) {
      stats.withStatus++;
    }

    // Determina status online/offline (personalizza la logica)
    const isOnline =
      item.plc_status?.online === true ||
      item.plc_status?.connected === 1 ||
      item.plc_data?.status === 1;

    if (isOnline === true) {
      stats.online++;
    } else if (isOnline === false) {
      stats.offline++;
    } else {
      stats.unknown++;
    }
  });

  return stats;
});

/** PLC con errori o problemi */
export const selectPlcWithIssues = createSelector([selectAllPlc], (items) =>
  items.filter((item) => {
    // Personalizza la logica per identificare problemi
    return (
      item.plc_status?.error === true ||
      item.plc_status?.maintenance_mode === 1 ||
      item.plc_data?.fault === 1
    );
  })
);

/** PLC online */
export const selectOnlinePlc = createSelector([selectAllPlc], (items) =>
  items.filter((item) => {
    return (
      item.plc_status?.online === true ||
      item.plc_status?.connected === 1 ||
      item.plc_data?.status === 1
    );
  })
);

/** PLC offline */
export const selectOfflinePlc = createSelector([selectAllPlc], (items) =>
  items.filter((item) => {
    const isOnline =
      item.plc_status?.online === true ||
      item.plc_status?.connected === 1 ||
      item.plc_data?.status === 1;
    return isOnline === false;
  })
);

/** Controlla se ci sono modifiche pendenti */
export const selectHasPendingChanges = createSelector(
  [selectPlcState],
  (state) => {
    // Questa logica dipende da come gestisci le modifiche pendenti
    // Potresti aggiungere un campo `pendingChanges` allo stato
    return false; // placeholder
  }
);

/** Controlla se ci sono errori */
export const selectHasErrors = createSelector(
  [selectPlcError],
  (error) => error !== null
);
