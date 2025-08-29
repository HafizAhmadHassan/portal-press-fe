import { Settings } from "lucide-react";
import { Checkbox } from "@shared/checkbox/CheckBox.component.tsx";
import DeviceCard from "../../../device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "../../../device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";

type Props = {
  formData: {
    tatus_ready_d75_3_7: boolean;
    status_Machine_Blocked: boolean;
  };
  isSaving: boolean;
  onChange: (field: string, value: any) => void;
};

export default function FlagsFormCard({ formData, isSaving, onChange }: Props) {
  return (
    <DeviceCard title="Stati e Flag" icon={<Settings size={18} />}>
      <DeviceFormGrid>
        <Checkbox
          label="Status Ready D75_3_7"
          description="Indica se il dispositivo è pronto per l'uso"
          checked={formData.tatus_ready_d75_3_7}
          onChange={(checked) => onChange("tatus_ready_d75_3_7", checked)}
          disabled={isSaving}
          color="success"
        />
        <Checkbox
          label="Macchina Bloccata"
          description="Indica se la macchina è bloccata"
          checked={formData.status_Machine_Blocked}
          onChange={(checked) => onChange("status_Machine_Blocked", checked)}
          disabled={isSaving}
          color="danger"
        />
      </DeviceFormGrid>
    </DeviceCard>
  );
}
