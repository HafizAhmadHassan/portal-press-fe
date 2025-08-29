import React from "react";
import { Hash } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "@root/pages/device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";

import styles from "./GpsCoordinatesCard.module.scss";

type Values = {
  gps_x: string | number;
  gps_y: string | number;
};
type Errors = Partial<Record<keyof Values, string>>;

type Props = {
  values: Values;
  errors?: Errors;
  disabled?: boolean;
  onChange: (field: keyof Values, value: string) => void;
};

const GpsCoordinatesCard: React.FC<Props> = ({
  values,
  errors,
  disabled,
  onChange,
}) => {
  return (
    <DeviceCard
      title="Coordinate GPS"
      icon={<Hash size={18} />}
      bodyClassName={styles.body}
    >
      <DeviceFormGrid>
        <Input
          name="gps_x"
          label="gps_x (lat)"
          value={values.gps_x?.toString() ?? ""}
          onChange={(e) => onChange("gps_x", e.target.value)}
          icon={Hash}
          required
          error={errors?.gps_x}
          disabled={disabled}
          placeholder="es. 45.40983"
        />
        <Input
          name="gps_y"
          label="gps_y (lng)"
          value={values.gps_y?.toString() ?? ""}
          onChange={(e) => onChange("gps_y", e.target.value)}
          icon={Hash}
          required
          error={errors?.gps_y}
          disabled={disabled}
          placeholder="es. 11.87621"
        />
      </DeviceFormGrid>
    </DeviceCard>
  );
};

export default GpsCoordinatesCard;
