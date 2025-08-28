import { Shield } from "lucide-react";
import { Checkbox } from "@components/shared/checkbox/CheckBox.component";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "@root/pages/device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";

type Values = { isActive: boolean; isStaff: boolean; isSuperuser: boolean };
type Props = {
  values: Values;
  disabled?: boolean;
  onChange: (field: keyof Values, value: boolean) => void;
};

export default function StatusPrivilegesCard({
  values,
  disabled,
  onChange,
}: Props) {
  return (
    <DeviceCard title="Stati e Privilegi" icon={<Shield size={18} />}>
      <DeviceFormGrid>
        <Checkbox
          label="Utente Attivo"
          description="L'utente può accedere al sistema"
          checked={values.isActive}
          onChange={(checked) => onChange("isActive", checked)}
          disabled={disabled}
          color="success"
        />
        <Checkbox
          label="Staff"
          description="Accesso alle funzioni di amministrazione"
          checked={values.isStaff}
          onChange={(checked) => onChange("isStaff", checked)}
          disabled={disabled}
          color="warning"
        />
        <Checkbox
          label="Super Amministratore"
          description="Accesso completo a tutte le funzioni"
          checked={values.isSuperuser}
          onChange={(checked) => onChange("isSuperuser", checked)}
          disabled={disabled}
          color="danger"
        />
      </DeviceFormGrid>
    </DeviceCard>
  );
}
