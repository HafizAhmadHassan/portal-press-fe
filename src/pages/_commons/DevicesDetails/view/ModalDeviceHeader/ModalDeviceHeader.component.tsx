import styles from "@sections_admin/devicesList/_modals/ModalDeviceDetail/ModalDeviceDetail.module.scss";
import {
  AlertCircle,
  CheckCircle,
  Monitor,
  Shield,
  XCircle,
} from "lucide-react";
import { WasteBadge } from "@shared/waste-badge/WasteBadge.component.tsx";
import DevicesMap from "../../../../admin/sections/devicesList/_components/DevicesMap/DevicesMap";

export default function ModalDeviceHeader({
  device,
  displayName,
  getFullAddress,
}: {
  device: any;
  displayName: string;
  getFullAddress: any;
}) {
  // Verifica se le coordinate GPS sono disponibili e valide
  const hasValidCoordinates =
    device?.gps_x &&
    device?.gps_y &&
    device.gps_x !== "0" &&
    device.gps_y !== "0" &&
    device.gps_x !== "" &&
    device.gps_y !== "" &&
    !isNaN(Number(device.gps_x)) &&
    !isNaN(Number(device.gps_y));

  // Calcola le coordinate solo se sono valide
  let center: [number, number] | null = null;
  if (hasValidCoordinates) {
    const lat = Number(device.gps_x); // LATITUDINE
    const lng = Number(device.gps_y); // LONGITUDINE
    center = [lat, lng];
  } /* else {
    console.log("Invalid coordinates:", {
      gps_x: device?.gps_x,
      gps_y: device?.gps_y,
    });
  } */

  return (
    <div className={styles.deviceHeader}>
      <div className={styles.iconSection}>
        <div className={styles.deviceIcon}>
          <Monitor size={48} />
        </div>
        <div className={styles.statusIndicator}>
          {device?.status === 1 ? (
            <CheckCircle className={styles.statusIconActive} />
          ) : (
            <XCircle className={styles.statusIconInactive} />
          )}
        </div>
      </div>

      <div className={styles.deviceMainInfo}>
        <h3 className={styles.deviceName}>{displayName}</h3>
        <p className={styles.deviceCustomer}>
          {device?.customer ||
            device?.customerName ||
            "Cliente non specificato"}
        </p>
        <p className={styles.deviceLocation}>{getFullAddress()}</p>

        <div className={styles.deviceBadges}>
          <WasteBadge waste={device?.waste} />
          <span
            className={`${styles.statusBadge} ${
              device?.status === 1 ? styles.statusActive : styles.statusInactive
            }`}
          >
            {device?.status === 1 ? "Attivo" : "Inattivo"}
          </span>
          {device?.status_Machine_Blocked && (
            <span className={styles.blockedBadge}>
              <Shield className={styles.badgeIcon} />
              Bloccato
            </span>
          )}
          {device?.tatus_ready_d75_3_7 && (
            <span className={styles.readyBadge}>
              <CheckCircle className={styles.badgeIcon} />
              Pronto
            </span>
          )}
        </div>
      </div>

      <div
        className={
          hasValidCoordinates && center
            ? styles.mapWrapper
            : styles.noMapWrapper
        }
      >
        {hasValidCoordinates && center ? (
          // MOSTRA LA MAPPA se le coordinate sono valide
          <DevicesMap
            mapData={[device]}
            isCollapsed={false}
            center={center}
            showActions={false}
            mapHeight="100%"
            zoom={14}
          />
        ) : (
          // MOSTRA MESSAGGIO se le coordinate non sono disponibili
          <div className={styles.noCoordinatesMessage}>
            <div className={styles.noCoordinatesContent}>
              <AlertCircle className={styles.noCoordinatesIcon} size={32} />
              <div className={styles.noCoordinatesText}>
                <h4 className={styles.noCoordinatesTitle}>
                  Coordinate non disponibili
                </h4>
                <p className={styles.noCoordinatesDescription}>
                  Non è possibile visualizzare la mappa per questo device.
                </p>
                {(device?.gps_x || device?.gps_y) && (
                  <div className={styles.coordinatesDebug}>
                    <small>
                      GPS X: {device.gps_x || "N/A"} | GPS Y:{" "}
                      {device.gps_y || "N/A"}
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
