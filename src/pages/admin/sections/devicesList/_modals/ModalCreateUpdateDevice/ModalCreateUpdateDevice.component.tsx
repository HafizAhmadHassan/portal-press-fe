import React, { useEffect, useMemo, useState } from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";
import { AlertCircle, Edit, Plus } from "lucide-react";
import styles from "./ModalCreateUpdateDevice.module.scss";
import type { Device } from "@store_admin/devices/devices.types";
import BaseInfoCard from "./_components/BaseInfoCard/BaseInfoCard.component";
import PositionInfoCard from "./_components/PositionInfoCard/PositionInfoCard.component";
import TechnicalInfoCard from "./_components/TechnicalInfoCard/TechnicalInfoCard.component";
import StatusInfoCard from "./_components/StatusInfoCard/StatusInfoCard.component";
import SummaryCard from "./_components/SummaryCard/SummaryCard.component";

type WasteKind =
  | "Plastica"
  | "Secco"
  | "Umido"
  | "Vetro"
  | "Indifferenziato"
  | "Carta"
  | "vpl"
  | "";

interface FormData {
  machine_Name: string;
  status: number;
  waste: WasteKind;
  linux_Version: string;
  start_Available: string;
  end_Available: string;
  street: string;
  postal_Code: string;
  province: string;
  city: string;
  country: string;
  municipality: string;
  address: string;
  status_ready_d75_3_7: boolean;
  status_Machine_Blocked: boolean;
  codice_Gps: string;
  sheet_Name: string;
  customer_Name: string;
  matricola_Bte: string;
  matricola_Kgn: string;
  customer: string;
  ip_Router: string;
  gps_x: string;
  gps_y: string;
  note: string;
}

interface FormErrors {
  machine_Name?: string;
  ip_Router?: string;
  general?: string;
}

interface ModalCreateUpdateDeviceProps {
  mode: "create" | "edit";
  onSave?: (deviceData: any) => Promise<void>;
  triggerButton?: React.ReactNode;
  initialDevice?: Device;
}

function mapDeviceToForm(device?: Device | null): FormData {
  return {
    machine_Name: device?.machine_Name || "",
    status: device?.status ?? 1,
    waste: (device?.waste as WasteKind) || "",
    linux_Version: device?.linux_Version || "",
    start_Available: device?.start_Available || "",
    end_Available: device?.end_Available || "",
    street: device?.street || "",
    postal_Code: device?.postal_Code || "",
    province: device?.province || "",
    city: device?.city || "",
    country: device?.country || "",
    municipality: device?.municipality || "",
    address: device?.address || "",
    status_ready_d75_3_7: device?.status_ready_d75_3_7 || false,
    status_Machine_Blocked: device?.status_Machine_Blocked || false,
    codice_Gps: device?.codice_Gps || "",
    sheet_Name: device?.sheet_Name || "",
    customer_Name: device?.customer_Name || "",
    matricola_Bte: device?.matricola_Bte || "",
    matricola_Kgn: device?.matricola_Kgn || "",
    customer: device?.customer || "",
    ip_Router: device?.ip_Router || "",
    gps_x: device?.gps_x || "",
    gps_y: device?.gps_y || "",
    note: device?.note || "",
  };
}

export const ModalCreateUpdateDevice: React.FC<
  ModalCreateUpdateDeviceProps
