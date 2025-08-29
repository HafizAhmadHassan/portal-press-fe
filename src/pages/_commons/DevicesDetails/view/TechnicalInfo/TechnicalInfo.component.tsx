import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import stylesTechnical from "./TechnicalInfo.module.scss";
import { Settings } from "lucide-react";

export default function TechnicalInfo({ device }: any) {
  return (
    <DeviceCard title="Informazioni Tecniche" icon={<Settings />}>
      <div className={stylesTechnical.infoGrid}>
        <div className={stylesTechnical.infoItem}>
          <span className={stylesTechnical.infoLabel}>ID Dispositivo</span>
          <span className={stylesTechnical.infoValue}>#{device?.id}</span>
        </div>
        <div className={stylesTechnical.infoItem}>
          <span className={stylesTechnical.infoLabel}>Nome Macchina</span>
          <span className={stylesTechnical.infoValue}>
            {device?.machine_Name || "Non specificato"}
          </span>
        </div>
        <div className={stylesTechnical.infoItem}>
          <span className={stylesTechnical.infoLabel}>Versione Linux</span>
          <span className={stylesTechnical.infoValue}>
            {device?.linux_Version || "Non specificata"}
          </span>
        </div>
        <div className={stylesTechnical.infoItem}>
          <span className={stylesTechnical.infoLabel}>IP Router</span>
          <span className={stylesTechnical.infoValue}>
            {device?.ip_Router || "N/A"}
          </span>
        </div>
        <div className={stylesTechnical.infoItem}>
          <span className={stylesTechnical.infoLabel}>Codice GPS</span>
          <span className={stylesTechnical.infoValue}>
            {device?.codice_Gps || "N/A"}
          </span>
        </div>
        <div className={stylesTechnical.infoItem}>
          <span className={stylesTechnical.infoLabel}>Sheet Name</span>
          <span className={stylesTechnical.infoValue}>
            {device?.sheet_Name || "N/A"}
          </span>
        </div>
      </div>
    </DeviceCard>
  );
}
