import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import styles from "./DeviceDetails.module.scss";

import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { Input } from "@shared/inputs/Input.component.tsx";
import { Checkbox } from "@shared/checkbox/CheckBox.component.tsx";
import Switch from "@root/components/shared/switch/Switch.component";

import { MapPin, Monitor, Settings, Smartphone, RotateCw } from "lucide-react";
import type { Device } from "@store_admin/devices/devices.types.ts";

import {
  useGetDeviceByIdQuery,
  useUpdateDeviceMutation,
} from "@store_admin/devices/devices.api";

// sezioni read-only già esistenti
import Summary from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/Summary/Summary.component";
import NoteInfo from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/NoteInfo/NoteInfo.component";
import PositionInfoRO from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/PositionInfo/PositionInfo.component";
import RegisterInfoRO from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/RegisterInfo/RegisterInfo.component";
import TechnicalInfoRO from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/TechnicalInfo/TechnicalInfo.component";
import DateHoursInfoRO from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/DateHoursInfo/DateHoursInfo.component";
import CoordinatesInfoRO from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/CoordinatesInfo/CoordinatesInfo.component";
import ModalDeviceHeader from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/ModalDeviceHeader/ModalDeviceHeader.component";

/* =========================
   FORM TYPES/MAPPERS (come tua edit page)
   ========================= */
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

