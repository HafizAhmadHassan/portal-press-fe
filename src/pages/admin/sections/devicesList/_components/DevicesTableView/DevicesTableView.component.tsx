import React, { useMemo } from "react";
import type { Device } from "@store_admin/devices/devices.types";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component";
import { createDevicesTableConfig } from "../../_config/devicesTableConfig";
import styles from "./DevicesTableView.module.scss";

type Props = {
  devices: Device[];
  isLoading: boolean;
  onEdit: (deviceId: number, updatedData: Partial<Device>) => Promise<void>;
  onDelete: (device: Device) => Promise<void>;
  onToggleStatus: () => Promise<void>;
};

/**
 * Componente che visualizza i dispositivi in formato tabella
 */
export const DevicesTableView: React.FC<Props> = ({
  devices,
  isLoading,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const tableConfig = useMemo(
    () =>
      createDevicesTableConfig({
        devices,
        onEdit,
        onDelete,
        onToggleStatus,
        isLoading,
      }),
    [devices, onEdit, onDelete, onToggleStatus, isLoading]
  );

  return (
    <div className={styles.devicesTableWrapper}>
      <GenericTableWithLogic config={tableConfig} />
    </div>
  );
};
