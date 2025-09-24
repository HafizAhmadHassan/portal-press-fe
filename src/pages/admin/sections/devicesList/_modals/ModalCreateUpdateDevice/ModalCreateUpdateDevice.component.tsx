import React, { useEffect, useMemo, useState } from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { AlertCircle, Edit, Plus } from "lucide-react";
import styles from "./ModalCreateUpdateDevice.module.scss";

import type { Device } from "@store_admin/devices/devices.types";

// ===== TIPI E MAPPERS (RIUSO DELLA PAGINA DETAILS) =====

// ===== EDIT CARDS (RIUSO) =====
import GeneralInfoFormCard from "@root/pages/_commons/DevicesDetails/edit/GeneralInfoFormCard/GeneralInfoFormCard.component";
import LocationInfoFormCard from "@root/pages/_commons/DevicesDetails/edit/LocationInfoFormCard/LocationInfoFormCard.component";
import TechnicalInfoFormCard from "@root/pages/_commons/DevicesDetails/edit/TechnicalInfoFormCard/TechnicalInfoFormCard.component";
import CustomerInfoFormCard from "@root/pages/_commons/DevicesDetails/edit/CustomerInfoFormCard/CustomerInfoFormCard.component";
import FlagsFormCard from "@root/pages/_commons/DevicesDetails/edit/FlagsFormCard/FlagsFormCard.component";
import NotesFormCard from "@root/pages/_commons/DevicesDetails/edit/NotesFormCard/NotesFormCard.component";
import type { FormData } from "@root/pages/device/sections/DeviceDetails/_forms/deviceEditForm.types";
import {
  deviceToFormData,
  formDataToDevice,
} from "@root/pages/device/sections/DeviceDetails/_forms/deviceEditForm.mappers";

type Props = {
  mode: "create" | "edit";
  onSave?: (payload: any) => Promise<void> | void;
  triggerButton?: React.ReactNode;
  initialDevice?: Device | null;
};

type FormErrors = {
  machine_Name?: string;
  ip_Router?: string;
  general?: string;
};

/** Form vuoto compatibile con le edit cards */
const emptyForm = (): FormData => ({
  // General
  machine_Name: "",
  waste: "",
  status: 1,
  linuxVersion: "",
  startAvailable: "",
  endAvailable: "",

  // Location
  street: "",
  city: "",
  province: "",
  postalCode: "",
  country: "",
  municipality: "",
  address: "",

  // Technical
  ip_Router: "",
  codiceGps: "",
  gpsX: "",
  gpsY: "",
  matricolaBte: "",
  matricolaKgn: "",
  sheetName: "",

  // Customer
  customerName: "",
  customer: "",

  // Flags (attenzione al naming usato dalle card)
  tatus_ready_d75_3_7: false,
  status_Machine_Blocked: false,

  // Notes
  note: "",
});

export const ModalCreateUpdateDevice: React.FC<Props> = ({
  mode,
  onSave,
  triggerButton,
  initialDevice,
}) => {
  const isEdit = mode === "edit";

  // Stato form allineato ai mappers e alle edit cards
  const [formData, setFormData] = useState<FormData>(
    isEdit && initialDevice ? deviceToFormData(initialDevice) : emptyForm()
  );

  useEffect(() => {
    if (isEdit && initialDevice) {
      setFormData(deviceToFormData(initialDevice));
    }
  }, [isEdit, initialDevice]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // onChange identico a quello che usi sulla pagina
  const handleChange = (field: keyof FormData | string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if ((errors as any)[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Validazione minima (stessa logica che avevi in modale)
  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!formData.machine_Name?.trim())
      e.machine_Name = "Nome macchina è obbligatorio";

    if (
      formData.ip_Router &&
      !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(formData.ip_Router)
    ) {
      e.ip_Router = "Formato IP non valido (es. 192.168.1.1)";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      setIsLoading(true);
      // Converte dal FormData (edit-cards) al payload Device
      const payload = formDataToDevice(formData);
      await onSave?.(payload);

      // reset solo in create
      if (!isEdit) setFormData(emptyForm());
    } catch (error: any) {
      setErrors({
        general:
          error?.message ||
          (isEdit
            ? "Errore durante l'aggiornamento del device"
            : "Errore durante la creazione del device"),
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // trigger di default coerente con gli altri moduli
  const defaultTrigger = useMemo(() => {
    if (triggerButton) return triggerButton;
    return isEdit ? (
      <SimpleButton variant="ghost" color="warning" size="bare" icon={Edit} />
    ) : (
      <SimpleButton variant="outline" color="primary" size="sm" icon={Plus}>
        Nuova Macchina
      </SimpleButton>
    );
  }, [isEdit, triggerButton]);

  const modalTitle = isEdit ? "Modifica Device" : "Crea Nuova Macchina";
  const confirmText = isEdit ? "Salva Modifiche" : "Crea Macchina";

  return (
    <Modal
      size="lg"
      triggerButton={defaultTrigger}
      title={modalTitle}
      confirmText={confirmText}
      cancelText="Annulla"
      onConfirm={handleSave}
      // loading={isLoading} // abilita se la tua Modal supporta il prop
    >
      <div className={styles.modalContent}>
        {errors.general && (
          <div className={styles.errorAlert}>
            <AlertCircle className={styles.errorIcon} />
            <span>{errors.general}</span>
          </div>
        )}

        {/* === RIUSO DELLE STESSE EDIT CARDS DELLA PAGINA === */}
        <GeneralInfoFormCard
          formData={{
            machine_Name: formData.machine_Name,
            waste: formData.waste,
            status: formData.status,
            linuxVersion: formData.linuxVersion,
            startAvailable: formData.startAvailable,
            endAvailable: formData.endAvailable,
          }}
          isSaving={isLoading}
          onChange={handleChange}
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
          isSaving={isLoading}
          onChange={handleChange}
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
          isSaving={isLoading}
          onChange={handleChange}
        />

        <CustomerInfoFormCard
          formData={{
            customerName: formData.customerName,
            customer: formData.customer,
          }}
          isSaving={isLoading}
          onChange={handleChange}
        />

        <FlagsFormCard
          formData={{
            // attenzione: la card usa proprio questa chiave
            tatus_ready_d75_3_7: formData.tatus_ready_d75_3_7,
            status_Machine_Blocked: formData.status_Machine_Blocked,
          }}
          isSaving={isLoading}
          onChange={handleChange}
        />

        <NotesFormCard
          note={formData.note}
          isSaving={isLoading}
          onChange={(v) => handleChange("note", v)}
        />

        <div className={styles.infoNote}>
          <p className={styles.infoNoteText}>
            <strong>Nota:</strong> le modifiche saranno applicate al
            salvataggio. Alcune impostazioni potrebbero richiedere il riavvio
            del dispositivo.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ModalCreateUpdateDevice;
