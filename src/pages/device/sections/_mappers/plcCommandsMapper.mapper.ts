// utils/plcCommandsMapper.ts
import type { PlcCommand, PlcItem } from "@store_device/plc/plc.types";

/**
 * Mappatura tra i comandi UI e i varname PLC
 * Basata sui field_names forniti
 */
export const PLC_COMMANDS_MAPPING: Record<string, PlcCommand> = {
  "open-list": {
    key: "open-list",
    label: "Apri Lista",
    varname: "status_HMI_APRI_WHITE_LISTA",
    description: "Apre la lista bianca del dispositivo",
  },
  "close-list": {
    key: "close-list",
    label: "Chiudi Lista",
    varname: "status_HMI_CHIUDI_LISTA",
    description: "Chiude la lista del dispositivo",
  },
  "open-door": {
    key: "open-door",
    label: "Apri Serranda",
    varname: "status_PULSANTE_HMI_APERTURA_SERRANDA",
    description: "Apre la serranda del dispositivo",
  },
  "close-door": {
    key: "close-door",
    label: "Chiudi Serranda",
    varname: "status_PULSANTE_HMI_CHIUSURA_SERRANDA",
    description: "Chiude la serranda del dispositivo",
  },
  "press-forward": {
    key: "press-forward",
    label: "Pressa Avanti",
    varname: "status_PRESSA_AVANTI_HMI",
    description: "Attiva la pressa in avanti",
  },
  "press-backward": {
    key: "press-backward",
    label: "Pressa Indietro",
    varname: "status_PRESSA_INDIETRO_HMI",
    description: "Attiva la pressa all'indietro",
  },
  "basket-download": {
    key: "basket-download",
    label: "Scarica Cesta",
    varname: "status_CESTA_IN_SCARICO_HMI",
    description: "Mette la cesta in scarico",
  },
  "basket-rotate": {
    key: "basket-rotate",
    label: "Ruota Cesta",
    varname: "status_RETORNO_CESTA_HMI",
    description: "Fa ruotare la cesta",
  },
  "reset-weight": {
    key: "reset-weight",
    label: "Azzera Peso",
    varname: "status_HMI_RST_PESO_AZZERA_PESO",
    description: "Azzera il peso misurato",
  },
  tare: {
    key: "tare",
    label: "Tara",
    varname: "status_HMI_TARA",
    description: "Esegue la tara della bilancia",
  },
  "send-data": {
    key: "send-data",
    label: "Invia Dati",
    varname: "status_HMI_SEND_DATE_INVIO_DATI",
    description: "Invia i dati dal dispositivo",
  },
  maintenance: {
    key: "maintenance",
    label: "Manutenzione",
    varname: "status_HMI_MANUTENZIONE",
    description: "Attiva/disattiva modalità manutenzione",
  },
  restart: {
    key: "restart",
    label: "Riavvia PLC",
    varname: "status_HMI_EMERGENZA", // Usando emergenza come restart
    description: "Riavvia il sistema PLC",
  },
};

/**
 * Ottiene tutti i comandi disponibili come array
 */
export function getAllPlcCommands(): PlcCommand[] {
  return Object.values(PLC_COMMANDS_MAPPING);
}

/**
 * Ottiene un comando specifico per chiave
 */
export function getPlcCommand(commandKey: string): PlcCommand | undefined {
  return PLC_COMMANDS_MAPPING[commandKey];
}

/**
 * Ottiene il valore corrente di un comando dal PlcItem
 */
export function getCommandCurrentValue(
  plcItem: PlcItem | undefined,
  commandKey: string
): boolean | number | undefined {
  if (!plcItem) return undefined;

  const command = getPlcCommand(commandKey);
  if (!command) return undefined;

  // Cerca prima in plc_status, poi in plc_data
  const combinedData = {
    ...plcItem.plc_status,
    ...plcItem.plc_data,
  };

  return combinedData[command.varname];
}

/**
 * Determina l'operazione da inviare (0 o 1) basandosi sul valore corrente
 * Se il valore è 0/false invia "1", se è 1/true invia "0"
 */
export function determineOperation(currentValue: any): "0" | "1" {
  // Converti il valore in boolean per semplicità
  const boolValue = Boolean(currentValue);

  // Se è attivo (true/1), disattiva (invia "0")
  // Se è inattivo (false/0), attiva (invia "1")
  return boolValue ? "0" : "1";
}

/**
 * Ottiene il machine_id dal PlcItem
 * Cerca in vari campi possibili
 */
export function getMachineId(plcItem: PlcItem | undefined): string {
  if (!plcItem) return "UNKNOWN";

  // Prova vari campi dove potrebbe essere il machine_id
  const possibleIds = [
    plcItem.plc_status?.status_CODICE_GPS,
    plcItem.plc_data?.machine_id,
    plcItem.plc_data?.codice,
    plcItem.plc_status?.machine_name,
    `MCH${plcItem.plc_data?.id?.toString().padStart(3, "0")}`, // MCH001, MCH002, etc.
  ];

  const machineId = possibleIds.find((id) => id && String(id).trim() !== "");
  return machineId ? String(machineId) : "UNKNOWN";
}

/**
 * Verifica se un comando è disponibile/abilitato
 */
export function isCommandAvailable(
  plcItem: PlcItem | undefined,
  commandKey: string
): boolean {
  if (!plcItem) return false;

  // Controlla se la macchina è bloccata
  if (plcItem.plc_status?.status_Machine_Blocked === true) {
    // Solo alcuni comandi sono permessi quando la macchina è bloccata
    const allowedWhenBlocked = [
      "maintenance",
      "restart",
      "reset-weight",
      "tare",
    ];
    return allowedWhenBlocked.includes(commandKey);
  }

  // Controlla se è in manutenzione
  if (plcItem.plc_status?.status_HMI_MANUTENZIONE === true) {
    // Tutti i comandi sono disponibili in manutenzione
    return true;
  }

  // Per default tutti i comandi sono disponibili se la macchina non è bloccata
  return true;
}

/**
 * Ottiene una descrizione dello stato corrente per un comando
 */
export function getCommandStatusDescription(
  plcItem: PlcItem | undefined,
  commandKey: string
): string {
  const currentValue = getCommandCurrentValue(plcItem, commandKey);
  const command = getPlcCommand(commandKey);

  if (!command) return "Comando sconosciuto";

  if (currentValue === undefined) return "Stato sconosciuto";

  const isActive = Boolean(currentValue);

  switch (commandKey) {
    case "maintenance":
      return isActive ? "In manutenzione" : "Operativo";
    case "open-list":
      return isActive ? "Lista aperta" : "Lista chiusa";
    case "open-door":
      return isActive ? "Serranda aperta" : "Serranda chiusa";
    default:
      return isActive ? "Attivo" : "Inattivo";
  }
}
