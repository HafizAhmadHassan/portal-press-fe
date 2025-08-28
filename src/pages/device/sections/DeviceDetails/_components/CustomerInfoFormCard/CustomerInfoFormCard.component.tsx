import { Settings } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import styles from "./CustomerInfoFormCard.module.scss";
import DeviceCard from "../../../_components/DeviceCard/DeviceCard.component";

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
    <DeviceCard
      title="Informazioni Cliente"
      icon={<Settings size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.formGrid}>
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
      </div>
    </DeviceCard>
  );
}
