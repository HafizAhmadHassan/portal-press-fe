// hooks/usePlcCommands.ts
import { useState, useCallback, useMemo } from "react";
import { useWritePlcMutation } from "@store_device/plc/plc.api";
import type { PlcItem, PlcCommandExecution } from "@store_device/plc/plc.types";
import {
  determineOperation,
  getAllPlcCommands,
  getCommandCurrentValue,
  getCommandStatusDescription,
  getMachineId,
  getPlcCommand,
  isCommandAvailable,
} from "../_mappers/plcCommandsMapper.mapper";

interface UsePlcCommandsOptions {
  plcItem?: PlcItem;
  onCommandSuccess?: (commandKey: string) => void;
  onCommandError?: (commandKey: string, error: string) => void;
}

export function usePlcCommands({
  plcItem,
  onCommandSuccess,
  onCommandError,
}: UsePlcCommandsOptions = {}) {
  const [writePlc, { isLoading: isWriting }] = useWritePlcMutation();

  // Stato per tracciare l'esecuzione dei singoli comandi
  const [commandExecutions, setCommandExecutions] = useState<
    Record<string, PlcCommandExecution>
  >({});

  // Esegue un comando specifico
  const executeCommand = useCallback(
    async (commandKey: string): Promise<boolean> => {
      if (!plcItem) {
        const errorMsg = "Nessun dispositivo PLC disponibile";
        onCommandError?.(commandKey, errorMsg);
        return false;
      }

      const command = getPlcCommand(commandKey);
      if (!command) {
        const errorMsg = `Comando sconosciuto: ${commandKey}`;
        onCommandError?.(commandKey, errorMsg);
        return false;
      }

      // Verifica se il comando è disponibile
      if (!isCommandAvailable(plcItem, commandKey)) {
        const errorMsg =
          "Comando non disponibile con lo stato attuale della macchina";
        onCommandError?.(commandKey, errorMsg);
        return false;
      }

      // Imposta lo stato di esecuzione
      setCommandExecutions((prev) => ({
        ...prev,
        [commandKey]: {
          commandKey,
          isExecuting: true,
          error: null,
          lastExecuted: new Date(),
        },
      }));

      try {
        // Ottieni il valore corrente e determina l'operazione
        const currentValue = getCommandCurrentValue(plcItem, commandKey);
        const operation = determineOperation(currentValue);
        const machineId = getMachineId(plcItem);

        console.log(`Executing PLC command: ${commandKey}`, {
          varname: command.varname,
          currentValue,
          operation,
          machineId,
        });

        // Invia il comando al PLC
        const result = await writePlc({
          machine_id: machineId,
          varname: command.varname,
          operation,
        }).unwrap();

        console.log(`PLC command ${commandKey} successful:`, result);

        // Aggiorna lo stato di successo
        setCommandExecutions((prev) => ({
          ...prev,
          [commandKey]: {
            commandKey,
            isExecuting: false,
            error: null,
            lastExecuted: new Date(),
          },
        }));

        onCommandSuccess?.(commandKey);
        return true;
      } catch (error: any) {
        const errorMsg =
          error?.data?.message || error?.message || "Errore sconosciuto";

        console.error(`PLC command ${commandKey} failed:`, error);

        // Aggiorna lo stato di errore
        setCommandExecutions((prev) => ({
          ...prev,
          [commandKey]: {
            commandKey,
            isExecuting: false,
            error: errorMsg,
            lastExecuted: new Date(),
          },
        }));

        onCommandError?.(commandKey, errorMsg);
        return false;
      }
    },
    [plcItem, writePlc, onCommandSuccess, onCommandError]
  );

  // Cancella lo stato di errore per un comando
  const clearCommandError = useCallback((commandKey: string) => {
    setCommandExecutions((prev) => ({
      ...prev,
      [commandKey]: {
        ...prev[commandKey],
        error: null,
      },
    }));
  }, []);

  // Verifica se un comando specifico è in esecuzione
  const isCommandExecuting = useCallback(
    (commandKey: string): boolean => {
      return commandExecutions[commandKey]?.isExecuting || false;
    },
    [commandExecutions]
  );

  // Ottieni lo stato di un comando
  const getCommandState = useCallback(
    (commandKey: string) => {
      const execution = commandExecutions[commandKey];
      const command = getPlcCommand(commandKey);
      const currentValue = getCommandCurrentValue(plcItem, commandKey);
      const isAvailable = isCommandAvailable(plcItem, commandKey);
      const statusDescription = getCommandStatusDescription(
        plcItem,
        commandKey
      );

      return {
        command,
        currentValue,
        isAvailable,
        isExecuting: execution?.isExecuting || false,
        error: execution?.error || null,
        lastExecuted: execution?.lastExecuted || null,
        statusDescription,
      };
    },
    [plcItem, commandExecutions]
  );

  // Tutti i comandi disponibili con il loro stato
  const commandsState = useMemo(() => {
    const commands = getAllPlcCommands();
    return commands.map((command) => ({
      ...command,
      ...getCommandState(command.key),
    }));
  }, [getCommandState]);

  // Statistiche globali
  const stats = useMemo(() => {
    const total = commandsState.length;
    const available = commandsState.filter((cmd) => cmd.isAvailable).length;
    const executing = commandsState.filter((cmd) => cmd.isExecuting).length;
    const withErrors = commandsState.filter((cmd) => cmd.error).length;

    return {
      total,
      available,
      executing,
      withErrors,
      unavailable: total - available,
    };
  }, [commandsState]);

  return {
    // Actions
    executeCommand,
    clearCommandError,

    // State queries
    isCommandExecuting,
    getCommandState,

    // Data
    commandsState,
    stats,

    // Global state
    isWriting,
    machineId: getMachineId(plcItem),
  };
}
