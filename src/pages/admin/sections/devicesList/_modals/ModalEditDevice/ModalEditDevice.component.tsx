import React, { useEffect, useState } from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { Input } from "@shared/inputs/Input.component.tsx";
import { Checkbox } from "@shared/checkbox/CheckBox.component.tsx";
import {
  Calendar,
  Edit,
  MapPin,
  Monitor,
  Settings,
  Smartphone,
} from "lucide-react";
import type { Device } from "@store_admin/devices/devices.types.ts";
import styles from "./ModalEditDevice.module.scss";
import { WasteBadge } from "@shared/waste-badge/WasteBadge.component.tsx";

interface ModalEditDeviceProps {
  device: Device;
  onSave?: (updatedDevice: any) => Promise<void>;
}

interface FormData {
  machineName: string;
  waste: string;
  status: number;
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
  ipRouter: string;
  gpsX: string;
  gpsY: string;
  note: string;
}

export const ModalEditDevice: React.FC<ModalEditDeviceProps> = ({
  device,
  onSave,
}) => {
  const deviceToFormData = (d: Device): FormData => ({
    machineName: d.machine__Name || "",
    waste: d.waste || "",
    status: d.status ?? 0,
    linuxVersion: d.linux_version || "",
    startAvailable: d.start_available || "",
    endAvailable: d.end_available || "",
    street: d.street || "",
    postalCode: d.postal_code || "",
    province: d.province || "",
    city: d.city || "",
    country: d.country || "",
    municipality: d.municipality || "",
    address: d.address || "",
    statusReadyD75_3_7: d.status_ready_d75_3_7 || false,
    statusMachineBlocked: d.status_machine_blocked || false,
    codiceGps: d.codice_gps || "",
    sheetName: d.sheet_name || "",
    customerName: d.customer_name || "",
    matricolaBte: d.matricola_bte || "",
    matricolaKgn: d.matricola_kgn || "",
    customer: d.customer || "",
    ipRouter: d.ip_router || "",
    gpsX: d.gps_x || "",
    gpsY: d.gps_y || "",
    note: d.note || "",
  });

  const formDataToDevice = (f: FormData) => ({
    machine__Name: f.machineName,
    waste: f.waste || null,
    status: f.status,
    linux_version: f.linuxVersion || null,
    start_available: f.startAvailable || null,
    end_available: f.endAvailable || null,
    street: f.street || null,
    postal_code: f.postalCode || null,
    province: f.province || null,
    city: f.city || null,
    country: f.country || null,
    municipality: f.municipality || null,
    address: f.address || null,
    status_ready_d75_3_7: f.statusReadyD75_3_7,
    status_machine_blocked: f.statusMachineBlocked,
    codice_gps: f.codiceGps || null,
    sheet_name: f.sheetName || null,
    customer_name: f.customerName || null,
    matricola_bte: f.matricolaBte || null,
    matricola_kgn: f.matricolaKgn || null,
    customer: f.customer || null,
    ip_router: f.ipRouter || null,
    gps_x: f.gpsX || null,
    gps_y: f.gpsY || null,
    note: f.note || null,
  });

  const [formData, setFormData] = useState<FormData>(() =>
    deviceToFormData(device)
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData(deviceToFormData(device));
  }, [device]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (!onSave) throw new Error("onSave function is not provided");
      const converted = formDataToDevice(formData);
      await onSave(converted);
    } catch (e) {
      console.error("EDIT_MODAL - Errore nel salvataggio:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayName = device.machine__Name || `Dispositivo ${device.id}`;

  return (
    <Modal
      size="lg"
      triggerButton={
        <SimpleButton size="bare" color="warning" variant="ghost" icon={Edit} />
      }
      title={`Modifica dispositivo: ${displayName}`}
      confirmText="Salva Modifiche"
      cancelText="Annulla"
      onConfirm={handleSave}
      variant="primary"
      loading={isLoading}
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.deviceHeader}>
          <div className={styles.deviceIcon}>
            <Monitor size={32} />
          </div>
          <div className={styles.deviceInfo}>
            <h3 className={styles.deviceName}>{displayName}</h3>
            <p className={styles.deviceCustomer}>
              {device.customer ||
                device.customer_name ||
                "Cliente non specificato"}
            </p>
            <div className={styles.deviceBadges}>
              <WasteBadge waste={device.waste} />
              <span
                className={`${styles.statusBadge} ${
                  device.status === 1
                    ? styles.statusActive
                    : styles.statusInactive
                }`}
              >
                {device.status === 1 ? "Attivo" : "Inattivo"}
              </span>
            </div>
          </div>
        </div>

        {/* System info */}
        <div className={styles.systemInfo}>
          <div className={styles.systemInfoItem}>
            <Monitor className={styles.systemIcon} />
            <div>
              <p className={styles.systemLabel}>ID Dispositivo</p>
              <p className={styles.systemValue}>#{device.id}</p>
            </div>
          </div>
          <div className={styles.systemInfoItem}>
            <Calendar className={styles.systemIcon} />
            <div>
              <p className={styles.systemLabel}>Data Creazione</p>
              <p className={styles.systemValue}>
                {formatDate(device.created_at)}
              </p>
            </div>
          </div>
          <div className={styles.systemInfoItem}>
            <Calendar className={styles.systemIcon} />
            <div>
              <p className={styles.systemLabel}>Ultimo Aggiornamento</p>
              <p className={styles.systemValue}>
                {formatDate(device.updated_at)}
              </p>
            </div>
          </div>
        </div>

        {/* General */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <Settings className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Informazioni Generali</h4>
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Nome Macchina"
              name="machineName"
              value={formData.machineName}
              onChange={(e) => handleInputChange("machineName", e.target.value)}
              placeholder="Inserisci nome macchina"
              icon={Monitor}
              disabled={isLoading}
            />

            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Tipo Rifiuto</label>
              <select
                className={styles.selectInput}
                value={formData.waste}
                onChange={(e) => handleInputChange("waste", e.target.value)}
                disabled={isLoading}
              >
                <option value="">Seleziona tipo</option>
                <option value="Plastica">Plastica</option>
                <option value="Secco">Secco</option>
                <option value="Umido">Umido</option>
                <option value="Vetro">Vetro</option>
                <option value="Indifferenziato">Indifferenziato</option>
                <option value="Carta">Carta</option>
                <option value="vpl">VPL</option>
              </select>
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.selectGroup}>
              <label className={styles.selectLabel}>Stato</label>
              <select
                className={styles.selectInput}
                value={formData.status}
                onChange={(e) =>
                  handleInputChange("status", parseInt(e.target.value))
                }
                disabled={isLoading}
              >
                <option value={0}>Inattivo</option>
                <option value={1}>Attivo</option>
              </select>
            </div>

            <Input
              label="Versione Linux"
              name="linuxVersion"
              value={formData.linuxVersion}
              onChange={(e) =>
                handleInputChange("linuxVersion", e.target.value)
              }
              placeholder="es. Ubuntu 22.04"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Orario Inizio"
              name="startAvailable"
              type="time"
              value={formData.startAvailable}
              onChange={(e) =>
                handleInputChange("startAvailable", e.target.value)
              }
              disabled={isLoading}
            />
            <Input
              label="Orario Fine"
              name="endAvailable"
              type="time"
              value={formData.endAvailable}
              onChange={(e) =>
                handleInputChange("endAvailable", e.target.value)
              }
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Location */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <MapPin className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Informazioni di Ubicazione</h4>
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Indirizzo/Via"
              name="street"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              placeholder="Via, Numero civico"
              disabled={isLoading}
            />
            <Input
              label="Città"
              name="city"
              value={formData.city}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="Nome città"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Provincia"
              name="province"
              value={formData.province}
              onChange={(e) => handleInputChange("province", e.target.value)}
              placeholder="Sigla provincia"
              disabled={isLoading}
            />
            <Input
              label="CAP"
              name="postalCode"
              value={formData.postalCode}
              onChange={(e) => handleInputChange("postalCode", e.target.value)}
              placeholder="Codice postale"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Paese"
              name="country"
              value={formData.country}
              onChange={(e) => handleInputChange("country", e.target.value)}
              placeholder="Nome paese"
              disabled={isLoading}
            />
            <Input
              label="Municipalità"
              name="municipality"
              value={formData.municipality}
              onChange={(e) =>
                handleInputChange("municipality", e.target.value)
              }
              placeholder="Nome municipalità"
              disabled={isLoading}
            />
          </div>

          <Input
            label="Indirizzo Completo"
            name="address"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            placeholder="Indirizzo completo"
            disabled={isLoading}
          />
        </div>

        {/* Tech */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <Smartphone className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Informazioni Tecniche</h4>
          </div>

          <div className={styles.formGrid}>
            <Input
              label="IP Router"
              name="ipRouter"
              value={formData.ipRouter}
              onChange={(e) => handleInputChange("ipRouter", e.target.value)}
              placeholder="192.168.1.100"
              disabled={isLoading}
            />
            <Input
              label="Codice GPS"
              name="codiceGps"
              value={formData.codiceGps}
              onChange={(e) => handleInputChange("codiceGps", e.target.value)}
              placeholder="Codice identificativo GPS"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Coordinate GPS X (Longitudine)"
              name="gpsX"
              value={formData.gpsX}
              onChange={(e) => handleInputChange("gpsX", e.target.value)}
              placeholder="es. 12.4964"
              disabled={isLoading}
            />
            <Input
              label="Coordinate GPS Y (Latitudine)"
              name="gpsY"
              value={formData.gpsY}
              onChange={(e) => handleInputChange("gpsY", e.target.value)}
              placeholder="es. 41.9028"
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Matricola BTE"
              name="matricolaBte"
              value={formData.matricolaBte}
              onChange={(e) =>
                handleInputChange("matricolaBte", e.target.value)
              }
              placeholder="Codice matricola BTE"
              disabled={isLoading}
            />
            <Input
              label="Matricola KGN"
              name="matricolaKgn"
              value={formData.matricolaKgn}
              onChange={(e) =>
                handleInputChange("matricolaKgn", e.target.value)
              }
              placeholder="Codice matricola KGN"
              disabled={isLoading}
            />
          </div>

          <Input
            label="Sheet Name"
            name="sheetName"
            value={formData.sheetName}
            onChange={(e) => handleInputChange("sheetName", e.target.value)}
            placeholder="Nome del foglio"
            disabled={isLoading}
          />
        </div>

        {/* Customer */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <Settings className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Informazioni Cliente</h4>
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Nome Cliente"
              name="customerName"
              value={formData.customerName}
              onChange={(e) =>
                handleInputChange("customerName", e.target.value)
              }
              placeholder="Nome completo del cliente"
              disabled={isLoading}
            />
            <Input
              label="Cliente (Codice)"
              name="customer"
              value={formData.customer}
              onChange={(e) => handleInputChange("customer", e.target.value)}
              placeholder="Codice cliente"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Flags */}
        <div className={styles.privilegesSection}>
          <div className={styles.sectionHeader}>
            <Settings className={styles.sectionIcon} />
            <h5 className={styles.sectionSubtitle}>Stati e Flag</h5>
          </div>

          <div className={styles.checkboxGrid}>
            <Checkbox
              label="Status Ready D75_3_7"
              description="Indica se il dispositivo è pronto per l'uso"
              checked={formData.statusReadyD75_3_7}
              onChange={(checked) =>
                handleInputChange("statusReadyD75_3_7", checked)
              }
              disabled={isLoading}
              color="success"
            />
            <Checkbox
              label="Macchina Bloccata"
              description="Indica se la macchina è bloccata"
              checked={formData.statusMachineBlocked}
              onChange={(checked) =>
                handleInputChange("statusMachineBlocked", checked)
              }
              disabled={isLoading}
              color="danger"
            />
          </div>
        </div>

        {/* Note */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <Settings className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Note</h4>
          </div>

          <div className={styles.textareaGroup}>
            <label className={styles.textareaLabel}>Note aggiuntive</label>
            <textarea
              className={styles.textareaInput}
              value={formData.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              placeholder="Inserisci note aggiuntive sul dispositivo..."
              rows={4}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Info note */}
        <div className={styles.infoNote}>
          <p className={styles.infoNoteText}>
            <strong>Nota:</strong> Le modifiche diventeranno effettive dopo il
            salvataggio. Alcune modifiche potrebbero richiedere il riavvio del
            dispositivo.
          </p>
        </div>
      </div>
    </Modal>
  );
};
