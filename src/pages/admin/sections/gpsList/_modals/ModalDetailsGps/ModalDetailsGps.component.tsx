import React, { useMemo } from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";
import { Eye } from "lucide-react";
import styles from "./ModalDetailsGps.module.scss";
import type { GpsDevice } from "@store_admin/gps/gps.types";
import { GpsMapCard } from "./_components/GpsMapCard/GpsMapCard.component";
import { GpsDetailsCard } from "./_components/GpsDetailsCard/GpsDetailsCard.component";
import { GpsCoordsCard } from "./_components/GpsCoordsCard/GpsCoordsCard.component";

type Props = { device: GpsDevice };

export const ModalDetailsGps: React.FC<Props> = ({ device }) => {
  // parsing sicuro delle coordinate
  const { hasCoords, center } = useMemo(() => {
    const lat = Number(device.gps_x);
    const lng = Number(device.gps_y);
    const ok = Number.isFinite(lat) && Number.isFinite(lng);
    return {
      hasCoords: ok,
      center: (ok ? [lat, lng] : undefined) as [number, number] | undefined,
    };
  }, [device.gps_x, device.gps_y]);

  return (
    <Modal
      size="lg"
      triggerButton={
        <SimpleButton size="bare" color="primary" variant="ghost" icon={Eye} />
      }
      cancelText="Chiudi"
    >
      <div className={styles.modalContent}>
        <GpsMapCard device={device} hasCoords={hasCoords} center={center} />
        <GpsDetailsCard device={device} />
        <GpsCoordsCard device={device} />
      </div>
    </Modal>
  );
};

export default ModalDetailsGps;
