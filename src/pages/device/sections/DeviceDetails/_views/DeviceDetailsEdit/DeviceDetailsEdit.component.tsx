import styles from "./DeviceDetailsEdit.module.scss";

import type { FormData } from "../../_forms/deviceEditForm.types";

// edit cards
import GeneralInfoFormCard from "../../_components/GeneralInfoFormCard/GeneralInfoFormCard.component";
import LocationInfoFormCard from "../../_components/LocationInfoFormCard/LocationInfoFormCard.component";
import TechnicalInfoFormCard from "../../_components/TechnicalInfoFormCard/TechnicalInfoFormCard.component";
import CustomerInfoFormCard from "../../_components/CustomerInfoFormCard/CustomerInfoFormCard.component";
import FlagsFormCard from "../../_components/FlagsFormCard/FlagsFormCard.component";
import NotesFormCard from "../../_components/NotesFormCard/NotesFormCard.component";

type Props = {
  formData: FormData;
  isSaving: boolean;
  onChange: (field: keyof FormData | string, value: any) => void;
};

export default function DeviceDetailsEdit({
  formData,
  isSaving,
  onChange,
}: Props) {
  return (
    <div className={styles.editStack}>
      <GeneralInfoFormCard
        formData={{
          machine_Name: formData.machine_Name,
          waste: formData.waste,
          status: formData.status,
          linuxVersion: formData.linuxVersion,
          startAvailable: formData.startAvailable,
          endAvailable: formData.endAvailable,
        }}
        isSaving={isSaving}
        onChange={onChange}
      />

      <LocationInfoFormCard
        formData={{
          street: formData.street,
          city: formData.city,
          province: formData.province,
          postalCode: formData.postalCode,
          country: formData.country,
          municipality: formData.municipality,
          address: formData.address,
        }}
        isSaving={isSaving}
        onChange={onChange}
      />

      <TechnicalInfoFormCard
        formData={{
          ip_Router: formData.ip_Router,
          codiceGps: formData.codiceGps,
          gpsX: formData.gpsX,
          gpsY: formData.gpsY,
          matricolaBte: formData.matricolaBte,
          matricolaKgn: formData.matricolaKgn,
          sheetName: formData.sheetName,
        }}
        isSaving={isSaving}
        onChange={onChange}
      />

      <CustomerInfoFormCard
        formData={{
          customerName: formData.customerName,
          customer: formData.customer,
        }}
        isSaving={isSaving}
        onChange={onChange}
      />

      <FlagsFormCard
        formData={{
          tatus_ready_d75_3_7: formData.tatus_ready_d75_3_7,
          status_Machine_Blocked: formData.status_Machine_Blocked,
        }}
        isSaving={isSaving}
        onChange={onChange}
      />

      <NotesFormCard
        note={formData.note}
        isSaving={isSaving}
        onChange={(v) => onChange("note", v)}
      />

      <div className={styles.infoNote}>
        <p className={styles.infoNoteText}>
          <strong>Nota:</strong> Le modifiche diventeranno effettive dopo il
          salvataggio. Alcune modifiche potrebbero richiedere il riavvio del
          dispositivo.
        </p>
      </div>
    </div>
  );
}
