import type { PlcItem } from "@store_device/plc/plc.types";
import {
  getCommandCurrentValue,
  getCommandStatusDescription,
} from "./plcCommandsMapper.mapper";

/**
 * Individual command definition for separate buttons
 */
export interface PlcIndividualCommand {
  /** Unique id for UI component */
  id: string;
  /** Display label */
  label: string;
  /** Command key to execute */
  commandKey: string;
  /** Optional custom status translator */
  statusMapper?: (value: any) => string;
}

/**
 * Logical toggle groups merge two legacy commands (ex open-door/close-door) into a single UI concept.
 */
export interface PlcToggleGroup {
  /** Unique id for UI component */
  id: string;
  /** Display label */
  label: string;
  /** Command key that performs ON / open */
  onKey: string;
  /** Command key that performs OFF / close */
  offKey: string;
  /** Optional custom status translator */
  statusMapper?: (isActive: boolean | undefined) => string;
}

/**
 * Individual commands - separate buttons for each action
 */
export const INDIVIDUAL_COMMANDS: PlcIndividualCommand[] = [
  // Serranda - separated
  {
    id: "open-door",
    label: "Apri Serranda",
    commandKey: "open-door",
    statusMapper: (value) =>
      value ? "Apertura in corso..." : "Pronto ad aprire",
  },
  {
    id: "close-door",
    label: "Chiudi Serranda",
    commandKey: "close-door",
    statusMapper: (value) =>
      value ? "Chiusura in corso..." : "Pronto a chiudere",
  },
  // Lista - separated
  {
    id: "open-list",
    label: "Apri Lista",
    commandKey: "open-list",
    statusMapper: (value) =>
      value ? "Apertura lista..." : "Pronto ad aprire lista",
  },
  {
    id: "close-list",
    label: "Chiudi Lista",
    commandKey: "close-list",
    statusMapper: (value) =>
      value ? "Chiusura lista..." : "Pronto a chiudere lista",
  },
  // Pressa - separated
  {
    id: "press-forward",
    label: "Pressa Avanti",
    commandKey: "press-forward",
    statusMapper: (value) =>
      value ? "Movimento avanti..." : "Pronto movimento avanti",
  },
  {
    id: "press-backward",
    label: "Pressa Indietro",
    commandKey: "press-backward",
    statusMapper: (value) =>
      value ? "Movimento indietro..." : "Pronto movimento indietro",
  },
  // Single action commands
  {
    id: "basket-download",
    label: "Scarica Cesta",
    commandKey: "basket-download",
    statusMapper: (value) => (value ? "Scarico attivo" : "Scarico inattivo"),
  },
  {
    id: "basket-rotate",
    label: "Ruota Cesta",
    commandKey: "basket-rotate",
    statusMapper: (value) =>
      value ? "Rotazione attiva" : "Rotazione inattiva",
  },
  {
    id: "reset-weight",
    label: "Azzera Peso",
    commandKey: "reset-weight",
    statusMapper: (value) => (value ? "Peso azzerato" : "Peso non azzerato"),
  },
  {
    id: "tare",
    label: "Tara",
    commandKey: "tare",
    statusMapper: (value) => (value ? "Tara eseguita" : "Tara non eseguita"),
  },
  {
    id: "send-data",
    label: "Invia Dati",
    commandKey: "send-data",
    statusMapper: (value) => (value ? "Dati inviati" : "Pronto invio dati"),
  },
  {
    id: "maintenance",
    label: "Manutenzione",
    commandKey: "maintenance",
    statusMapper: (value) => (value ? "In manutenzione" : "Operativo"),
  },
  {
    id: "restart",
    label: "Riavvia PLC",
    commandKey: "restart",
    statusMapper: (value) =>
      value ? "Riavvio effettuato" : "Pronto al riavvio",
  },
];

export interface IndividualCommandState {
  id: string;
  label: string;
  commandKey: string;
  currentValue: unknown;
  statusDescription: string;
}

/**
 * Compute individual command states from PlcItem
 */
export function getIndividualCommandsState(
  plcItem: PlcItem | undefined
): IndividualCommandState[] {
  return INDIVIDUAL_COMMANDS.map((cmd) => {
    const currentValue = getCommandCurrentValue(plcItem, cmd.commandKey);
    const statusDescription = cmd.statusMapper
      ? cmd.statusMapper(currentValue)
      : getCommandStatusDescription(plcItem, cmd.commandKey);
    return {
      id: cmd.id,
      label: cmd.label,
      commandKey: cmd.commandKey,
      currentValue,
      statusDescription,
    };
  });
}

// Keep backward compatibility - deprecated, use getIndividualCommandsState instead
export interface ToggleComputedState {
  id: string;
  label: string;
  isActive: boolean | undefined;
  onCommandKey: string;
  offCommandKey: string;
  statusDescription: string;
}

/**
 * @deprecated Use getIndividualCommandsState instead
 */
export function getToggleGroupsState(
  plcItem: PlcItem | undefined
): ToggleComputedState[] {
  // Convert individual commands to old format for backward compatibility
  const individualStates = getIndividualCommandsState(plcItem);
  return individualStates.map((cmd) => ({
    id: cmd.id,
    label: cmd.label,
    isActive: Boolean(cmd.currentValue),
    onCommandKey: cmd.commandKey,
    offCommandKey: cmd.commandKey, // Same key for both actions
    statusDescription: cmd.statusDescription,
  }));
}
