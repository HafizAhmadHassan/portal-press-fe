// DeviceOverview.tsx
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

import DeviceHeader from "./_components/DeviceHeader/DeviceHeader.component";
import styles from "./DeviceMACHINE_STATUS.module.scss";
import EmptyState from "./_components/DeviceEmptyState/DeviceEmptyState.component";
import DeviceStatus from "./_components/DeviceStatus/Devicestatus.component";
import { useGetPlcByIdQuery } from "@store_device/plc/plc.api";
import type { PlcItem } from "@store_device/plc/plc.types";
import { getIndividualCommandsState } from "../_mappers/plcToggleCommands.mapper";
import { ToggleCommandCard } from "./_components/DeviceCommands/_components/ToggleCommandCard/ToggleCommandCard.component";
import cmdStyles from "./_components/DeviceCommands/DeviceCommands.module.scss";
import { RefreshCw, AlertTriangle } from "lucide-react";
import layoutStyles from "./DeviceMACHINE_STATUS.layout.module.scss";
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
  // Compute individual commands state (comandi separati)
  const individualCommands = useMemo(
    () => getIndividualCommandsState(plcDetail),
    [plcDetail]
  );

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
        /* isLoading={isLoading} */
      />

      <div className={layoutStyles.twoCol}>
        {individualCommands.length > 0 && (
          <div
            className={[cmdStyles.card, layoutStyles.commandsCard].join(" ")}
          >
            <div className={cmdStyles.cardHeader}>
              <div className={cmdStyles.cardTitle}>
                <RefreshCw size={16} />
                <span>Comandi</span>
              </div>
              <div className={cmdStyles.cardInfo}>
                <AlertTriangle size={14} />
                <span>Attenzione: l’esecuzione è immediata.</span>
              </div>
            </div>
            <div
              className={[cmdStyles.cmdGrid, layoutStyles.scrollArea].join(" ")}
            >
              {individualCommands.map((cmd) => {
                const isExecuting = isCommandExecuting(cmd.commandKey);
                return (
                  <ToggleCommandCard
                    compact
                    key={cmd.id}
                    descriptor={{
                      id: cmd.id,
                      label: cmd.label,
                      isActive: Boolean(cmd.currentValue),
                      isExecuting,
                      onCommandKey: cmd.commandKey,
                      offCommandKey: cmd.commandKey, // Same key for individual commands
                      statusDescription: cmd.statusDescription,
                    }}
                    execute={async (k) => {
                      await handleCommand(k);
                      return true;
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}

        <DeviceStatus statusList={statusList} isLoading={isLoading} />
      </div>
    </section>
  );
}
