import type { PlcItem } from "@store_device/plc/plc.types";
import {
  getCommandCurrentValue,
  getCommandStatusDescription,
} from "./plcCommandsMapper.mapper";

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
 * List of logical toggle groups. Each group merges two low-level PLC command keys into
 * a higher level semantic UI switch. Add future pairs here (es: manutenzione on/off if ever
 * becomes split) without touching the rest of the UI.
 */
export const TOGGLE_GROUPS: PlcToggleGroup[] = [
  {
    id: "door",
    label: "Serranda",
    onKey: "open-door",
    offKey: "close-door",
    statusMapper: (active) =>
      active === undefined
        ? "Stato serranda sconosciuto"
        : active
        ? "Serranda aperta"
        : "Serranda chiusa",
  },
  {
    id: "list",
    label: "Lista",
    onKey: "open-list",
    offKey: "close-list",
    statusMapper: (active) =>
      active === undefined
        ? "Stato lista sconosciuto"
        : active
        ? "Lista aperta"
        : "Lista chiusa",
  },
  // Self toggle groups for mono-comandi: usiamo lo stesso key per on/off (il back-end li interpreta come flip)
  {
    id: "press",
    label: "Pressa",
    onKey: "press-forward",
    offKey: "press-backward",
    statusMapper: (a) =>
      a === undefined
        ? "Stato pressa sconosciuto"
        : a
        ? "Movimento avanti"
        : "Movimento indietro",
  },
  {
    id: "basket-download",
    label: "Scarica Cesta",
    onKey: "basket-download",
    offKey: "basket-download",
    statusMapper: (a) =>
      a === undefined ? "Stato scarico sconosciuto" : a ? "Scarico attivo" : "Scarico inattivo",
  },
  {
    id: "basket-rotate",
    label: "Ruota Cesta",
    onKey: "basket-rotate",
    offKey: "basket-rotate",
    statusMapper: (a) =>
      a === undefined ? "Stato rotazione sconosciuto" : a ? "Rotazione attiva" : "Rotazione inattiva",
  },
  {
    id: "reset-weight",
    label: "Azzera Peso",
    onKey: "reset-weight",
    offKey: "reset-weight",
    statusMapper: (a) =>
      a === undefined ? "Stato azzeramento sconosciuto" : a ? "Peso azzerato" : "Peso non azzerato",
  },
  {
    id: "tare",
    label: "Tara",
    onKey: "tare",
    offKey: "tare",
    statusMapper: (a) =>
      a === undefined ? "Stato tara sconosciuto" : a ? "Tara eseguita" : "Tara non eseguita",
  },
  {
    id: "send-data",
    label: "Invia Dati",
    onKey: "send-data",
    offKey: "send-data",
    statusMapper: (a) =>
      a === undefined ? "Stato invio sconosciuto" : a ? "Dati inviati" : "Pronto invio dati",
  },
  {
    id: "maintenance",
    label: "Manutenzione",
    onKey: "maintenance",
    offKey: "maintenance",
    statusMapper: (a) =>
      a === undefined ? "Stato manutenzione sconosciuto" : a ? "In manutenzione" : "Operativo",
  },
  {
    id: "restart",
    label: "Riavvia PLC",
    onKey: "restart",
    offKey: "restart",
    statusMapper: (a) =>
      a === undefined ? "Stato riavvio sconosciuto" : a ? "Riavvio effettuato" : "Pronto al riavvio",
  },
];

export interface ToggleComputedState {
  id: string;
  label: string;
  isActive: boolean | undefined;
  onCommandKey: string;
  offCommandKey: string;
  statusDescription: string;
}

/**
 * Compute toggle descriptors from PlcItem. It inspects only the "on" command current value.
 * If that value is truthy we consider toggle active.
 */
export function getToggleGroupsState(plcItem: PlcItem | undefined): ToggleComputedState[] {
  return TOGGLE_GROUPS.map((g) => {
    const currentOnValue = getCommandCurrentValue(plcItem, g.onKey);
    const isActive = currentOnValue === undefined ? undefined : Boolean(currentOnValue);
    const statusDescription = g.statusMapper
      ? g.statusMapper(isActive)
      : getCommandStatusDescription(plcItem, g.onKey);
    return {
      id: g.id,
      label: g.label,
      isActive,
      onCommandKey: g.onKey,
      offCommandKey: g.offKey,
      statusDescription,
    };
  });
}
