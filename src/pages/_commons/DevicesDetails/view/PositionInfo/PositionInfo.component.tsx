import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import stylesPosition from "./PositionInfo.module.scss";
import { MapPin } from "lucide-react";

export default function PositionInfo({ device }: any) {
  return (
    <DeviceCard title="Informazioni di Ubicazione" icon={<MapPin />}>
      <div className={stylesPosition.infoGrid}>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>Indirizzo</span>
          <span className={stylesPosition.infoValue}>
            {device?.street || device?.address || "Non specificato"}
          </span>
        </div>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>Città</span>
          <span className={stylesPosition.infoValue}>
            {device?.city || "Non specificata"}
          </span>
        </div>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>Provincia</span>
          <span className={stylesPosition.infoValue}>
            {device?.province || "Non specificata"}
          </span>
        </div>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>CAP</span>
          <span className={stylesPosition.infoValue}>
            {device?.postal_Code || device?.postalCode || "Non specificato"}
          </span>
        </div>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>Paese</span>
          <span className={stylesPosition.infoValue}>
            {device?.country || "Non specificato"}
          </span>
        </div>
        <div className={stylesPosition.infoItem}>
          <span className={stylesPosition.infoLabel}>Municipalità</span>
          <span className={stylesPosition.infoValue}>
            {device?.municipality || "Non specificata"}
          </span>
        </div>
      </div>
    </DeviceCard>
  );
}
