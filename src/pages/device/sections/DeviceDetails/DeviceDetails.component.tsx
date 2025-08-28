import React, { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import styles from "./DeviceDetails.module.scss";

import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
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

// edit cards
import GeneralInfoFormCard from "./_components/GeneralInfoFormCard/GeneralInfoFormCard.component";
import LocationInfoFormCard from "./_components/LocationInfoFormCard/LocationInfoFormCard.component";
import TechnicalInfoFormCard from "./_components/TechnicalInfoFormCard/TechnicalInfoFormCard.component";
import CustomerInfoFormCard from "./_components/CustomerInfoFormCard/CustomerInfoFormCard.component";
import FlagsFormCard from "./_components/FlagsFormCard/FlagsFormCard.component";
import NotesFormCard from "./_components/NotesFormCard/NotesFormCard.component";

import type { FormData } from "./_forms/deviceEditForm.types";
import {
  deviceToFormData,
  formDataToDevice,
} from "./_forms/deviceEditForm.mappers";

export default function DeviceDetailsPage() {
  const { deviceId } = useParams<{ deviceId?: string }>();
  const {
    data: device,
    refetch,
    isError,
  } = useGetDeviceByIdQuery(deviceId ? Number(deviceId) : undefined, {
    skip: !deviceId,
  });

  const [updateDevice, { isLoading: isSaving }] = useUpdateDeviceMutation();

  // ==== edit state (?edit=1) ====
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEdit, setIsEdit] = useState<boolean>(
    searchParams.get("edit") === "1"
  );
  useEffect(() => setIsEdit(searchParams.get("edit") === "1"), [searchParams]);

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

  // ==== form state (solo in edit) ====
  const [formData, setFormData] = useState<FormData | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (device && isEdit) {
      setFormData(deviceToFormData(device));
      setDirty(false);
    }
  }, [device, isEdit]);

  const onChange = (field: keyof FormData | string, value: any) => {
    setFormData((prev) => {
      if (!prev) return prev;
      const next = { ...prev, [field]: value } as FormData;
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
        data: undefined,
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

  if (!deviceId) {
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

  const displayName = device?.machine_Name || `Dispositivo ${device?.id}`;

  return (
    <>
      <section className={styles.page}>
        <div className={styles.pageContent}>
          {/* Intestazione */}
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
                    <strong>Nota:</strong> Le modifiche diventeranno effettive
                    dopo il salvataggio. Alcune modifiche potrebbero richiedere
                    il riavvio del dispositivo.
                  </p>
                </div>
              </>
            )
          )}
        </div>
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
            disabled={!dirty || isSaving}
          >
            Salva
          </SimpleButton>
        </div>
      )}
    </>
  );
}
