import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import stylesCoordinates from "./CoordinatesInfo.module.scss";
import { MapPin, Smartphone } from "lucide-react";

export default function CoordinatesInfo({
  device,
  formatCoordinates,
}: {
  device: any;
  formatCoordinates: any;
}) {
  const hasCoords =
    device?.gps_x &&
    device?.gps_y &&
    !isNaN(parseFloat(device?.gps_x)) &&
    !isNaN(parseFloat(device?.gps_y));

  return (
    <DeviceCard title="Coordinate GPS" icon={<Smartphone />}>
      <div className={stylesCoordinates.gpsWrapper}>
        <div className={stylesCoordinates.gpsDisplay}>
          <span className={stylesCoordinates.gpsLabel}>Coordinate:</span>
          <span className={stylesCoordinates.gpsValue}>
            {formatCoordinates(device?.gps_x, device?.gps_y)}
          </span>
        </div>

        {hasCoords && (
          <div className={stylesCoordinates.gpsActions}>
            {/* Google Maps richiede "lat,lng". Se gps_x è lat e gps_y è lng, l’ordine corretto è x,y */}
            <a
              href={`https://www.google.com/maps?q=${device?.gps_x},${device?.gps_y}`}
              target="_blank"
              rel="noopener noreferrer"
              className={stylesCoordinates.mapLink}
            >
              <MapPin size={16} />
              Visualizza su Maps
            </a>
          </div>
        )}
      </div>
    </DeviceCard>
  );
}
