import React from "react";
import styles from "./InfoNote.module.scss";
import { FileText } from "lucide-react";

const InfoNote: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.note}>
      <FileText size={14} />
      <span>{children}</span>
    </div>
  );
};

export default InfoNote;
