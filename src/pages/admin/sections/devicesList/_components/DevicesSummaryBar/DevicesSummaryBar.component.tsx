import React from "react";
import type { Device } from "@store_admin/devices/devices.types";
import {
  SummaryBar,
  type SummaryItem,
} from "../../../_commons/components/SectionSummary/SectionSummary.component";

type Props = {
  devices: Device[];
  className?: string;
};

export const DevicesSummaryBar: React.FC<Props> = ({ devices, className }) => {
  const total = devices.length;
  const active = devices.filter((d) => d.status === 1).length;
  const inactive = devices.filter((d) => d.status === 0).length;
  const blocked = devices.filter(
    (d) => d.status_Machine_Blocked === true
  ).length;
  const ready = devices.filter((d) => d.status_ready_d75_3_7 === true).length;

  const items: SummaryItem[] = [
    { number: active, label: "Attivi", variant: "statCard--active" },
    { number: inactive, label: "Inattivi", variant: "statCard--inactive" },
    { number: blocked, label: "Bloccati", variant: "statCard--blocked" },
    { number: ready, label: "Pronti", variant: "statCard--ready" },
  ];

  return (
    <SummaryBar
      className={className}
      title="Dashboard Dispositivi"
      totalLabel="dispositivi totali"
      totalNumber={total}
      items={items}
    />
  );
};

export default DevicesSummaryBar;
