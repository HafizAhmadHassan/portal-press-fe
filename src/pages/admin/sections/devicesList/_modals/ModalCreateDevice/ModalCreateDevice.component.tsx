import React, { useState } from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { AlertCircle, Plus } from "lucide-react";
import styles from "./ModalCreateDevices.module.scss";
import Summary from "@sections_admin//devicesList/_modals/ModalCreateDevice/_components/Summary/Summary.component";
import BaseInfo from "@sections_admin//devicesList/_modals/ModalCreateDevice/_components/BaseInfo/BaseInfo.component";
import PositionInfo from "@sections_admin//devicesList/_modals/ModalCreateDevice/_components/PositionInfo/PositionInfo.component";
import TechnicalInfo from "@sections_admin//devicesList/_modals/ModalCreateDevice/_components/TechnicalInfo/TechnicalInfo.component";
import StatusInfo from "@sections_admin//devicesList/_modals/ModalCreateDevice/_components/StatusInfo/StatusInfo.component";

interface ModalCreateDeviceProps {
  onSave?: (deviceData: any) => Promise<void>;
  triggerButton?: React.ReactNode;
}

// ✅ copre tutte le opzioni realmente usate nella select
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
  machineName: string;
  status: number;
  waste: WasteKind;
  linuxVersion: string;
  startAvailable: string;
  endAvailable: string;
  street: string;
  postalCode: string;
  province: string;
  city: string;
  country: string;
  municipality: string;
  address: string;
  statusReadyD75_3_7: boolean;
  statusMachineBlocked: boolean;
  codiceGps: string;
  sheetName: string;
  customerName: string;
  matricolaBte: string;
  matricolaKgn: string;
  customer: string;
  ip_Router: string;
  gpsX: string;
  gpsY: string;
  note: string;
}

interface FormErrors {
  machineName?: string;
  ip_Router?: string;
  general?: string;
}

export const ModalCreateDevice: React.FC<ModalCreateDeviceProps> = ({
  onSave,
  triggerButton,
}) => {
  const [formData, setFormData] = useState<FormData>({
    machineName: "",
    status: 1,
    waste: "",
    linuxVersion: "",
    startAvailable: "",
    endAvailable: "",
    street: "",
    postalCode: "",
    province: "",
    city: "",
    country: "",
    municipality: "",
    address: "",
    statusReadyD75_3_7: false,
    statusMachineBlocked: false,
    codiceGps: "",
    sheetName: "",
    customerName: "",
    matricolaBte: "",
    matricolaKgn: "",
    customer: "",
    ip_Router: "",
    gpsX: "",
    gpsY: "",
    note: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const wasteOptions = [
    { value: "", label: "Seleziona tipo rifiuto" },
    { value: "Plastica", label: "Plastica" },
    { value: "Secco", label: "Secco" },
    { value: "Umido", label: "Umido" },
    { value: "Vetro", label: "Vetro" },
    { value: "Indifferenziato", label: "Indifferenziato" },
    { value: "Carta", label: "Carta" },
    { value: "vpl", label: "VPL" },
  ];

  const statusOptions = [
    { value: 1, label: "Attivo" },
    { value: 0, label: "Inattivo" },
  ];

  // ✅ camelCase → snake_case per API
  const convertToSnakeCase = (data: FormData) => {
    return {
      machine__Name: data.machineName,
      status: data.status,
      waste: data.waste || null,
      linux_Version: data.linuxVersion || null,
      start_Available: data.startAvailable || null,
      end_Available: data.endAvailable || null,
      street: data.street || null,
      postal_Code: data.postalCode || null,
      province: data.province || null,
      city: data.city || null,
      country: data.country || null,
      municipality: data.municipality || null,
      address: data.address || null,
      status_ready_d75_3_7: data.statusReadyD75_3_7,
      status_Machine_Blocked: data.statusMachineBlocked,
      codice_Gps: data.codiceGps || null,
      sheet_Name: data.sheetName || null,
      customer_Name: data.customerName || null,
      matricola_Bte: data.matricolaBte || null,
      matricola_Kgn: data.matricolaKgn || null,
      customer: data.customer || null,
      ip_Router: data.ip_Router || null,
      gps_x: data.gpsX || null,
      gps_y: data.gpsY || null,
      note: data.note || null,
    };
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.machineName.trim()) {
      newErrors.machineName = "Nome macchina è obbligatorio";
    } else if (formData.machineName.length < 2) {
      newErrors.machineName = "Nome macchina deve essere almeno 2 caratteri";
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

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const convertedData = convertToSnakeCase(formData);
      await onSave?.(convertedData);

      // reset
      setFormData({
        machineName: "",
        status: 1,
        waste: "",
        linuxVersion: "",
        startAvailable: "",
        endAvailable: "",
        street: "",
        postalCode: "",
        province: "",
        city: "",
        country: "",
        municipality: "",
        address: "",
        statusReadyD75_3_7: false,
        statusMachineBlocked: false,
        codiceGps: "",
        sheetName: "",
        customerName: "",
        matricolaBte: "",
        matricolaKgn: "",
        customer: "",
        ip_Router: "",
        gpsX: "",
        gpsY: "",
        note: "",
      });
    } catch (error: any) {
      console.error("Errore nella creazione device:", error);
      setErrors({
        general: error?.message || "Errore durante la creazione del device",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <SimpleButton variant="outline" color="primary" size="sm" icon={Plus}>
      Nuovo Device
    </SimpleButton>
  );

  return (
    <Modal
      size="lg"
      triggerButton={triggerButton || defaultTrigger}
      title="Crea Nuovo Device"
      confirmText="Crea Device"
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

        <BaseInfo
          formData={formData}
          // isLoading={isLoading}
          handleInputChange={handleInputChange}
          statusOptions={statusOptions}
          wasteOptions={wasteOptions}
          errors={errors}
        />

        <PositionInfo
          formData={formData}
          // isLoading={isLoading}
          handleInputChange={handleInputChange}
          generateFullAddress={generateFullAddress}
        />

        <TechnicalInfo
          formData={formData}
          // isLoading={isLoading}
          handleInputChange={handleInputChange}
          errors={errors}
        />

        <StatusInfo
          formData={formData}
          // isLoading={isLoading}
          handleInputChange={handleInputChange}
        />

        <Summary formData={formData} />
      </div>
    </Modal>
  );
};