> = ({ mode, onSave, triggerButton, initialDevice }) => {
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState<FormData>(
    isEdit
      ? mapDeviceToForm(initialDevice)
      : {
          machine_Name: "",
          status: 1,
          waste: "",
          linux_Version: "",
          start_Available: "",
          end_Available: "",
          street: "",
          postal_Code: "",
          province: "",
          city: "",
          country: "",
          municipality: "",
          address: "",
          status_ready_d75_3_7: false,
          status_Machine_Blocked: false,
          codice_Gps: "",
          sheet_Name: "",
          customer_Name: "",
          matricola_Bte: "",
          matricola_Kgn: "",
          customer: "",
          ip_Router: "",
          gps_x: "",
          gps_y: "",
          note: "",
        }
  );

  useEffect(() => {
    if (isEdit) {
      setFormData(mapDeviceToForm(initialDevice));
    }
  }, [isEdit, initialDevice]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.machine_Name.trim()) {
      newErrors.machine_Name = "Nome macchina è obbligatorio";
    } else if (formData.machine_Name.length < 2) {
      newErrors.machine_Name = "Nome macchina deve essere almeno 2 caratteri";
    }

    if (
      formData.ip_Router &&
      !/^(?:\d{1,3}\.){3}\d{1,3}$/.test(formData.ip_Router)
    ) {
      newErrors.ip_Router = "Formato IP non valido (es. 192.168.1.1)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const generateFullAddress = () => {
    const parts = [formData.street, formData.city, formData.province].filter(
      Boolean
    );
    const fullAddress = parts.join(", ");
    handleInputChange("address", fullAddress);
  };

  const resetForm = () =>
    setFormData({
      machine_Name: "",
      status: 1,
      waste: "",
      linux_Version: "",
      start_Available: "",
      end_Available: "",
      street: "",
      postal_Code: "",
      province: "",
      city: "",
      country: "",
      municipality: "",
      address: "",
      status_ready_d75_3_7: false,
      status_Machine_Blocked: false,
      codice_Gps: "",
      sheet_Name: "",
      customer_Name: "",
      matricola_Bte: "",
      matricola_Kgn: "",
      customer: "",
      ip_Router: "",
      gps_x: "",
      gps_y: "",
      note: "",
    });

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      // Rimuove campi vuoti per il backend
      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [
          key,
          typeof value === "string" && value === "" ? null : value,
        ])
      );

      await onSave?.(payload);

      if (!isEdit) resetForm();
    } catch (error: any) {
      console.error("Errore nella gestione device:", error);
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

  const defaultTrigger = useMemo(() => {
    if (triggerButton) return triggerButton;
    return isEdit ? (
      <SimpleButton variant="ghost" color="warning" size="bare" icon={Edit} />
    ) : (
      <SimpleButton variant="outline" color="primary" size="sm" icon={Plus}>
        Nuovo Device
      </SimpleButton>
    );
  }, [isEdit, triggerButton]);

  const modalTitle = isEdit ? "Modifica Device" : "Crea Nuovo Device";
  const confirmText = isEdit ? "Salva Modifiche" : "Crea Device";

  return (
    <Modal
      size="lg"
      triggerButton={defaultTrigger}
      title={modalTitle}
      confirmText={confirmText}
      cancelText="Annulla"
      onConfirm={handleSave}
    >
      <div className={styles.modalContent}>
        {errors.general && (
          <div className={styles.errorAlert}>
            <AlertCircle className={styles.errorIcon} />
            <span>{errors.general}</span>
          </div>
        )}

        <BaseInfoCard
          values={{
            machine_Name: formData.machine_Name,
            status: formData.status,
            waste: formData.waste,
            linux_Version: formData.linux_Version,
            start_Available: formData.start_Available,
            end_Available: formData.end_Available,
          }}
          errors={{
            machine_Name: errors.machine_Name,
          }}
          disabled={isLoading}
          onChange={(field, value) =>
            handleInputChange(field as keyof FormData, value)
          }
        />

        <PositionInfoCard
          values={{
            street: formData.street,
            postal_Code: formData.postal_Code,
            province: formData.province,
            city: formData.city,
            country: formData.country,
            municipality: formData.municipality,
            address: formData.address,
            gps_x: formData.gps_x,
            gps_y: formData.gps_y,
          }}
          disabled={isLoading}
          onChange={(field, value) =>
            handleInputChange(field as keyof FormData, value)
          }
          onAddressGenerate={generateFullAddress}
        />

        <TechnicalInfoCard
          values={{
            ip_Router: formData.ip_Router,
            codice_Gps: formData.codice_Gps,
            sheet_Name: formData.sheet_Name,
            matricola_Bte: formData.matricola_Bte,
            matricola_Kgn: formData.matricola_Kgn,
            customer_Name: formData.customer_Name,
            customer: formData.customer,
            note: formData.note,
          }}
          errors={{
            ip_Router: errors.ip_Router,
          }}
          disabled={isLoading}
          onChange={(field, value) =>
            handleInputChange(field as keyof FormData, value)
          }
        />

        <StatusInfoCard
          values={{
            status_ready_d75_3_7: formData.status_ready_d75_3_7,
            status_Machine_Blocked: formData.status_Machine_Blocked,
          }}
          disabled={isLoading}
          onChange={(field, value) =>
            handleInputChange(field as keyof FormData, value)
          }
        />

        <SummaryCard formData={formData} />
      </div>
    </Modal>
  );
};
