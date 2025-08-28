import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import DeviceHeader from "./_components/DeviceHeader/DeviceHeader.component";

import styles from "./DeviceMACHINE_STATUS.module.scss";
import type { CommandItem } from "./_components/DeviceCommands/DeviceCommands.component";
import EmptyState from "./_components/DeviceEmptyState/DeviceEmptyState.component";
import DeviceCommands from "./_components/DeviceCommands/DeviceCommands.component";
import DeviceStatus from "./_components/DeviceStatus/Devicestatus.component";

type DeviceStatusType = "online" | "offline" | "unknown";

export default function DeviceOverview() {
  const { deviceId } = useParams<{ deviceId?: string }>();

  const deviceName = useMemo(
    () => (deviceId ? `Dispositivo #${deviceId}` : "Dispositivo"),
    [deviceId]
  );
  const deviceStatus: DeviceStatusType = "online";
  const imageUrl = undefined as string | undefined;

  const commands: CommandItem[] = useMemo(
    () => [
      { key: "open-door", label: "Apri Serranda" },
      { key: "close-door", label: "Chiudi Serranda" },
      { key: "tare", label: "Tara" },
      { key: "maintenance", label: "Manutenzione", danger: true },
      { key: "restart", label: "Riavvia PLC", danger: true },
    ],
    []
  );

  const statusList = useMemo(
    () => [
      {
        key: "basket-in",
        label: "Cesto in Carico",
        type: "boolean" as const,
        value: true,
      },
      {
        key: "basket-out",
        label: "Cesto in Scarico",
        type: "boolean" as const,
        value: false,
      },
      {
        key: "pressure",
        label: "Pressione",
        type: "number" as const,
        value: 0,
        unit: "bar",
      },
      {
        key: "weight",
        label: "Peso",
        type: "number" as const,
        value: -0.149,
        unit: "kg",
      },
      { key: "seq", label: "Sequenza", type: "number" as const, value: 70 },
      {
        key: "doors",
        label: "Porte Laterali Aperte",
        type: "boolean" as const,
        value: false,
      },
      {
        key: "note",
        label: "Note",
        type: "text" as const,
        value: "Ultimo reset 2h fa",
      },
    ],
    []
  );

  if (!deviceId) return <EmptyState />;

  return (
    <section className={styles.wrapper}>
      <DeviceHeader
        deviceName={deviceName}
        deviceStatus={deviceStatus}
        imageUrl={imageUrl}
      />
      <DeviceCommands commands={commands} />
      <DeviceStatus statusList={statusList} />
    </section>
  );
}
