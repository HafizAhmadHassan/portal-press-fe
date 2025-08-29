import React, { useMemo } from "react";
import { MapPin } from "lucide-react";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./GpsMapCard.module.scss";
import type { GpsDevice } from "@store_admin/gps/gps.types";
import type { Device } from "@root/pages/admin/core/store/devices/devices.types";
import GpsMap from "../../../../_components/GpsMap";

type Props = {
  device: GpsDevice;
  hasCoords: boolean;
  center?: [number, number];
};

export const GpsMapCard: React.FC<Props> = ({ device, hasCoords, center }) => {
  // parse sicuro delle coordinate
  const lat = Number(device.gps_x);
  const lng = Number(device.gps_y);

  // adattamento dati per GpsMap (includo anche le coordinate dentro l'item)
  const mapData = useMemo(() => {
    const item: Device & {
      id: number | string;
      gps_x?: number | string;
      gps_y?: number | string;
      latitude?: number;
      longitude?: number;
    } = {
      id: device.id,
      machine_Name: "",
      status: 0,
      status_READY_D75_3_7: false,
      status_Machine_Blocked: false,
      created_At: "",
      updated_At: "",
      // quello che la tua mappa usa davvero
      waste: device.waste as Device["waste"],
      // IMPORTANTISSIMO: coords anche nell'item
      gps_x: device.gps_x,
      gps_y: device.gps_y,
      latitude: Number.isFinite(lat) ? lat : undefined,
      longitude: Number.isFinite(lng) ? lng : undefined,
    } as any;

    return [item];
  }, [device]);

  return (
    <DeviceCard
      title="Mappa"
      icon={<MapPin size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.mapWrapper}>
        {hasCoords && center ? (
          <GpsMap
            mapData={mapData}
            isCollapsed={false}
            center={center} // [lat, lng]
            showActions={false}
            mapHeight="100%"
            zoom={14}
          />
        ) : (
          <div className={styles.mapPlaceholder}>
            <MapPin className={styles.mapPlaceholderIcon} />
            <div className={styles.mapPlaceholderText}>
              Coordinate non disponibili
            </div>
          </div>
        )}
      </div>
    </DeviceCard>
  );
};
