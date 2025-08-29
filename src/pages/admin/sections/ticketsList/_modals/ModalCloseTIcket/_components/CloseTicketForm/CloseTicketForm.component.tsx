import React from "react";
import styles from "./CloseTicketForm.module.scss";
import { AlertCircle, Calendar, FileText, MapPin } from "lucide-react";
import { Input } from "@shared/inputs/Input.component.tsx";
import { Checkbox } from "@components/shared/checkbox/CheckBox.component";

export type CloseTicketData = {
  id: number | string;
  date_Time?: Date;
  close_Description: string; // ← Campo principale per l'API
  info?: string;
  address?: string;
  inGaranzia?: boolean;
  fuoriGaranzia?: boolean;
  machine_retrival?: boolean;
  machine_not_repairable?: boolean;
  note?: string; // Backward compatibility
  open_Description?: string;
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
        <input
          type="date"
          value={
            formData.date_Time
              ? new Date(formData.date_Time).toISOString().slice(0, 10)
              : ""
          }
          onChange={(e) =>
            onChange(
              "date_Time",
              e.target.value ? new Date(e.target.value) : undefined
            )
          }
          className={styles.dateInput}
        />
      </div>

      {/* Stato garanzia */}
      <div className={styles.group}>
        <label className={styles.label}>
          <AlertCircle size={14} />
          Stato garanzia
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
      </div>

      {/* Opzioni extra */}
      <div className={styles.group}>
        <label className={styles.label}>
          <AlertCircle size={14} />
          Opzioni aggiuntive
        </label>

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

      {/* Descrizione di chiusura - CAMPO PRINCIPALE */}
      <div className={styles.group}>
        <label className={styles.label}>
          <FileText size={14} />
          Descrizione chiusura <span className={styles.required}>*</span>
        </label>
        <Input
          label=" "
          hideLabel
          name="close_Description"
          value={formData.close_Description || ""}
          onChange={(e) => onChange("close_Description", e.target.value)}
          placeholder="Descrivi come è stato risolto il problema..."
          multiline
          error={errors.close_Description}
          variant="default"
          size="md"
        />
        {errors.close_Description && (
          <div className={styles.errorLine}>
            <AlertCircle className={styles.errorIcon} />
            {errors.close_Description}
          </div>
        )}
      </div>

      {/* Mostra descrizione apertura per contesto */}
      {formData.open_Description && (
        <div className={styles.group}>
          <label className={styles.label}>
            <FileText size={14} />
            Descrizione apertura (riferimento)
          </label>
          <div className={styles.readOnlyText}>{formData.open_Description}</div>
        </div>
      )}

      {/* Info riassuntive */}
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
