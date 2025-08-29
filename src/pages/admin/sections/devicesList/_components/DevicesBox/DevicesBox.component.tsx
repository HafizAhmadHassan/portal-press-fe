import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateTicketMutation } from "@store_admin/tickets/ticket.api";
import styles from "./DevicesBox.module.scss";
import type { Device } from "@store_admin/devices/devices.types";
import type { MessageCreate } from "@store_admin/tickets/ticket.types";
import { DevicesBoxHeader } from "./_components/DevicesBoxHeader/DevicesBoxHeader.component";
import { DevicesBoxContent } from "./_components/DevicesBoxContent/DevicesBoxContent.component";
import { DevicesBoxFooter } from "./_components/DevicesBoxFooter/DevicesBoxFooter.component";

interface DevicesBoxProps {
  device: Device;
  onAction: (actionKey: string, device: Device) => void;
  style?: React.CSSProperties;
}

export const DevicesBox: React.FC<DevicesBoxProps> = ({
  device,
  onAction,
  style,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const isActive = device.status === 1;
  const [createTicket, { isLoading: isCreating }] = useCreateTicketMutation();

  // Helper functions
  const getFullAddress = () => {
    const parts = [device.address, device.municipality || device.city].filter(
      Boolean
    );
    return parts.length > 0 ? parts.join(", ") : "Ubicazione non specificata";
  };

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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    (e.target as HTMLImageElement).style.display = "none";
  };

  const handleGoToPLC = () => {
    if (device?.id !== undefined && device?.id !== null) {
      navigate(`/device/${device.id}`);
    }
    onAction?.("plc", device);
  };

  const handleTicketSave = async (ticketData: MessageCreate) => {
    try {
      const created = await createTicket(ticketData).unwrap();
      console.log("Ticket creato:", created);
      onAction?.("ticket:created", device);
    } catch (e: any) {
      console.error("Errore creazione ticket", e);
      alert(
        e?.data?.message || e?.message || "Errore nella creazione del ticket"
      );
      throw e;
    }
  };

  return (
    <div
      className={`
        ${styles.compactDevicesBox} 
        ${isActive ? styles.isActive : styles.isInactive}
        ${isHovered ? styles.isHovered : ""}
      `.trim()}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-device-id={device.id}
      data-status={isActive ? "active" : "inactive"}
    >
      <DevicesBoxHeader
        device={device}
        isActive={isActive}
        getWasteColorVar={getWasteColorVar}
      />

      <DevicesBoxContent
        device={device}
        isActive={isActive}
        imageUrl={import.meta.env.VITE_IMAGE_DEFAULT}
        onImageError={handleImageError}
        getFullAddress={getFullAddress}
      />

      <DevicesBoxFooter
        device={device}
        isActive={isActive}
        isCreating={isCreating}
        onGoToPLC={handleGoToPLC}
        onTicketSave={handleTicketSave}
      />
    </div>
  );
};
