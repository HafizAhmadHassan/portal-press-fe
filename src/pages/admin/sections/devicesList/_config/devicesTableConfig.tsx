import type { Device } from "@store_admin/devices/devices.types";
import { WasteBadge } from "@shared/waste-badge/WasteBadge.component";
import { ModalDeviceDetails } from "@sections_admin/devicesList/_modals/ModalDeviceDetail/ModalDeviceDetail.component";
import { ModalEditDevice } from "@sections_admin/devicesList/_modals/ModalEditDevice/ModalEditDevice.component";
import { ModalRiActiveDevice } from "@sections_admin/devicesList/_modals/ModalRiActivateDevice/ModalRiActiveDevice.component";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";
import { ModalDeleteDevicesConfirm } from "@sections_admin/devicesList/_modals/ModalDeleteDevicesConfirm/ModalDeleteDevicesConfirm.component";
import type { TableColumn } from "@components/shared/table/types/GenericTable.types";
import styles from "../_styles/DevicesTableConfig.module.scss";

interface DevicesColumnsProps {
  onEdit: (deviceId: number, updatedData: Partial<Device>) => Promise<void>;
  onDelete: (device: Device) => Promise<void>;
  onToggleStatus: (device: Device) => void;
}

// Definizione del tipo delle colonne includendo chiavi virtuali
type DeviceColumnKey = keyof Device | "actions";

export const getDevicesColumns = ({
  onEdit,
  onDelete,
}: DevicesColumnsProps): Array<TableColumn<Device, DeviceColumnKey>> => {
  const tPrimary = "var(--text-primary)";
  const tSecondary = "var(--text-secondary)";

  return [
    // Colonna Nome Macchina
    {
      key: "machine_Name",
      header: "Nome Macchina",
      type: "custom",
      width: "200px",
      sortable: true,
      render: (_value, device) => (
        <div className={styles.nameCell}>
          <div
            style={{
              fontWeight: 600,
              fontSize: "14px",
              color: tPrimary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={device.machine_Name || `Device ${device.id}`}
          >
            {device.machine_Name || `Device ${device.id}`}
          </div>
        </div>
      ),
    },

    // Colonna Stato
    {
      key: "status",
      header: "Stato",
      type: "custom",
      width: "110px",
      sortable: true,
      render: (_value, device) => (
        <span
          className={`${styles.badge} ${
            device.status === 1 ? styles["badge--ok"] : styles["badge--ko"]
          }`}
        >
          {device.status === 1 ? "Attivo" : "Inattivo"}
        </span>
      ),
    },

    // Colonna Tipo Rifiuto
    {
      key: "waste",
      header: "Tipo Rifiuto",
      type: "custom",
      width: "130px",
      sortable: true,
      render: (_value, device) => (
        <div className={styles.wasteCell}>
          <WasteBadge waste={device.waste} />
        </div>
      ),
    },

    // Colonna Città
    {
      key: "city",
      header: "Città",
      type: "custom",
      width: "150px",
      sortable: true,
      render: (_value, device) => device.city || "N/A",
    },

    // Colonna Cliente
    {
      key: "customer_Name",
      header: "Cliente",
      type: "custom",
      width: "180px",
      sortable: true,
      render: (_value, device) =>
        device.customer || (device as any).customer_Name || "N/A",
    },

    // Colonna Blocco
    {
      key: "status_Machine_Blocked",
      header: "Blocco",
      type: "custom",
      width: "110px",
      sortable: true,
      render: (_value, device) => (
        <span
          className={`${styles.badge} ${
            device.status_Machine_Blocked
              ? styles["badge--danger"]
              : styles["badge--ok"]
          }`}
        >
          {device.status_Machine_Blocked ? "Bloccato" : "Libero"}
        </span>
      ),
    },

    // Colonna Data Creazione
    {
      key: "created_At",
      header: "Data Creazione",
      type: "custom",
      width: "150px",
      sortable: true,
      render: (_value, device) => {
        if (!device.created_At)
          return <span style={{ color: tSecondary }}>N/A</span>;
        const date = new Date(device.created_At);
        return (
          <div className={styles.dateCell}>
            <div style={{ fontSize: "14px", color: tPrimary }}>
              {date.toLocaleDateString("it-IT")}
            </div>
            <div style={{ fontSize: "12px", color: tSecondary }}>
              {date.toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        );
      },
    },

    // Colonna Azioni
    {
      key: "actions",
      header: "Azioni",
      type: "custom",
      width: "220px",
      render: (_value, device) => (
        <div className={styles.actionsRow}>
          {device.status === 1 ? (
            <SimpleButton variant="filled" color="secondary" size="sm" disabled>
              Attivo
            </SimpleButton>
          ) : (
            <ModalRiActiveDevice
              device={device}
              triggerButton={
                <SimpleButton variant="filled" color="success" size="sm">
                  Riattiva
                </SimpleButton>
              }
            />
          )}

          <ModalDeviceDetails device={device} />

          <ModalEditDevice
            device={device}
            onSave={async (updatedData) => {
              if (!updatedData)
                throw new Error("Updated device data is required");
              await onEdit(device.id, updatedData);
            }}
          />

          <ModalDeleteDevicesConfirm
            device={device}
            onConfirm={() => onDelete(device)}
          />
        </div>
      ),
    },
  ];
};

// Funzione di configurazione per compatibilità con il vecchio sistema
export const createDevicesTableConfig = ({
  devices,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading = false,
  sortBy,
  sortOrder,
  onSort,
  pagination,
}: {
  devices: Device[];
  onEdit: (deviceId: number, updatedData: Partial<Device>) => Promise<void>;
  onDelete: (device: Device) => Promise<void>;
  onToggleStatus: (device: Device) => void;
  isLoading?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string, order: "asc" | "desc") => void;
  pagination?: any;
}) => {
  const columns = getDevicesColumns({
    onEdit,
    onDelete,
    onToggleStatus,
  });

  return {
    columns,
    data: devices,
    loading: isLoading,
    pagination: pagination || { enabled: true, pageSize: 10, currentPage: 1 },
    sorting: {
      enabled: true,
      currentSort: sortBy
        ? { key: sortBy, direction: sortOrder || "asc" }
        : null,
      onSort,
    },
    selection: {
      enabled: false,
      selectedItems: [],
      idField: "id",
    },
    emptyMessage:
      "Nessun dispositivo trovato. Prova a modificare i filtri di ricerca.",
    className: "devices-table",
  };
};
