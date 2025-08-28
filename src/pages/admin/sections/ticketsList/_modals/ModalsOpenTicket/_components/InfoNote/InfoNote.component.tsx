import React from "react";
import styles from "./InfoNote.module.scss";
import { FileText } from "lucide-react";

const InfoNote: React.FC = () => {
  return (
    <div className={styles.note}>
      <FileText size={14} />
      <span>
        <strong>Importante:</strong> il customer è impostato automaticamente
        dalla macchina selezionata e non è modificabile. Compila i campi
        obbligatori (*) prima di salvare.
      </span>
    </div>
  );
};

export default InfoNote;
