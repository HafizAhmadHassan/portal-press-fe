// DeviceOverview.tsx
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import DeviceHeader from "./_components/DeviceHeader/DeviceHeader.component";

import styles from "./DeviceMACHINE_STATUS.module.scss";
import type { CommandItem } from "./_components/DeviceCommands/DeviceCommands.component";
import EmptyState from "./_components/DeviceEmptyState/DeviceEmptyState.component";
import DeviceCommands from "./_components/DeviceCommands/DeviceCommands.component";
import DeviceStatus from "./_components/DeviceStatus/Devicestatus.component";

// Importa gli hooks PLC puliti

import { useGetPlcByIdQuery } from "@store_device/plc/plc.api";
import { usePlcById } from "../../store/plc";

type DeviceStatusType = "online" | "offline" | "unknown";

interface StatusItem {
  key: string;
  label: string;
  type: "boolean" | "number" | "text";
  value: any;
  unit?: string;
}

export default function DeviceOverview() {
  const { deviceId } = useParams<{ deviceId?: string }>();
  const currentId = deviceId ? Number(deviceId) : undefined;

  // Usa l'hook RTK Query direttamente per i dati real-time
  const {
    data: plcDetail,
    isLoading,
    error,
    refetch,
  } = useGetPlcByIdQuery(currentId!, {
    skip: !currentId,
    pollingInterval: 5000, // Polling ogni 5 secondi per dati real-time
  });

  // Hooks per azioni CRUD se necessarie
  const { update: updatePlc } = usePlcById(currentId!);

  const deviceName = useMemo(
    () => (deviceId ? `Dispositivo #${deviceId}` : "Dispositivo"),
    [deviceId]
  );

  // Determina lo status del device in base ai dati PLC
  const deviceStatus: DeviceStatusType = useMemo(() => {
    if (isLoading) return "unknown";
    if (error || !plcDetail) return "offline";

    // Logica per determinare se online basata sui dati PLC
    // Puoi personalizzare questa logica in base ai tuoi requisiti
    const isOnline =
      plcDetail.plc_status?.online === true ||
      plcDetail.plc_status?.connected === 1 ||
      Object.keys(plcDetail.plc_data || {}).length > 1; // Ha più dati oltre all'ID

    return isOnline ? "online" : "offline";
  }, [isLoading, error, plcDetail]);

  const imageUrl = undefined as string | undefined;

  // Comandi disponibili per il dispositivo
  const commands: CommandItem[] = useMemo(
    () => [
      { key: "open-list", label: "Apri Lista" },
      { key: "close-list", label: "Chiudi Lista" },
      { key: "open-door", label: "Apri Serranda" },
      { key: "close-door", label: "Chiudi Serranda" },
      { key: "press-forward", label: "Pressa Avanti" },
      { key: "press-backward", label: "Pressa Indietro" },
      { key: "basket-download", label: "Scarica Cesta" },
      { key: "basket-rotate", label: "Ruota Cesta" },
      { key: "reset-weight", label: "Azzera Peso" },
      { key: "tare", label: "Tara" },
      { key: "send-data", label: "Invia Dati" },
      { key: "maintenance", label: "Manutenzione" },
      { key: "restart", label: "Riavvia PLC" },
    ],
    []
  );

  const statusList = useMemo<StatusItem[]>(
    () => [
      {
        key: "basket-in",
        label: "Cesto in Carico",
        type: "boolean",
        value: true,
      },
      {
        key: "basket-out",
        label: "Cesto in Scarico",
        type: "boolean",
        value: false,
      },
      {
        key: "pressure",
        label: "Pressione in Bar",
        type: "number",
        value: 0,
        unit: "bar",
      },
      {
        key: "weight",
        label: "Peso in Kg",
        type: "number",
        value: -0.149,
        unit: "kg",
      },
      { key: "seq", label: "Sequenza", type: "number", value: 70 },

      {
        key: "bulky-load",
        label: "Carico Ingombrante",
        type: "boolean",
        value: true,
      },

      {
        key: "press-forward",
        label: "Pressa Avanti",
        type: "boolean",
        value: true,
      },
      {
        key: "press-backward",
        label: "Pressa Indietro",
        type: "boolean",
        value: false,
      },

      {
        key: "side-doors",
        label: "Porte Laterali Aperte",
        type: "boolean",
        value: false,
      },
      {
        key: "open-doors",
        label: "Serranda Aperta",
        type: "boolean",
        value: false,
      },
      {
        key: "close-doors",
        label: "Serranda Chiusa",
        type: "boolean",
        value: true,
      },

      {
        key: "security-doors",
        label: "Sicurezza Serranda",
        type: "boolean",
        value: true,
      },
      {
        key: "security-basket",
        label: "Sicurezza Cesta",
        type: "boolean",
        value: true,
      },
    ],
    []
  );

  // Costruisce la lista di status dai dati PLC reali

  // Handler per i comandi (implementa la logica specifica per ogni comando)
  const handleCommand = async (commandKey: string) => {
    if (!currentId || !plcDetail) return;

    console.log(`Executing command: ${commandKey} on device ${currentId}`);

    try {
      // Logica specifica per ogni comando
      switch (commandKey) {
        case "open-door":
          await updatePlc({
            plc_data: { ...plcDetail.plc_data, door_open: 1 },
          });
          break;

        case "close-door":
          await updatePlc({
            plc_data: { ...plcDetail.plc_data, door_open: 0 },
          });
          break;

        case "tare":
          await updatePlc({
            plc_data: { ...plcDetail.plc_data, tare_requested: 1 },
          });
          break;

        case "maintenance":
          await updatePlc({
            plc_status: { ...plcDetail.plc_status, maintenance_mode: 1 },
          });
          break;

        case "restart":
          await updatePlc({
            plc_status: { ...plcDetail.plc_status, restart_requested: 1 },
          });
          break;

        default:
          console.warn(`Unknown command: ${commandKey}`);
      }

      // Refresh dei dati dopo il comando
      refetch();
    } catch (error) {
      console.error(`Error executing command ${commandKey}:`, error);
      // Qui potresti mostrare una notifica di errore
    }
  };

  if (!deviceId) {
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
