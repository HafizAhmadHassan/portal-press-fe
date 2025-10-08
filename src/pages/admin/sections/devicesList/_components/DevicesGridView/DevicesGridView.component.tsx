import React, { useRef } from "react";
import type { Device } from "@store_admin/devices/devices.types";
import { DevicesBox } from "../DevicesBox/DevicesBox.component";
import styles from "./DevicesGridView.module.scss";

type Props = {
  devices: Device[];
  isLoading: boolean;
  hasNext: boolean;
  sentinelRef: (node: HTMLDivElement | null) => void;
  onDeviceAction?: (actionKey: string, device: Device) => void;
};

/**
 * Componente che visualizza i dispositivi in una griglia con scroll infinito
 */
export const DevicesGridView: React.FC<Props> = ({
  devices,
  isLoading,
  hasNext,
  sentinelRef,
  onDeviceAction = () => {},
}) => {
  const gridScrollRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className={styles.devicesListSection} ref={gridScrollRef}>
      <div className={styles.viewContainer}>
        <div className={styles.devicesGrid}>
          {devices.length === 0 && !isLoading ? (
            <div className={styles.emptyState}>
              <span>Nessun dispositivo trovato</span>
            </div>
          ) : (
            devices.map((device, idx) => (
              <DevicesBox
                key={`${device.id}-${idx}`}
                device={device}
                onAction={onDeviceAction}
              />
            ))
          )}

          {hasNext && !isLoading && (
            <div ref={sentinelRef} className={styles.sentinel} />
          )}

          {isLoading && <div className={styles.spinner}>Caricamento…</div>}
        </div>
      </div>
    </div>
  );
};
