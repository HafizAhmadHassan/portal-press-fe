// src/sections/ticketsList/_modals/ModalOpenTicket/_components/OpenTicketForm/OpenTicketForm.component.tsx
import React from "react";
import styles from "./OpenTicketForm.module.scss";
import { Calendar, FileText, Tag } from "lucide-react";

import { Input } from "@shared/inputs/Input.component.tsx";
import { CheckboxGroup } from "@components/shared/checkbox/CheckBox.component";

import type {
  MessageCreate,
  ProblemCategory,
} from "@store_admin/tickets/ticket.types";

type Props = {
  formData: MessageCreate;
  errors: Record<string, string>;
  onChange: <K extends keyof MessageCreate>(
    field: K,
    value: MessageCreate[K]
  ) => void;
  problemOptions: ProblemCategory[];
};

const OpenTicketForm: React.FC<Props> = ({
  formData,
  errors,
  onChange,
  problemOptions,
}) => {
  const handleStatus = (val: 1 | 2) => onChange("status", val);

  const mapLabel = (p: ProblemCategory) =>
    ((
      {
        DATA_BASE: "Database",
        IDRAULICO: "Idraulico",
        ELETTRICO: "Elettrico",
        MECCANICO: "Meccanico",
      } as Record<string, string>
    )[p] ?? p);

  return (
    <section className={styles.form}>
      {/* Stato */}
      <div className={styles.group}>
        <label className={styles.label}>
          <Calendar size={14} />
          Stato <span className={styles.required}>*</span>
        </label>

        <div className={styles.optionsRow}>
          {[1, 2].map((val) => (
            <label key={val} className={styles.radio}>
              <input
                type="radio"
                name="status"
                checked={formData.status === val}
                onChange={() => handleStatus(val as 1 | 2)}
              />
              <span>{val === 1 ? "Aperto (1)" : "Chiuso (2)"}</span>
            </label>
          ))}
        </div>

        {errors.status && (
          <div className={styles.errorLine}>
            <FileText className={styles.errorIcon} />
            {errors.status}
          </div>
        )}
      </div>

      {/* Problema */}
      <div className={styles.group}>
        <label className={styles.label}>
          <Tag size={14} />
          Problema <span className={styles.required}>*</span>
        </label>

        <div className={styles.checkboxWrap}>
          <CheckboxGroup
            options={problemOptions.map((p) => ({
              label: mapLabel(p),
              value: p,
              // alcune versioni del tuo CheckboxGroup guardano anche "text"
              text: mapLabel(p),
            }))}
            value={formData.problema}
            onChange={(selected) =>
              onChange("problema", selected as ProblemCategory[])
            }
            layout="grid"
            columns={2}
            size="md"
            color="primary"
          />
        </div>

        {errors.problema && (
          <div className={styles.errorLine}>
            <FileText className={styles.errorIcon} />
            {errors.problema}
          </div>
        )}
      </div>

      {/* Descrizione apertura */}
      <div className={styles.group}>
        <label className={styles.label}>
          <FileText size={14} />
          Descrizione apertura <span className={styles.required}>*</span>
        </label>

        <Input
          label=" "
          name="open_Description"
          value={formData.open_Description}
          onChange={(e) => onChange("open_Description", e.target.value)}
          placeholder="Descrivi il problema..."
          multiline
          error={errors.open_Description}
          hideLabel
          variant="default"
          size="md"
        />
      </div>
    </section>
  );
};

export default OpenTicketForm;
