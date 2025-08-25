// @sections_admin/gpsList/_modals/ModalEditGps.component.tsx
import React, { useEffect, useState } from 'react';
import Modal from '@components/shared/modal/Modal';
import { SimpleButton } from '@shared/simple-btn/SimpleButton.component';
import { Edit, Satellite, MapPin, ClipboardList, Hash } from 'lucide-react';
import { Input } from '@components/shared/inputs/Input.component';
import styles from './ModalEditGps.module.scss';
import type { GpsDevice } from '@store_admin/gps/gps.types';

interface Props {
  device: GpsDevice;
  onSave?: (updated: Partial<GpsDevice> & { id: string | number }) => void | Promise<void>;
}

export const ModalEditGps: React.FC<Props> = ({ device, onSave }) => {
  const [form, setForm] = useState<Partial<GpsDevice>>({ ...device });
  const [loading, setLoading] = useState(false);

  useEffect(() => setForm({ ...device }), [device]);

  const set = (k: keyof GpsDevice, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = async () => {
    setLoading(true);
    try {
      await onSave?.({ id: device.id, ...form });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size="lg"
      triggerButton={<SimpleButton size="bare" color="warning" variant="ghost" icon={Edit} />}
      title="Modifica GPS"
      confirmText="Salva"
      cancelText="Annulla"
      onConfirm={handleSave}
      loading={loading}
      variant="primary"
    >
      <div className={styles.modalContent}>
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <Satellite className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Informazioni</h4>
          </div>

          <div className={styles.formGrid}>
            <Input label="Codice" value={form.codice || ''} onChange={(e) => set('codice', e.target.value)} icon={ClipboardList} />
            <Input label="Cliente" value={form.customer || ''} onChange={(e) => set('customer', e.target.value)} />
          </div>

          <div className={styles.formGrid}>
            <Input label="gps_x (lat)" value={form.gps_x || ''} onChange={(e) => set('gps_x', e.target.value)} icon={Hash} />
            <Input label="gps_y (lng)" value={form.gps_y || ''} onChange={(e) => set('gps_y', e.target.value)} icon={Hash} />
          </div>

          <div className={styles.formGrid}>
            <Input label="Comune" value={form.municipility || ''} onChange={(e) => set('municipility', e.target.value)} icon={MapPin} />
            <Input label="Rifiuto" value={form.waste || ''} onChange={(e) => set('waste', e.target.value)} />
          </div>

          <Input label="Indirizzo" value={form.address || ''} onChange={(e) => set('address', e.target.value)} icon={MapPin} />
        </div>
      </div>
    </Modal>
  );
};
