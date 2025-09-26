import type { Device } from "@store_admin/devices/devices.types";
import { WasteBadge } from "@shared/waste-badge/WasteBadge.component";
import { ModalDeviceDetails } from "@sections_admin/devicesList/_modals/ModalDeviceDetail/ModalDeviceDetail.component";
import { ModalRiActiveDevice } from "@root/pages/admin/sections/devicesList/_modals/ModalRiActivateDevice/ModalRiActivateDevice.component";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";
import { ModalDeleteDevicesConfirm } from "@sections_admin/devicesList/_modals/ModalDeleteDevicesConfirm/ModalDeleteDevicesConfirm.component";
import type { TableColumn } from "@components/shared/table/types/GenericTable.types";
import styles from "../_styles/DevicesTableConfig.module.scss";
import { ModalCreateUpdateDevice } from "../_modals/ModalCreateUpdateDevice/ModalCreateUpdateDevice.component";
import { ExternalLink } from "lucide-react";

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
      header: "Id",
      type: "custom",
      width: "100px",
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
      width: "120px",
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
      width: "120px",
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

    {
      key: "ip_Router",
      header: "IP Router",
      type: "custom",
      width: "150px",
      sortable: true,
      render: (_value, device) => {
        return (
          <div>
            <div style={{ fontSize: "12px" }}>
              <span style={{ color: tPrimary }}>IP: </span>
              {device.ip_Router || (
                <span style={{ color: tSecondary }}>N/A</span>
              )}
            </div>
            <div style={{ fontSize: "12px" }}>KGN: {device.matricola_Kgn}</div>
            <div style={{ fontSize: "12px" }}>BTE: {device.matricola_Bte}</div>
          </div>
        );
      },
    },
    {
      key: "codice_GPS",
      header: "GPS",
      type: "custom",
      width: "160px",
      sortable: true,
      render: (_v, device) => {
        if (!device.codice_GPS)
          return <span style={{ color: tSecondary }}>N/A</span>;

        return (
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              gap: "4px",
            }}
          >
            <SimpleButton
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-start",
                padding: "5px",
              }}
              color="warning"
              size="sm"
              href={`https://www.google.com/maps/search/?api=1&query=${device.gps_x},${device.gps_y}`}
              target="_blank"
              className="relative"
            >
              <div style={{ fontSize: "12px", color: "#333", fontWeight: 900 }}>
                <div>Lat: {device.gps_x || "N/A"}</div>
                <div>Lon: {device.gps_y || "N/A"}</div>
              </div>

              {/* icona in alto a destra */}
            </SimpleButton>
            <ExternalLink
              size={24}
              style={{
                position: "absolute",
                border: "2px solid var(--warning-color)",
                backgroundColor: "#fff",
                borderRadius: "50%",
                top: "-10px",
                right: "-10px",
                color: "var(--warning-color)",
                padding: "3px",
              }}
            />
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

          <ModalCreateUpdateDevice
            mode="edit"
            initialDevice={device}
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
