import React from "react";
import { MapPin, Navigation } from "lucide-react";
import { Input } from "@shared/inputs/Input.component";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "@root/pages/device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";
import styles from "./PositionInfoCard.module.scss";

type Values = {
  street: string;
  postal_Code: string;
  province: string;
  city: string;
  country: string;
  municipality: string;
  address: string;
  gps_x: string;
  gps_y: string;
};

type Props = {
  values: Values;
  disabled?: boolean;
  onChange: (field: keyof Values, value: string) => void;
  onAddressGenerate?: () => void;
};

export default function PositionInfoCard({
  values,
  disabled,
  onChange,
  onAddressGenerate,
}: Props) {
  const handleAddressFieldChange = (field: keyof Values, value: string) => {
    onChange(field, value);
    if (["street", "city", "province"].includes(field) && onAddressGenerate) {
      setTimeout(onAddressGenerate, 0);
    }
  };

  return (
    <DeviceCard
      title="Informazioni di Posizione"
      icon={<MapPin size={18} />}
      info={<span className={styles.optionalBadge}>Opzionale</span>}
      bodyClassName={styles.body}
    >
      <DeviceFormGrid>
        <Input
          label="Via/Strada"
          name="street"
          value={values.street}
          onChange={(e) => handleAddressFieldChange("street", e.target.value)}
          placeholder="es. Via Roma 123"
          disabled={disabled}
        />
        <Input
          label="CAP"
          name="postal_Code"
          value={values.postal_Code}
          onChange={(e) => onChange("postal_Code", e.target.value)}
          placeholder="es. 12345"
          disabled={disabled}
        />
      </DeviceFormGrid>

      <DeviceFormGrid>
        <Input
          label="Città"
          name="city"
          value={values.city}
          onChange={(e) => handleAddressFieldChange("city", e.target.value)}
          placeholder="es. Milano"
          disabled={disabled}
        />
        <Input
          label="Provincia"
          name="province"
          value={values.province}
          onChange={(e) => handleAddressFieldChange("province", e.target.value)}
          placeholder="es. MI"
          disabled={disabled}
        />
      </DeviceFormGrid>

      <DeviceFormGrid>
        <Input
          label="Paese"
          name="country"
          value={values.country}
          onChange={(e) => onChange("country", e.target.value)}
          placeholder="es. Italia"
          disabled={disabled}
        />
        <Input
          label="Comune"
          name="municipality"
          value={values.municipality}
          onChange={(e) => onChange("municipality", e.target.value)}
          placeholder="es. Milano"
          disabled={disabled}
        />
      </DeviceFormGrid>

      <div className={styles.fullWidth}>
        <Input
          label="Indirizzo Completo"
          name="address"
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
          placeholder="Generato automaticamente o inserisci manualmente"
          disabled={disabled}
        />
      </div>

      <DeviceFormGrid>
        <Input
          label="GPS X (Longitudine)"
          name="gps_x"
          value={values.gps_x}
          onChange={(e) => onChange("gps_x", e.target.value)}
          placeholder="es. 45.4642"
          disabled={disabled}
          icon={Navigation}
        />
        <Input
          label="GPS Y (Latitudine)"
          name="gps_y"
          value={values.gps_y}
          onChange={(e) => onChange("gps_y", e.target.value)}
          placeholder="es. 9.1900"
          disabled={disabled}
          icon={Navigation}
        />
      </DeviceFormGrid>
    </DeviceCard>
  );
}
