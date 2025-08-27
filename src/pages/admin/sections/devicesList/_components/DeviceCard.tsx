import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Device } from "@store_admin/devices/devices.types";
import styles from "../_styles/DeviceCard.module.scss";
import {
  EyeIcon,
  MapPinIcon,
  PowerIcon,
  SpoolIcon,
  WifiIcon,
  ZapIcon,
} from "lucide-react";
import { ModalDeviceDetails } from "@sections_admin/devicesList/_modals/ModalDeviceDetail/ModalDeviceDetail.component";
import { ModalRiActiveDevice } from "@sections_admin/devicesList/_modals/ModalRiActivateDevice/ModalRiActiveDevice.component";
import { useCreateTicketMutation } from "@store_admin/tickets/ticket.api";
import type { MessageCreate } from "@store_admin/tickets/ticket.types";
import ModalOpenTicket from "../../ticketsList/_modals/ModalsOpenTicket/ModalOpenTicket.component";
import {
  PopOver,
  type PopOverItem,
} from "@root/components/shared/pop-over/PopOver.component";
import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";

interface DeviceCardProps {
  device: Device;
  onAction: (actionKey: string, device: Device) => void;
  style?: React.CSSProperties;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({
  device,
  onAction,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isActive = device.status === 1;
  const navigate = useNavigate();

  // RTK Query mutation per creare il ticket (POST /messages/)
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();

  // Indirizzo completo
  const getFullAddress = () => {
    const parts = [device.address, device.municipality || device.city].filter(
      Boolean
    );
    return parts.length > 0 ? parts.join(", ") : "Ubicazione non specificata";
  };

  // Colore per tipo rifiuto (usa CSS vars dei token)
  const getWasteColorVar = (wasteType: string | null | undefined) => {
    const key = (wasteType || "N/A").toUpperCase();
    switch (key) {
      case "PLASTICA":
        return "var(--warning-color)";
      case "CARTA":
        return "var(--primary-color)";
      case "ORGANICO":
        return "var(--success-color)";
      case "VETRO":
        return "var(--purple-color)";
      case "INDIFFERENZIATO":
        return "var(--gray-500)";
      default:
        return "var(--text-secondary)";
    }
  };

  // Immagine (fallback)
  const imageUrl = import.meta.env.VITE_IMAGE_DEFAULT;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).style.display = "none";
  };

  const cardClasses = [
    styles["compact-device-card"],
    isActive ? styles["is-active"] : styles["is-inactive"],
    isHovered ? styles["is-hovered"] : "",
  ]
    .filter(Boolean)
    .join(" ");

  /** ---------------------------
   *  Menu 3 puntini (Popover)
   * --------------------------*/
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleGoToPLC = () => {
    if (device?.id !== undefined && device?.id !== null) {
      navigate(`/device/${device.id}`);
    }
    // Callback opzionale per tracciare l’azione
    onAction?.("plc", device);
    // Il PopOver ha closeOnSelect, ma chiudo anche qui per sicurezza
    setMenuOpen(false);
  };

  const menuItems: PopOverItem[] = [
    {
      key: "plc",
      label: "Vai ai PLC",
      icon: <PowerIcon size={14} />,
      onSelect: handleGoToPLC,
    },
    {
      key: "details",
      label: "Vai ai dettagli",
      icon: <EyeIcon size={14} />,
      onSelect: () => onAction?.("details", device),
    },
  ];

  return (
    <div
      className={cardClasses}
      style={{
        ...style,
        opacity: 1,
        visibility: "visible",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      key={`device-${device.id || Math.random()}`}
      data-device-id={device.id}
      data-status={isActive ? "active" : "inactive"}
    >
      {/* Header compatto */}
      <div className={styles["compact-header"]}>
        <div
          className={[
            styles["status-dot"],
            isActive ? styles["is-active"] : styles["is-inactive"],
          ].join(" ")}
        />
        <div
          className={styles["waste-badge"]}
          style={{
            backgroundColor: getWasteColorVar(device.waste),
            color: "var(--white)",
          }}
        >
          {device.customer_Name || "N/A"}
        </div>
        <div
          className={styles["waste-badge"]}
          style={{
            backgroundColor: getWasteColorVar(device.waste),
            color: "var(--white)",
          }}
        >
          {device.waste || "N/A"}
        </div>

        <div
          className={styles["actions-menu"]}
          style={{ position: "relative" }}
        >
          <ModalDeviceDetails
            device={device}
            triggerButton={
              <SimpleButton variant="ghost" size="sm" color="warning">
                <ZapIcon size={12} />
              </SimpleButton>
            }
          />

          {/* MENU POPOVER (si apre sopra la card) */}
          <PopOver
            anchorEl={menuBtnRef.current}
            open={menuOpen}
            onClose={() => setMenuOpen(false)}
            items={menuItems}
            headerLabel="Azioni"
            placement="top"
            align="end"
            offset={10}
            closeOnSelect
          />
        </div>
      </div>

      {/* Contenuto compatto */}
      <div className={styles["compact-content"]}>
        {/* Sinistra: thumb */}
        <div className={styles["device-thumb"]}>
          <img
            src={imageUrl}
            alt="Device"
            onError={handleImageError}
            loading="lazy"
          />
          <div
            className={[
              styles["wifi-indicator"],
              isActive ? styles["is-active"] : styles["is-inactive"],
            ].join(" ")}
          >
            <WifiIcon size={10} />
          </div>
        </div>

        {/* Destra: info */}
        <div className={styles["device-info-compact"]}>
          <div className={styles["device-location"]}>
            <MapPinIcon size={12} />
            <span>{getFullAddress()}</span>
          </div>

          <div className={styles["device-technical"]}>
            {device.ip_Router && (
              <span className={styles["tech-detail"]}>
                IP: {device.ip_Router}
              </span>
            )}
            {device.codice_GPS && (
              <span className={styles["tech-detail"]}>
                GPS: {device.codice_GPS}
              </span>
            )}
          </div>

          <div
            className={[
              styles["status-text"],
              isActive ? styles["is-active"] : styles["is-inactive"],
            ].join(" ")}
          >
            {isActive ? "Operativo" : "Non Operativo"}
          </div>
        </div>
      </div>

      {/* Footer compatto */}
      <div className={styles["compact-footer"]}>
        {!isActive && (
          <ModalRiActiveDevice
            device={device}
            triggerButton={
              <SimpleButton
                variant="filled"
                color="error"
                size="sm"
                className={[styles["compact-btn"], styles.error].join(" ")}
              >
                <PowerIcon size={12} />
              </SimpleButton>
            }
          />
        )}
        <SimpleButton
          size="sm"
          variant="filled"
          type="button"
          color="primary"
          onClick={handleGoToPLC}
        >
          <EyeIcon size={12} />
        </SimpleButton>

        <ModalOpenTicket
          device={device}
          onSave={async (ticketData: MessageCreate) => {
            try {
              const created = await createTicket(ticketData).unwrap();
              console.log("Ticket creato:", created);
              onAction && onAction("ticket:created", device);
            } catch (e: any) {
              console.error("Errore creazione ticket", e);
              alert(
                e?.data?.message ||
                  e?.message ||
                  "Errore nella creazione del ticket"
              );
              throw e;
            }
          }}
          triggerButton={
            <SimpleButton
              variant="filled"
              size="sm"
              color="warning"
              disabled={isCreating}
              /* className={[styles["compact-btn"], styles["warning"]].join(" ")} */
            >
              <SpoolIcon size={12} />
            </SimpleButton>
          }
        />
      </div>
    </div>
  );
};
