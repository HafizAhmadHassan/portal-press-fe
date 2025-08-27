import React from "react";
import { GenericTableWithLogic } from "@shared/table/components/GenericTableWhitLogic.component.tsx";
import { createDevicesTableConfig } from "@sections_admin//devicesList/_config/devicesTableConfig";
import type { Device } from "@store_admin/devices/device.types";

interface DevicesTableProps {
  devices: Device[];
  statusFilter?: "tutti" | "attivi" | "disattivati";
  isLoading?: boolean;
  onDeviceAction?: (action: string, device: Device) => void;
}

const DevicesTable: React.FC<DevicesTableProps> = ({
  devices,
  statusFilter = "tutti",
  isLoading = false,
  onDeviceAction,
}) => {
  const handleView = (device: Device) => {
    onDeviceAction?.("view", device);
  };

  const handleEdit = (device: Device) => {
    onDeviceAction?.("edit", device);
  };

  const handleDelete = (device: Device) => {
    onDeviceAction?.("delete", device);
  };

  const handleToggleStatus = (device: Device) => {
    onDeviceAction?.("toggle_status", device);
  };

  const tableConfig = createDevicesTableConfig({
    devices,
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onToggleStatus: handleToggleStatus,
    isLoading,
  });

  return (
    <GenericTableWithLogic
      config={tableConfig}
      searchFields={["machineName", "city", "customer", "customerName"]}
      // loading={isLoading}
    />
  );
};

export default DevicesTable;
