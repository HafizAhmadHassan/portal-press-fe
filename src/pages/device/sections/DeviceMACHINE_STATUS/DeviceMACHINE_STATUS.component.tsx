// DeviceOverview.tsx
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

import DeviceHeader from "./_components/DeviceHeader/DeviceHeader.component";
import styles from "./DeviceMACHINE_STATUS.module.scss";
import type { CommandItem } from "./_components/DeviceCommands/DeviceCommands.component";
import EmptyState from "./_components/DeviceEmptyState/DeviceEmptyState.component";
import DeviceCommands from "./_components/DeviceCommands/DeviceCommands.component";
import DeviceStatus from "./_components/DeviceStatus/Devicestatus.component";
import { useGetPlcByIdQuery } from "@store_device/plc/plc.api";
import type { PlcItem } from "@store_device/plc/plc.types";
import { getAllPlcCommands } from "../_mappers/plcCommandsMapper.mapper";
import { getCriticalStatusItems } from "../_mappers/plcStatusMapper.mapper";
import { usePlcCommands } from "../_hooks/usePlcCommands";

type DeviceStatusType = "online" | "offline" | "unknown";

export default function DeviceOverview() {
  const { deviceId } = useParams<{ deviceId?: string }>();

  // Parse ID in modo sicuro
  const parsedId = useMemo(() => Number(deviceId), [deviceId]);
  const isValidId = Number.isFinite(parsedId) && parsedId > 0;

  const query = useGetPlcByIdQuery(parsedId as number, {
    skip: !isValidId,
    pollingInterval: 5000, // Refresh ogni 5 secondi per vedere i cambi di stato
  });
  const { isLoading, error, refetch } = query;
  const plcDetail: PlcItem | undefined = query.data as PlcItem | undefined;

  console.log("DeviceOverview - PLC Detail:", plcDetail);

  // Hook per gestire i comandi PLC
  const {
    executeCommand,
    isCommandExecuting,
    commandsState,
    stats: commandStats,
    machineId,
  } = usePlcCommands({
    plcItem: plcDetail,
    onCommandSuccess: (commandKey) => {
      console.log(`Comando "${commandKey}" eseguito con successo`);
      // Forza un refresh dei dati dopo il comando
      setTimeout(() => refetch(), 1000);
    },
    onCommandError: (commandKey, errorMsg) => {
      console.error(`Errore comando "${commandKey}": ${errorMsg}`);
    },
  });

  const deviceName = useMemo(
    () => (deviceId ? `Dispositivo #${deviceId}` : "Dispositivo"),
    [deviceId]
  );

  const deviceStatus: DeviceStatusType = useMemo(() => {
    if (!isValidId) return "unknown";
    if (isLoading) return "unknown";
    if (error || !plcDetail) return "offline";

    // Controlla se la macchina è online
    const isOnline =
      plcDetail.plc_status?.online === true ||
      plcDetail.plc_status?.connected === 1 ||
      (plcDetail.plc_data && Object.keys(plcDetail.plc_data).length > 1);

    return isOnline ? "online" : "offline";
  }, [isValidId, isLoading, error, plcDetail]);

  const imageUrl = undefined as string | undefined;

  // Mappa i dati PLC per lo status
  const statusList = useMemo(() => {
    if (!plcDetail) return [];
    return getCriticalStatusItems(plcDetail); // Solo quelli critici
  }, [plcDetail]);

  // Converte i comandi PLC in formato CommandItem per il componente UI
  const commands: CommandItem[] = useMemo(() => {
    return getAllPlcCommands().map((command) => ({
      key: command.key,
      label: command.label,
      // Aggiungi indicatori di stato
      disabled: !commandsState.find((c) => c.key === command.key)?.isAvailable,
      loading: isCommandExecuting(command.key),
    }));
  }, [commandsState, isCommandExecuting]);

  // Handler per l'esecuzione dei comandi
  const handleCommand = async (commandKey: string) => {
    if (!isValidId || !plcDetail) {
      console.error("Nessun dispositivo disponibile");
      return;
    }

    console.log(`Executing command: ${commandKey}`);

    try {
      const success = await executeCommand(commandKey);
      if (success) {
        console.log(`Command ${commandKey} executed successfully`);
      }
    } catch (error) {
      console.error(`Command ${commandKey} failed:`, error);
    }
  };

  // Debug info
  console.log("DeviceOverview - Command Stats:", commandStats);
  console.log("DeviceOverview - Machine ID:", machineId);

  // Early returns dopo gli hook
  if (!isValidId) {
    return <EmptyState />;
  }

  if (error) {
    return (
      <section className={styles.wrapper}>
        <div className="error-state">
          <p>Errore nel caricamento del dispositivo</p>
          <button onClick={() => refetch()}>Riprova</button>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.wrapper}>
      <DeviceHeader
        deviceName={deviceName}
        deviceStatus={deviceStatus}
        imageUrl={imageUrl}
        isLoading={isLoading}
      />

      <DeviceCommands
        commands={commands}
        onCommand={handleCommand}
        disabled={isLoading || deviceStatus === "offline"}
      />

      <DeviceStatus statusList={statusList} isLoading={isLoading} />
    </section>
  );
}
