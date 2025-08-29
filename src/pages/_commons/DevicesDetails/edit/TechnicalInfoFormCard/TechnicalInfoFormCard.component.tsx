import { Smartphone } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import DeviceCard from "../../../../device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "../../../../device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";

type Props = {
  formData: {
    ip_Router: string;
    codiceGps: string;
    gpsX: string;
    gpsY: string;
    matricolaBte: string;
    matricolaKgn: string;
    sheetName: string;
  };
  isSaving: boolean;
  onChange: (field: string, value: any) => void;
};

export default function TechnicalInfoFormCard({
  formData,
  isSaving,
  onChange,
}: Props) {
  return (
    <DeviceCard title="Informazioni Tecniche" icon={<Smartphone size={18} />}>
      <DeviceFormGrid>
        <Input
          label="IP Router"
          name="ip_Router"
          value={formData.ip_Router}
          onChange={(e) => onChange("ip_Router", e.target.value)}
          placeholder="192.168.1.100"
          disabled={isSaving}
        />
        <Input
          label="Codice GPS"
          name="codiceGps"
          value={formData.codiceGps}
          onChange={(e) => onChange("codiceGps", e.target.value)}
          placeholder="Codice identificativo GPS"
          disabled={isSaving}
        />
      </DeviceFormGrid>
      <DeviceFormGrid>
        <Input
          label="Coordinate GPS X (Longitudine)"
          name="gpsX"
          value={formData.gpsX}
          onChange={(e) => onChange("gpsX", e.target.value)}
          placeholder="es. 12.4964"
          disabled={isSaving}
        />
        <Input
          label="Coordinate GPS Y (Latitudine)"
          name="gpsY"
          value={formData.gpsY}
          onChange={(e) => onChange("gpsY", e.target.value)}
          placeholder="es. 41.9028"
          disabled={isSaving}
        />
      </DeviceFormGrid>
      <DeviceFormGrid>
        <Input
          label="Matricola BTE"
          name="matricolaBte"
          value={formData.matricolaBte}
          onChange={(e) => onChange("matricolaBte", e.target.value)}
          placeholder="Codice matricola BTE"
          disabled={isSaving}
        />
        <Input
          label="Matricola KGN"
          name="matricolaKgn"
          value={formData.matricolaKgn}
          onChange={(e) => onChange("matricolaKgn", e.target.value)}
          placeholder="Codice matricola KGN"
          disabled={isSaving}
        />
      </DeviceFormGrid>
      <Input
        label="Sheet Name"
        name="sheetName"
        value={formData.sheetName}
        onChange={(e) => onChange("sheetName", e.target.value)}
        placeholder="Nome del foglio"
        disabled={isSaving}
      />
    </DeviceCard>
  );
}
