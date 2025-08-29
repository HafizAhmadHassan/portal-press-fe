import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import stylesRegister from "./RegisterInfo.module.scss";
import { Badge } from "lucide-react";

export default function RegisterInfo({ device }: { device: any }) {
  return (
    <DeviceCard title="Codici e Matricole" icon={<Badge />}>
      <div className={stylesRegister.matricoleGrid}>
        <div className={stylesRegister.matricoleItem}>
          <div className={stylesRegister.matricoleHeader}>
            <Badge className={stylesRegister.matricoleIcon} />
            <span className={stylesRegister.matricoleTitle}>Matricola BTE</span>
          </div>
          <span className={stylesRegister.matricoleValue}>
            {device?.matricola_Bte || "N/A"}
          </span>
        </div>

        <div className={stylesRegister.matricoleItem}>
          <div className={stylesRegister.matricoleHeader}>
            <Badge className={stylesRegister.matricoleIcon} />
            <span className={stylesRegister.matricoleTitle}>Matricola KGN</span>
          </div>
          <span className={stylesRegister.matricoleValue}>
            {device?.matricola_Kgn || "N/A"}
          </span>
        </div>
      </div>
    </DeviceCard>
  );
}
