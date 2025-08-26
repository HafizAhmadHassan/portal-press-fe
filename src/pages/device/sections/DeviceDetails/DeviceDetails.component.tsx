import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, RotateCw } from "lucide-react";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import type { Device } from "@store_admin/devices/devices.types.ts";

// Sotto-componenti già esistenti (riutilizzati dalla modale)

// ⚠️ Adatta questi import ai tuoi hook reali
import { useGetDeviceByIdQuery } from "@store_admin/devices/devices.api";

import styles from "./DeviceDetails.module.scss";
import Summary from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/Summary/Summary.component";
import NoteInfo from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/NoteInfo/NoteInfo.component";
import PositionInfo from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/PositionInfo/PositionInfo.component";
import RegisterInfo from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/RegisterInfo/RegisterInfo.component";
import TechnicalInfo from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/TechnicalInfo/TechnicalInfo.component";
import DateHoursInfo from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/DateHoursInfo/DateHoursInfo.component";
import CoordinatesInfo from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/CoordinatesInfo/CoordinatesInfo.component";
import ModalDeviceHeader from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/ModalDeviceHeader/ModalDeviceHeader.component";

export default function DeviceDetailsPage() {
  const navigate = useNavigate();
  const { deviceId } = useParams<{ deviceId: string }>();

  const parsedId = deviceId ? Number(deviceId) : undefined;
  const { data: device, refetch } = useGetDeviceByIdQuery(parsedId!, {
    skip: !parsedId,
  });

  // Helpers (copiati dalla modale)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Mai";
    const date = new Date(dateString);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Oggi";
    if (diffInDays === 1) return "Ieri";
    if (diffInDays < 7) return `${diffInDays} giorni fa`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} settimane fa`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} mesi fa`;
    return `${Math.floor(diffInDays / 365)} anni fa`;
  };

  const formatCoordinates = (
    x: string | null | undefined,
    y: string | null | undefined
  ) => {
    if (!x || !y) return "N/A";
    const lat = parseFloat(y);
    const lng = parseFloat(x);
    if (isNaN(lat) || isNaN(lng)) return "Non valide";
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  const getFullAddress = (d?: Device) => {
    const parts = [d?.street || d?.address, d?.city, d?.province].filter(
      Boolean
    );
    return parts.length > 0 ? parts.join(", ") : "Indirizzo non disponibile";
  };

  const displayName = device?.machine_name || `Dispositivo ${device?.id}`;

  return (
    <section className={styles.page}>
      <div className={styles.pageContent}>
        <ModalDeviceHeader
          device={device}
          displayName={displayName}
          getFullAddress={() => getFullAddress(device)}
        />

        <TechnicalInfo device={device} />
        <PositionInfo device={device} />
        <DateHoursInfo
          device={device}
          formatDate={formatDate}
          getRelativeTime={getRelativeTime}
        />
        <CoordinatesInfo
          device={device}
          formatCoordinates={formatCoordinates}
        />
        <RegisterInfo device={device} />
        {device?.note && <NoteInfo device={device} />}
        <Summary device={device} />
      </div>
    </section>
  );
}
