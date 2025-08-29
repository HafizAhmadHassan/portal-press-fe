import React from "react";
import { MapPin } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "@root/pages/device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";

import styles from "./GpsLocationCard.module.scss";

type Values = {
  address: string;
  municipility: string;
};
type Errors = Partial<Record<keyof Values, string>>;

type Props = {
  values: Values;
  errors?: Errors;
  disabled?: boolean;
  onChange: (field: keyof Values, value: string) => void;
};

const GpsLocationCard: React.FC<Props> = ({
  values,
  errors,
  disabled,
  onChange,
}) => {
  return (
    <DeviceCard
      title="Ubicazione"
      icon={<MapPin size={18} />}
      bodyClassName={styles.body}
    >
      <DeviceFormGrid>
        <Input
          name="address"
          label="Indirizzo"
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
          icon={MapPin}
          required
          error={errors?.address}
          disabled={disabled}
          placeholder="Via Roma 10"
        />
        <Input
          name="municipility"
          label="Comune"
          value={values.municipility}
          onChange={(e) => onChange("municipility", e.target.value)}
          icon={MapPin}
          disabled={disabled}
          placeholder="RUBANO (PD)"
        />
      </DeviceFormGrid>
    </DeviceCard>
  );
};

export default GpsLocationCard;
