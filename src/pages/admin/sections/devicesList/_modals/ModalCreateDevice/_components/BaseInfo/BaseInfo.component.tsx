import styles from "../../../../_styles/Sections.module.scss";
import { Monitor } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import { Select } from "@shared/select/Select.component.tsx";

export default function BaseInfo({
  formData,
  isLoading,
  statusOptions,
  wasteOptions,
  handleInputChange,
  errors,
}: any) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <Monitor className={styles.sectionIcon} />
        <h4 className={styles.sectionTitle}>Informazioni Base</h4>
        <span className={styles.sectionBadge}>Obbligatorio</span>
      </div>

      <div className={styles.sectionContent}>
        <div className={styles.formGrid}>
          <Input
            label="Nome Macchina"
            name="machine_Name"
            value={formData.machine_Name}
            onChange={(e) => handleInputChange("machine_Name", e.target.value)}
            placeholder="es. Device_001"
            icon={Monitor}
            disabled={isLoading}
            required
            error={errors.machine_Name}
          />

          <Select
            label="Stato"
            name="status"
            value={formData.status}
            onChange={(value) => handleInputChange("status", Number(value))}
            options={statusOptions}
            disabled={isLoading}
            required
          />
        </div>

        <div className={styles.formGrid}>
          <Select
            label="Tipo Rifiuto"
            name="waste"
            value={formData.waste}
            onChange={(value) => handleInputChange("waste", value)}
            options={wasteOptions}
            disabled={isLoading}
          />

          <Input
            label="Versione Linux"
            name="linuxVersion"
            value={formData.linuxVersion}
            onChange={(e) => handleInputChange("linuxVersion", e.target.value)}
            placeholder="es. 2.1.0"
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGrid}>
          <Input
            label="Data Inizio Disponibilità"
            name="startAvailable"
            type="date"
            value={formData.startAvailable}
            onChange={(e) =>
              handleInputChange("startAvailable", e.target.value)
            }
            disabled={isLoading}
          />

          <Input
            label="Data Fine Disponibilità"
            name="endAvailable"
            type="date"
            value={formData.endAvailable}
            onChange={(e) => handleInputChange("endAvailable", e.target.value)}
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
