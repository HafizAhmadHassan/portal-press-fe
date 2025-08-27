// @sections_admin/gpsList/_modals/ModalCreateGps.component.tsx
import React, { useState } from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component";
import { Input } from "@shared/inputs/Input.component";
import { Plus, Hash, MapPin, Satellite, ClipboardList } from "lucide-react";
import type { GpsDevice } from "@store_admin/gps/gps.types";
import styles from "./ModalCreateGps.module.scss";

interface Props {
  onSave?: (data: Partial<GpsDevice>) => Promise<void> | void;
  triggerButton?: React.ReactNode;
}

export const ModalCreateGps: React.FC<Props> = ({ onSave, triggerButton }) => {
  const [form, setForm] = useState<Partial<GpsDevice>>({
    codice: "",
    gps_x: "",
    gps_y: "",
    municipility: "",
    customer: "",
    waste: "",
    address: "",
  });
  const [, /* loading */ setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    codice?: string;
    gps_x?: string;
    gps_y?: string;
    address?: string;
  }>({});

  const set = (k: keyof GpsDevice, v: any) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k as keyof typeof errors])
      setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!form.codice?.trim()) e.codice = "Codice obbligatorio";
    if (!form.gps_x?.trim()) e.gps_x = "gps_x obbligatorio";
    if (!form.gps_y?.trim()) e.gps_y = "gps_y obbligatorio";
    if (!form.address?.trim()) e.address = "Indirizzo obbligatorio";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await onSave?.(form);
      setForm({
        codice: "",
        gps_x: "",
        gps_y: "",
        municipility: "",
        customer: "",
        waste: "",
        address: "",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size="lg"
      triggerButton={
        triggerButton ?? (
          <SimpleButton variant="outline" color="primary" size="sm" icon={Plus}>
            Nuovo GPS
          </SimpleButton>
        )
      }
      title="Crea GPS"
      confirmText="Crea"
      cancelText="Annulla"
      onConfirm={handleSave}
      // loading={loading}
    >
      <div className={styles.modalContent}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Satellite className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Dati dispositivo</h4>
          </div>

          <div className={styles.formGrid}>
            <Input
              name="codice"
              label="Codice"
              value={form.codice || ""}
              onChange={(e) => set("codice", e.target.value)}
              icon={ClipboardList}
              required
              error={errors.codice}
            />
            <Input
              name="customer"
              label="Cliente"
              value={form.customer || ""}
              onChange={(e) => set("customer", e.target.value)}
            />
          </div>

          <div className={styles.formGrid}>
            <Input
              name="gps_x"
              label="gps_x (lat)"
              value={form.gps_x || ""}
              onChange={(e) => set("gps_x", e.target.value)}
              icon={Hash}
              required
              error={errors.gps_x}
            />
            <Input
              name="gps_y"
              label="gps_y (lng)"
              value={form.gps_y || ""}
              onChange={(e) => set("gps_y", e.target.value)}
              icon={Hash}
              required
              error={errors.gps_y}
            />
          </div>

          <div className={styles.formGrid}>
            <Input
              name="municipility"
              label="Comune"
              value={form.municipility || ""}
              onChange={(e) => set("municipility", e.target.value)}
              icon={MapPin}
            />
            <Input
              name="waste"
              label="Tipo rifiuto"
              value={form.waste || ""}
              onChange={(e) => set("waste", e.target.value)}
            />
          </div>

          <div className={styles.fullWidth}>
            <Input
              name="address"
              label="Indirizzo"
              value={form.address || ""}
              onChange={(e) => set("address", e.target.value)}
              icon={MapPin}
              required
              error={errors.address}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
};
