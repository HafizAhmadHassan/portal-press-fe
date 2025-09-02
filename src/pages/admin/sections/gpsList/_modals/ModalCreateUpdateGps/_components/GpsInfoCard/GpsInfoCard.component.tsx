import React from "react";
import { Satellite, ClipboardList } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "@root/pages/device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";

import styles from "./GpsInfoCard.module.scss";

type Values = {
  codice: string;
  customer_Name: string;
  waste: string;
};
type Errors = Partial<Pick<Values, "codice">>;

type Props = {
  values: Values;
  errors?: Errors;
  disabled?: boolean;
  onChange: (field: keyof Values, value: string) => void;
};

const GpsInfoCard: React.FC<Props> = ({
  values,
  errors,
  disabled,
  onChange,
}) => {
  return (
    <DeviceCard
      title="Dati dispositivo"
      icon={<Satellite size={18} />}
      info={<span className={styles.reqBadge}>Obbligatorio</span>}
      bodyClassName={styles.body}
    >
      <DeviceFormGrid>
        <Input
          name="codice"
          label="Codice Gps"
          value={values.codice}
          onChange={(e) => onChange("codice", e.target.value)}
          icon={ClipboardList}
          required
          error={errors?.codice}
          disabled={disabled}
          placeholder="es. 1304"
        />
        <Input
          name="customer_Name"
          label="Cliente"
          value={values.customer_Name}
          onChange={(e) => onChange("customer_Name", e.target.value)}
          disabled={disabled}
          placeholder="es. Etra"
        />
      </DeviceFormGrid>

      <DeviceFormGrid>
        <Input
          name="waste"
          label="Tipo rifiuto"
          value={values.waste}
          onChange={(e) => onChange("waste", e.target.value)}
          disabled={disabled}
          placeholder="es. SECCO"
        />
      </DeviceFormGrid>
    </DeviceCard>
  );
};

export default GpsInfoCard;
