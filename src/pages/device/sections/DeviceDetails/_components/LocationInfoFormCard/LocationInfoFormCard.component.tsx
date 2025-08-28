import { MapPin } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import styles from "./LocationInfoFormCard.module.scss";
import DeviceCard from "../../../_components/DeviceCard/DeviceCard.component";

type Props = {
  formData: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    municipality: string;
    address: string;
  };
  isSaving: boolean;
  onChange: (field: string, value: any) => void;
};

export default function LocationInfoFormCard({
  formData,
  isSaving,
  onChange,
}: Props) {
  return (
    <DeviceCard
      title="Informazioni di Ubicazione"
      icon={<MapPin size={18} />}
      bodyClassName={styles.body}
    >
      <div className={styles.formGrid}>
        <Input
          label="Indirizzo/Via"
          name="street"
          value={formData.street}
          onChange={(e) => onChange("street", e.target.value)}
          placeholder="Via, Numero civico"
          disabled={isSaving}
        />
        <Input
          label="Città"
          name="city"
          value={formData.city}
          onChange={(e) => onChange("city", e.target.value)}
          placeholder="Nome città"
          disabled={isSaving}
        />
      </div>

      <div className={styles.formGrid}>
        <Input
          label="Provincia"
          name="province"
          value={formData.province}
          onChange={(e) => onChange("province", e.target.value)}
          placeholder="Sigla provincia"
          disabled={isSaving}
        />
        <Input
          label="CAP"
          name="postalCode"
          value={formData.postalCode}
          onChange={(e) => onChange("postalCode", e.target.value)}
          placeholder="Codice postale"
          disabled={isSaving}
        />
      </div>

      <div className={styles.formGrid}>
        <Input
          label="Paese"
          name="country"
          value={formData.country}
          onChange={(e) => onChange("country", e.target.value)}
          placeholder="Nome paese"
          disabled={isSaving}
        />
        <Input
          label="Municipalità"
          name="municipality"
          value={formData.municipality}
          onChange={(e) => onChange("municipality", e.target.value)}
          placeholder="Nome municipalità"
          disabled={isSaving}
        />
      </div>

      <Input
        label="Indirizzo Completo"
        name="address"
        value={formData.address}
        onChange={(e) => onChange("address", e.target.value)}
        placeholder="Indirizzo completo"
        disabled={isSaving}
      />
    </DeviceCard>
  );
}
