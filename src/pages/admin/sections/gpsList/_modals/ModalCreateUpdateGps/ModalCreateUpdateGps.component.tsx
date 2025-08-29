import React, { useEffect, useMemo, useState } from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";
import { Plus, Edit, AlertCircle } from "lucide-react";
import type { GpsDevice } from "@store_admin/gps/gps.types";
import styles from "./ModalCreateUpdateGps.module.scss";
import GpsInfoCard from "./_components/GpsInfoCard/GpsInfoCard.component";
import GpsCoordinatesCard from "./_components/GpsCoordinatesCard/GpsCoordinatesCard.component";
import GpsLocationCard from "./_components/GpsLocationCard/GpsLocationCard.component";
import GpsSummaryCard from "./_components/GpsSummaryCard/GpsSummaryCard.component";

// SOTTO-COMPONENTI (riusati da create/edit)

export type GpsModalMode = "create" | "edit";

export interface ModalCreateUpdateGpsProps {
  mode: GpsModalMode;
  /** per edit */
  initialDevice?: Partial<GpsDevice> | null;
  /** il caller in edit aggiunge lui l'id (come fai con user) */
  onSave?: (data: Partial<GpsDevice>) => Promise<void> | void;
  triggerButton?: React.ReactNode;
}

type FormErrors = Partial<{
  codice: string;
  gps_x: string;
  gps_y: string;
  address: string;
  general: string;
}>;

function mapInitialToForm(dev?: Partial<GpsDevice> | null): Partial<GpsDevice> {
  return {
    codice: dev?.codice ?? "",
    gps_x: dev?.gps_x ?? "",
    gps_y: dev?.gps_y ?? "",
    municipility: dev?.municipility ?? "",
    customer_Name: dev?.customer_Name ?? "",
    waste: dev?.waste ?? "",
    address: dev?.address ?? "",
  };
}

const ModalCreateUpdateGps: React.FC<ModalCreateUpdateGpsProps> = ({
  mode,
  initialDevice,
  onSave,
  triggerButton,
}) => {
  const isEdit = mode === "edit";

  const [form, setForm] = useState<Partial<GpsDevice>>(
    isEdit ? mapInitialToForm(initialDevice) : mapInitialToForm()
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // allinea form se cambiano i dati esterni in edit
  useEffect(() => {
    if (isEdit) setForm(mapInitialToForm(initialDevice));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isEdit,
    initialDevice?.codice,
    initialDevice?.gps_x,
    initialDevice?.gps_y,
    initialDevice?.municipility,
    initialDevice?.customer_Name,
    initialDevice?.waste,
    initialDevice?.address,
  ]);

  const set = (k: keyof GpsDevice, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k as keyof FormErrors]) {
      setErrors((e) => ({ ...e, [k]: undefined }));
    }
  };

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.codice?.toString().trim()) e.codice = "Codice obbligatorio";
    if (!form.address?.toString().trim()) e.address = "Indirizzo obbligatorio";
    // coords obbligatorie solo in create (come esempio – puoi adattare)
    if (!isEdit) {
      if (!form.gps_x?.toString().trim()) e.gps_x = "gps_x obbligatorio";
      if (!form.gps_y?.toString().trim()) e.gps_y = "gps_y obbligatorio";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setErrors({});
    try {
      await onSave?.(form);
      if (!isEdit) {
        setForm(mapInitialToForm()); // reset solo in create
      }
    } catch (err: any) {
      setErrors({
        general:
          err?.message ||
          (isEdit
            ? "Errore durante la modifica del GPS"
            : "Errore durante la creazione del GPS"),
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = useMemo(() => {
    if (triggerButton) return triggerButton;
    return isEdit ? (
      <SimpleButton size="bare" color="warning" variant="ghost" icon={Edit} />
    ) : (
      <SimpleButton variant="outline" color="primary" size="sm" icon={Plus}>
        Nuovo GPS
      </SimpleButton>
    );
  }, [isEdit, triggerButton]);

  const title = isEdit ? "Modifica GPS" : "Crea GPS";
  const confirmText = isEdit ? "Salva" : "Crea";

  return (
    <Modal
      size="lg"
      triggerButton={defaultTrigger}
      title={title}
      confirmText={confirmText}
      cancelText="Annulla"
      onConfirm={handleSave}
      // loading={isLoading}
    >
      <div className={styles.modalContent}>
        {errors.general && (
          <div className={styles.errorAlert}>
            <AlertCircle className={styles.errorIcon} />
            <span>{errors.general}</span>
          </div>
        )}

        <GpsInfoCard
          values={{
            codice: (form.codice as any) ?? "",
            customer_Name: (form.customer_Name as any) ?? "",
            waste: (form.waste as any) ?? "",
          }}
          errors={{ codice: errors.codice }}
          disabled={isLoading}
          onChange={(field, val) => set(field as keyof GpsDevice, val)}
        />

        <GpsCoordinatesCard
          values={{
            gps_x: (form.gps_x as any) ?? "",
            gps_y: (form.gps_y as any) ?? "",
          }}
          errors={{ gps_x: errors.gps_x, gps_y: errors.gps_y }}
          disabled={isLoading}
          onChange={(field, val) => set(field as keyof GpsDevice, val)}
        />

        <GpsLocationCard
          values={{
            address: (form.address as any) ?? "",
            municipility: (form.municipility as any) ?? "",
          }}
          errors={{ address: errors.address }}
          disabled={isLoading}
          onChange={(field, val) => set(field as keyof GpsDevice, val)}
        />

        <GpsSummaryCard
          codice={(form.codice as any) ?? ""}
          customer_Name={(form.customer_Name as any) ?? ""}
          waste={(form.waste as any) ?? ""}
          gps_x={(form.gps_x as any) ?? ""}
          gps_y={(form.gps_y as any) ?? ""}
          address={(form.address as any) ?? ""}
          municipility={(form.municipility as any) ?? ""}
        />
      </div>
    </Modal>
  );
};

export default ModalCreateUpdateGps;
