import React, { useMemo } from "react";
import { useParams } from "react-router-dom";

import DeviceStatus, {
  type StatusItem as DeviceStatusItem,
} from "./_components/DeviceStatus/Devicestatus.component";

import styles from "./DeviceMACHINE_STATUS.module.scss";
import type { CommandItem } from "./_components/DeviceCommands/DeviceCommands.component";
import { DeviceEmptyState } from "./_components/DeviceEmptyState/DeviceEmptyState.component";
import DeviceCommands from "./_components/DeviceCommands/DeviceCommands.component";

export default function DeviceOverview() {
  const { deviceId } = useParams<{ deviceId?: string }>();

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

  // Tipizziamo il generic di useMemo per evitare che 'type' si allarghi a 'string'
  const statusList = useMemo<DeviceStatusItem[]>(
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

  if (!deviceId) return <DeviceEmptyState />;

  return (
    <section className={styles.wrapper}>
      <DeviceCommands commands={commands} />
      <DeviceStatus statusList={statusList} />
    </section>
  );
}
