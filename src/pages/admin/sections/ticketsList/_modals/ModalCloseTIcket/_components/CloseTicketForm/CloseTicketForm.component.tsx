import React from "react";
import styles from "./CloseTicketForm.module.scss";
import { AlertCircle, Calendar, FileText, MapPin } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import { Checkbox } from "@components/shared/checkbox/CheckBox.component";

export type CloseTicketData = {
  ticketId: number | string | undefined;
  date?: Date;
  note?: string;
  info?: string;
  address?: string;
  inGaranzia?: boolean;
  fuoriGaranzia?: boolean;
  machine_retrival?: boolean;
  machine_not_repairable?: boolean;
};

type Props = {
  formData: CloseTicketData;
  errors: Record<string, string>;
  onChange: <K extends keyof CloseTicketData>(
    field: K,
    value: CloseTicketData[K]
  ) => void;
};

const CloseTicketForm: React.FC<Props> = ({ formData, errors, onChange }) => {
  return (
    <section className={styles.form}>
      {/* Data chiusura */}
      <div className={styles.group}>
        <label className={styles.label}>
          <Calendar size={14} />
          Data chiusura
        </label>
        {/* Input nativo date per compatibilità totale */}
        <input
          type="date"
          value={
            formData.date
              ? new Date(formData.date).toISOString().slice(0, 10)
              : ""
          }
          onChange={(e) =>
            onChange(
              "date",
              e.target.value ? new Date(e.target.value) : undefined
            )
          }
          className={styles.dateInput}
        />
      </div>

      {/* Opzioni di chiusura */}
      <div className={styles.group}>
        <label className={styles.label}>
          <AlertCircle size={14} />
          Opzioni di chiusura
        </label>

        <div className={styles.checkboxWrap}>
          <Checkbox
            label="In garanzia"
            checked={!!formData.inGaranzia}
            onChange={(v) => onChange("inGaranzia", v)}
            color="primary"
          />
          <Checkbox
            label="Fuori garanzia"
            checked={!!formData.fuoriGaranzia}
            onChange={(v) => onChange("fuoriGaranzia", v)}
            color="primary"
          />
        </div>

        <div className={styles.checkboxWrap}>
          <Checkbox
            label="Ripristino macchina"
            checked={!!formData.machine_retrival}
            onChange={(v) => onChange("machine_retrival", v)}
            color="primary"
          />
          <Checkbox
            label="Macchina non riparabile in loco"
            checked={!!formData.machine_not_repairable}
            onChange={(v) => onChange("machine_not_repairable", v)}
            color="primary"
          />
        </div>
      </div>

      {/* Indirizzo (readonly) */}
      <div className={styles.group}>
        <label className={styles.label}>
          <MapPin size={14} />
          Indirizzo
        </label>
        <Input
          label=" "
          hideLabel
          name="address"
          value={formData.address || ""}
          onChange={() => {}}
          disabled
          placeholder="Ubicazione non specificata"
          variant="default"
          size="md"
        />
      </div>

      {/* Nota di chiusura */}
      <div className={styles.group}>
        <label className={styles.label}>
          <FileText size={14} />
          Nota di chiusura <span className={styles.required}>*</span>
        </label>
        <Input
          label=" "
          hideLabel
          name="note"
          value={formData.note || ""}
          onChange={(e) => onChange("note", e.target.value)}
          placeholder="Inserisci la nota di chiusura..."
          multiline
          error={errors.note}
          variant="default"
          size="md"
        />
        {errors.note && (
          <div className={styles.errorLine}>
            <AlertCircle className={styles.errorIcon} />
            {errors.note}
          </div>
        )}
      </div>

      {/* Info (riassunto) opzionale / non richiesta, ma utile da visualizzare o copiare */}
      {formData.info && (
        <div className={styles.group}>
          <label className={styles.label}>
            <FileText size={14} />
            Info riassuntive
          </label>
          <pre className={styles.pre}>{formData.info}</pre>
        </div>
      )}
    </section>
  );
};

export default CloseTicketForm;