export default function DeviceDetailsPage() {
  const { deviceId } = useParams<{ deviceId: string }>();
  const parsedId = deviceId ? Number(deviceId) : undefined;

  const {
    data: device,
    refetch,
    isFetching,
    isLoading,
    isError,
  } = useGetDeviceByIdQuery(parsedId!, { skip: !parsedId });

  const [updateDevice, { isLoading: isSaving }] = useUpdateDeviceMutation();

  // ==== edit state senza cambiare rotta (sync opzionale via ?edit=1) ====
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEdit, setIsEdit] = useState<boolean>(
    searchParams.get("edit") === "1"
  );

  useEffect(() => {
    setIsEdit(searchParams.get("edit") === "1");
  }, [searchParams]);

  const toggleEdit = (on: boolean) => {
    setIsEdit(on);
    const next = new URLSearchParams(searchParams);
    if (on) next.set("edit", "1");
    else next.delete("edit");
    setSearchParams(next, { replace: true });
    if (on && device) setFormData(deviceToFormData(device));
    if (!on) {
      if (device) setFormData(deviceToFormData(device));
      setDirty(false);
    }
  };

  // ==== helpers read-only ====
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Mai";
    const date = new Date(dateString);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  const getRelativeTime = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diffInDays === 0) return "Oggi";
    if (diffInDays === 1) return "Ieri";
    if (diffInDays < 7) return `${diffInDays} giorni fa`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} settimane fa`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} mesi fa`;
    return `${Math.floor(diffInDays / 365)} anni fa`;
  };
  const formatCoordinates = (x?: string | null, y?: string | null) => {
    if (!x || !y) return "N/A";
    const lat = parseFloat(y);
    const lng = parseFloat(x);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return "Non valide";
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };
  const getFullAddress = (d?: Device) => {
    const parts = [d?.street || d?.address, d?.city, d?.province].filter(
      Boolean
    );
    return parts.length ? parts.join(", ") : "Indirizzo non disponibile";
  };

  // ==== form state (usato solo in edit) ====
  const [formData, setFormData] = useState<FormData | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (device && isEdit) {
      setFormData(deviceToFormData(device));
      setDirty(false);
    }
  }, [device, isEdit]);

  const onChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value };
      setDirty(
        JSON.stringify(next) !==
          JSON.stringify(deviceToFormData(device as Device))
      );
      return next;
    });
  };

  const onCancel = () => {
    if (!device) return;
    setFormData(deviceToFormData(device));
    setDirty(false);
    setIsEdit(false);
    const next = new URLSearchParams(searchParams);
    next.delete("edit");
    setSearchParams(next, { replace: true });
  };

  const onSave = async () => {
    if (!device || !formData) return;
    try {
      await updateDevice({
        id: device.id,
        ...formDataToDevice(formData),
      }).unwrap();
      setDirty(false);
      setIsEdit(false);
      const next = new URLSearchParams(searchParams);
      next.delete("edit");
      setSearchParams(next, { replace: true });
      refetch();
    } catch (e) {
      console.error("DETAILS_EDIT - errore salvataggio", e);
      alert("Errore nel salvataggio del dispositivo");
    }
  };

  if (!parsedId) {
    return (
      <section className={styles.page}>
        <div className={styles.errorState}>Nessun device selezionato.</div>
      </section>
    );
  }
  if (isError) {
    return (
      <section className={styles.page}>
        <div className={styles.errorState}>
          <span>Impossibile caricare il dispositivo.</span>
          <SimpleButton size="sm" onClick={() => refetch()}>
            Riprova
          </SimpleButton>
        </div>
      </section>
    );
  }

  const displayName = device?.machine__Name || `Dispositivo ${device?.id}`;

  return (
    <>
      <section className={styles.page}>
        <div className={styles.pageContent}>
          {/* intestazione sempre uguale */}
          <ModalDeviceHeader
            device={device}
            displayName={displayName}
            getFullAddress={() => getFullAddress(device as Device)}
          />

          {/* READ-ONLY vs EDIT */}
          {!isEdit ? (
            <>
              <TechnicalInfoRO device={device} />
              <PositionInfoRO device={device} />
              <DateHoursInfoRO
                device={device}
                formatDate={formatDate}
                getRelativeTime={getRelativeTime}
              />
              <CoordinatesInfoRO
                device={device}
                formatCoordinates={formatCoordinates}
              />
              <RegisterInfoRO device={device} />
              {device?.note && <NoteInfo device={device} />}
              <Summary device={device} />
            </>
          ) : (
            formData && (
              <>
                {/* Informazioni Generali */}
                <div className={`${styles.section} ${styles.formSection}`}>
                  <div className={styles.sectionHeader}>
                    <Settings className={styles.sectionIcon} />
                    <h4 className={styles.sectionTitle}>
                      Informazioni Generali
                    </h4>
                  </div>
                  <div className={styles.sectionBody}>
                    <div className={styles.formGrid}>
                      <Input
                        label="Nome Macchina"
                        name="machineName"
                        value={formData.machineName}
                        onChange={(e) =>
                          onChange("machineName", e.target.value)
                        }
                        placeholder="Inserisci nome macchina"
                        icon={Monitor}
                        disabled={isSaving}
                      />
                      <div className={styles.selectGroup}>
                        <label className={styles.selectLabel}>
                          Tipo Rifiuto
                        </label>
                        <select
                          className={styles.selectInput}
                          value={formData.waste}
                          onChange={(e) => onChange("waste", e.target.value)}
                          disabled={isSaving}
                        >
                          <option value="">Seleziona tipo</option>
                          <option value="Plastica">Plastica</option>
                          <option value="Secco">Secco</option>
                          <option value="Umido">Umido</option>
                          <option value="Vetro">Vetro</option>
                          <option value="Indifferenziato">
                            Indifferenziato
                          </option>
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
                            onChange("status", parseInt(e.target.value))
                          }
                          disabled={isSaving}
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
                          onChange("linuxVersion", e.target.value)
                        }
                        placeholder="es. Ubuntu 22.04"
                        disabled={isSaving}
                      />
                    </div>

                    <div className={styles.formGrid}>
                      <Input
                        label="Orario Inizio"
                        name="startAvailable"
                        type="time"
                        value={formData.startAvailable}
                        onChange={(e) =>
                          onChange("startAvailable", e.target.value)
                        }
                        disabled={isSaving}
                      />
                      <Input
                        label="Orario Fine"
                        name="endAvailable"
                        type="time"
                        value={formData.endAvailable}
                        onChange={(e) =>
                          onChange("endAvailable", e.target.value)
                        }
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                </div>

                {/* Ubicazione */}
                <div className={`${styles.section} ${styles.formSection}`}>
                  <div className={styles.sectionHeader}>
                    <MapPin className={styles.sectionIcon} />
                    <h4 className={styles.sectionTitle}>
                      Informazioni di Ubicazione
                    </h4>
                  </div>
                  <div className={styles.sectionBody}>
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
                        onChange={(e) =>
                          onChange("municipality", e.target.value)
                        }
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
                  </div>
                </div>

                {/* Tecniche */}
                <div className={`${styles.section} ${styles.formSection}`}>
                  <div className={styles.sectionHeader}>
                    <Smartphone className={styles.sectionIcon} />
                    <h4 className={styles.sectionTitle}>
                      Informazioni Tecniche
                    </h4>
                  </div>
                  <div className={styles.sectionBody}>
                    <div className={styles.formGrid}>
                      <Input
                        label="IP Router"
                        name="ipRouter"
                        value={formData.ipRouter}
                        onChange={(e) => onChange("ipRouter", e.target.value)}
                        placeholder="192.168.1.100"
                        disabled={isSaving}
                      />
                      <Input
                        label="Codice GPS"
                        name="codiceGps"
                        value={formData.codiceGps}
                        onChange={(e) => onChange("codiceGps", e.target.value)}
                        placeholder="Codice identificativo GPS"
                        disabled={isSaving}
                      />
                    </div>

                    <div className={styles.formGrid}>
                      <Input
                        label="Coordinate GPS X (Longitudine)"
                        name="gpsX"
                        value={formData.gpsX}
                        onChange={(e) => onChange("gpsX", e.target.value)}
                        placeholder="es. 12.4964"
                        disabled={isSaving}
                      />
                      <Input
                        label="Coordinate GPS Y (Latitudine)"
                        name="gpsY"
                        value={formData.gpsY}
                        onChange={(e) => onChange("gpsY", e.target.value)}
                        placeholder="es. 41.9028"
                        disabled={isSaving}
                      />
                    </div>

                    <div className={styles.formGrid}>
                      <Input
                        label="Matricola BTE"
                        name="matricolaBte"
                        value={formData.matricolaBte}
                        onChange={(e) =>
                          onChange("matricolaBte", e.target.value)
                        }
                        placeholder="Codice matricola BTE"
                        disabled={isSaving}
                      />
                      <Input
                        label="Matricola KGN"
                        name="matricolaKgn"
                        value={formData.matricolaKgn}
                        onChange={(e) =>
                          onChange("matricolaKgn", e.target.value)
                        }
                        placeholder="Codice matricola KGN"
                        disabled={isSaving}
                      />
                    </div>

                    <Input
                      label="Sheet Name"
                      name="sheetName"
                      value={formData.sheetName}
                      onChange={(e) => onChange("sheetName", e.target.value)}
                      placeholder="Nome del foglio"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                {/* Cliente */}
                <div className={`${styles.section} ${styles.formSection}`}>
                  <div className={styles.sectionHeader}>
                    <Settings className={styles.sectionIcon} />
                    <h4 className={styles.sectionTitle}>
                      Informazioni Cliente
                    </h4>
                  </div>
                  <div className={styles.sectionBody}>
                    <div className={styles.formGrid}>
                      <Input
                        label="Nome Cliente"
                        name="customerName"
                        value={formData.customerName}
                        onChange={(e) =>
                          onChange("customerName", e.target.value)
                        }
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
                  </div>
                </div>

                {/* Flag */}
                <div
                  className={`${styles.section} ${styles.formSection} ${styles.privilegesSection}`}
                >
                  <div className={styles.sectionHeader}>
                    <Settings className={styles.sectionIcon} />
                    <h5 className={styles.sectionSubtitle}>Stati e Flag</h5>
                  </div>
                  <div className={styles.sectionBody}>
                    <div className={styles.checkboxGrid}>
                      <Checkbox
                        label="Status Ready D75_3_7"
                        description="Indica se il dispositivo è pronto per l'uso"
                        checked={formData.statusReadyD75_3_7}
                        onChange={(checked) =>
                          onChange("statusReadyD75_3_7", checked)
                        }
                        disabled={isSaving}
                        color="success"
                      />
                      <Checkbox
                        label="Macchina Bloccata"
                        description="Indica se la macchina è bloccata"
                        checked={formData.statusMachineBlocked}
                        onChange={(checked) =>
                          onChange("statusMachineBlocked", checked)
                        }
                        disabled={isSaving}
                        color="danger"
                      />
                    </div>
                  </div>
                </div>

                {/* Note */}
                <div className={`${styles.section} ${styles.formSection}`}>
                  <div className={styles.sectionHeader}>
                    <Settings className={styles.sectionIcon} />
                    <h4 className={styles.sectionTitle}>Note</h4>
                  </div>
                  <div className={styles.sectionBody}>
                    <div className={styles.textareaGroup}>
                      <label className={styles.textareaLabel}>
                        Note aggiuntive
                      </label>
                      <textarea
                        className={styles.textareaInput}
                        value={formData.note}
                        onChange={(e) => onChange("note", e.target.value)}
                        placeholder="Inserisci note aggiuntive sul dispositivo..."
                        rows={4}
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                </div>

                {/* hint */}
                <div className={styles.infoNote}>
                  <p className={styles.infoNoteText}>
                    <strong>Nota:</strong> Le modifiche diventeranno effettive
                    dopo il salvataggio. Alcune modifiche potrebbero richiedere
                    il riavvio del dispositivo.
                  </p>
                </div>
              </>
            )
          )}
        </div>

        {/* ACTION BAR (solo in edit) */}
      </section>

      {isEdit && (
        <div className={styles.actionBar}>
          <SimpleButton
            size="sm"
            variant="ghost"
            color="secondary"
            onClick={onCancel}
            disabled={isSaving}
          >
            Annulla
          </SimpleButton>
          <SimpleButton
            size="sm"
            color="primary"
            onClick={onSave}
            loading={isSaving}
            disabled={!dirty || isSaving}
          >
            Salva
          </SimpleButton>
        </div>
      )}
    </>
  );
}
