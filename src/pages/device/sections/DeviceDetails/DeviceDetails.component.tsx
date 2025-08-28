import { useEffect, useState } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import styles from "./DeviceDetails.module.scss";

import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import type { Device } from "@store_admin/devices/devices.types.ts";
import {
  useGetDeviceByIdQuery,
  useUpdateDeviceMutation,
} from "@store_admin/devices/devices.api";
import type { FormData } from "./_forms/deviceEditForm.types";

import ModalDeviceHeader from "@root/pages/admin/sections/devicesList/_modals/ModalDeviceDetail/_components/ModalDeviceHeader/ModalDeviceHeader.component";

import {
  deviceToFormData,
  formDataToDevice,
} from "./_forms/deviceEditForm.mappers";
import { getFullAddress } from "./_utils/details.utils";
import DeviceDetailsRead from "./_views/DeviceDetailsRead/DeviceDetailsRead.component";
import DeviceDetailsEdit from "./_views/DeviceDetailsEdit/DeviceDetailsEdit.component";

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
          {/* Intestazione comune */}
          <ModalDeviceHeader
            device={device}
            displayName={displayName}
            getFullAddress={() => getFullAddress(device as Device)}
          />

          {/* View switch */}
          {!isEdit ? (
            <DeviceDetailsRead device={device} />
          ) : (
            formData && (
              <DeviceDetailsEdit
                formData={formData}
                isSaving={isSaving}
                onChange={onChange}
              />
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
