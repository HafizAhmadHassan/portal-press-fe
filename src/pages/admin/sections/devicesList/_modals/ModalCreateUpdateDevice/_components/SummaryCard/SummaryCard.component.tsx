import React from "react";
import { CheckCircle, Monitor, MapPin, Users, Settings } from "lucide-react";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";
import styles from "./SummaryCard.module.scss";

type FormData = {
  machine_Name: string;
  status: number;
  waste: string;
  customerName: string;
  customer: string;
  address: string;
  street: string;
  city: string;
  ip_Router: string;
  status_ready_d75_3_7: boolean;
  status_Machine_Blocked: boolean;
};

type Props = {
  formData: FormData;
};

export default function SummaryCard({ formData }: Props) {
  const getAddress = () => {
    return (
      formData.address ||
      `${formData.street} ${formData.city}`.trim() ||
      "Non specificata"
    );
  };

  const getCustomer = () => {
    return formData.customerName || formData.customer || "Non specificato";
  };

  const getStatuses = () => {
    const statuses = [];
    if (formData.status_ready_d75_3_7) statuses.push("Pronto D75_3_7");
    if (formData.status_Machine_Blocked) statuses.push("Bloccato");
    return statuses.length > 0
      ? statuses.join(", ")
      : "Nessuno stato particolare";
  };

  return (
    <DeviceCard
      title="Riassunto Device"
      icon={<CheckCircle size={18} />}
      info={<span className={styles.summaryBadge}>Anteprima</span>}
      bodyClassName={styles.body}
    >
      <div className={styles.summaryGrid}>
        <div className={styles.summaryItem}>
          <div className={styles.itemIcon}>
            <Monitor size={16} />
          </div>
          <div className={styles.itemContent}>
            <span className={styles.itemLabel}>Nome Macchina:</span>
            <span className={styles.itemValue}>
              {formData.machine_Name || "Non specificato"}
            </span>
          </div>
        </div>

        <div className={styles.summaryItem}>
          <div className={styles.itemIcon}>
            <Settings size={16} />
          </div>
          <div className={styles.itemContent}>
            <span className={styles.itemLabel}>Stato:</span>
            <span
              className={`${styles.itemValue} ${
                formData.status === 1
                  ? styles.statusActive
                  : styles.statusInactive
              }`}
            >
              {formData.status === 1 ? "Attivo" : "Inattivo"}
            </span>
          </div>
        </div>

        <div className={styles.summaryItem}>
          <div className={styles.itemIcon}>
            <Settings size={16} />
          </div>
          <div className={styles.itemContent}>
            <span className={styles.itemLabel}>Tipo Rifiuto:</span>
            <span className={styles.itemValue}>
              {formData.waste || "Non specificato"}
            </span>
          </div>
        </div>

        <div className={styles.summaryItem}>
          <div className={styles.itemIcon}>
            <MapPin size={16} />
          </div>
          <div className={styles.itemContent}>
            <span className={styles.itemLabel}>Posizione:</span>
            <span className={styles.itemValue}>{getAddress()}</span>
          </div>
        </div>

        <div className={styles.summaryItem}>
          <div className={styles.itemIcon}>
            <Users size={16} />
          </div>
          <div className={styles.itemContent}>
            <span className={styles.itemLabel}>Cliente:</span>
            <span className={styles.itemValue}>{getCustomer()}</span>
          </div>
        </div>

        <div className={styles.summaryItem}>
          <div className={styles.itemIcon}>
            <Settings size={16} />
          </div>
          <div className={styles.itemContent}>
            <span className={styles.itemLabel}>IP Router:</span>
            <span className={styles.itemValue}>
              {formData.ip_Router || "Non specificato"}
            </span>
          </div>
        </div>

        <div className={`${styles.summaryItem} ${styles.fullWidth}`}>
          <div className={styles.itemIcon}>
            <CheckCircle size={16} />
          </div>
          <div className={styles.itemContent}>
            <span className={styles.itemLabel}>Stati:</span>
            <span className={styles.itemValue}>{getStatuses()}</span>
          </div>
        </div>
      </div>
    </DeviceCard>
  );
}
