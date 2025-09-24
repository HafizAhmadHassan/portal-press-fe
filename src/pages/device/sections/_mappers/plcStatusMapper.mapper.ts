// _mappers/plcStatusMapper.ts
import type { PlcItem } from "@store_device/plc/plc.types";

export interface StatusItem {
  key: string;
  label: string;
  type: "boolean" | "number" | "text";
  value: any;
  unit?: string;
}

// Mappa i campi API con le loro etichette visualizzate
export const PLC_STATUS_MAPPING = {
  status_CESTA_IN_CARICO_D_201_5_7: "Cesto in Carico",
  status_CESTA_IN_SCARICO_D_201_5_6: "Cesto in Scarico",
  status_CESTA_IN_SCARICO_D_5_3_7: "Cesto in Scarico 2",
  status_ATTUALE_PRESSIONE_D301_52: "Pressione",
  status_ATTUALE_PESO_D201_46: "Peso",
  status_SEQUENZA_D_5_20: "Sequenza",
  status_HMI_EMERGENZA: "Attiva Emergenza",
  plant2_Carico_Ingombrante: "Carico Ingombrante 2",
  status_CARICO_INGOMBRANTE: "Carico Ingombrante",
  status_PRESSA_AVANTI_D_301_14_6: "Pressa Avanti",
  status_PRESSA_INDIETRO_D_301_14_7: "Pressa Indietro",
  status_PULSANTE_INDIETRO_PRESSA_D_5_3_1: "Pressa Indietro 2",
  plant1_Porte_Aperte: "Porte Aperte 2",
  status_PORTE_LATERALI_APERTE: "Porte Laterali Aperte",
  status_SERRANDA_APERTA_D_101_5_6: "Serranda Aperta",
  status_SERRANDA_CHIUSA_D_101_5_7: "Serranda Chiusa",
  status_SERRANDA_SICUREZZA_CHIUSA: "Sicurezza Serranda",
  status_CESTA_SICUREZZA_IN_CARICO: "Sicurezza Cesto",
  status_VERSIONE_PLC_D5_14: "Versione PLC",
} as const;

// Campi che rappresentano valori numerici con unità di misura
const NUMERIC_FIELDS_WITH_UNITS = {
  status_ATTUALE_PRESSIONE_D301_52: "bar",
  status_ATTUALE_PESO_D201_46: "kg",
} as const;

// Campi che sono stringhe/numeri ma non booleani
const TEXT_OR_NUMBER_FIELDS = [
  "status_ATTUALE_PRESSIONE_D301_52",
  "status_ATTUALE_PESO_D201_46",
  "status_SEQUENZA_D_5_20",
  "status_VERSIONE_PLC_D5_14",
] as const;

/**
 * Determina il tipo di dato basandosi sul campo e sul valore
 */
function determineType(key: string, value: any): "boolean" | "number" | "text" {
  if (TEXT_OR_NUMBER_FIELDS.includes(key as any)) {
    return typeof value === "number" ? "number" : "text";
  }
  return "boolean";
}

/**
 * Formatta il valore per la visualizzazione
 */
function formatValue(
  key: string,
  value: any,
  type: "boolean" | "number" | "text"
): any {
  if (type === "boolean") {
    return Boolean(value);
  }

  if (type === "number") {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : Number(num.toFixed(2));
  }

  return String(value || "N/A");
}

/**
 * Mappa i dati PLC in StatusItem[] per la visualizzazione
 */
export function mapPlcDataToStatusItems(
  plcItem: PlcItem | undefined
): StatusItem[] {
  if (!plcItem) return [];

  const statusItems: StatusItem[] = [];
  const plcStatus = plcItem.plc_status || {};
  const plcData = plcItem.plc_data || {};

  // Combina plc_status e plc_data per la ricerca
  const combinedData = { ...plcStatus, ...plcData };

  // Itera attraverso la mappa e crea gli StatusItem
  Object.entries(PLC_STATUS_MAPPING).forEach(([apiKey, displayLabel]) => {
    const value = combinedData[apiKey];

    // Solo se il valore esiste nell'API
    if (value !== undefined) {
      const type = determineType(apiKey, value);
      const formattedValue = formatValue(apiKey, value, type);
      const unit =
        NUMERIC_FIELDS_WITH_UNITS[
          apiKey as keyof typeof NUMERIC_FIELDS_WITH_UNITS
        ];

      statusItems.push({
        key: apiKey,
        label: displayLabel,
        type,
        value: formattedValue,
        unit,
      });
    }
  });

  return statusItems;
}

/**
 * Filtra solo gli status critici/importanti per una vista compatta
 */
export function getCriticalStatusItems(
  plcItem: PlcItem | undefined
): StatusItem[] {
  const allItems = mapPlcDataToStatusItems(plcItem);

  // Campi considerati critici/più importanti
  const criticalKeys = [
    "status_CESTA_IN_CARICO_D_201_5_7",
    "status_CESTA_IN_SCARICO_D_201_5_6",
    "status_ATTUALE_PRESSIONE_D301_52",
    "status_ATTUALE_PESO_D201_46",
    "status_SEQUENZA_D_5_20",
    "status_CARICO_INGOMBRANTE",
    "status_PRESSA_AVANTI_D_301_14_6",
    "status_PRESSA_INDIETRO_D_301_14_7",
    "status_PULSANTE_INDIETRO_PRESSA_D_5_3_1",
    "status_PORTE_LATERALI_APERTE",
    "status_SERRANDA_APERTA_D_101_5_6",
    "status_SERRANDA_CHIUSA_D_101_5_7",
    "status_SERRANDA_SICUREZZA_CHIUSA",
    "status_CESTA_SICUREZZA_IN_CARICO",
    "status_VERSIONE_PLC_D5_14",
  ];

  return allItems.filter((item) => criticalKeys.includes(item.key));
}

/**
 * Ottiene un singolo valore di status per chiave
 */
export function getStatusValue(plcItem: PlcItem | undefined, key: string): any {
  if (!plcItem) return undefined;

  const combinedData = {
    ...plcItem.plc_status,
    ...plcItem.plc_data,
  };

  return combinedData[key];
}
