import { Settings } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import DeviceCard from "../../../device/sections/_components/DeviceCard/DeviceCard.component";
import { DeviceFormGrid } from "../../../device/sections/_components/DeviceFormGrid/DeviceFormGrid.component";

type Props = {
  formData: { customerName: string; customer: string };
  isSaving: boolean;
  onChange: (field: string, value: any) => void;
};

export default function CustomerInfoFormCard({
  formData,
  isSaving,
  onChange,
}: Props) {
  return (
    <DeviceCard title="Informazioni Cliente" icon={<Settings size={18} />}>
      <DeviceFormGrid>
        <Input
          label="Nome Cliente"
          name="customerName"
          value={formData.customerName}
          onChange={(e) => onChange("customerName", e.target.value)}
          placeholder="Nome completo del cliente"
          disabled={isSaving}
        />
        <Input
          label="Cliente (Codice)"
          name="customer"
          value={formData.customer}
          onChange={(e) => onChange("customer", e.target.value)}
          placeholder="Codice cliente"
          disabled={isSaving}
        />
      </DeviceFormGrid>
    </DeviceCard>
  );
}
