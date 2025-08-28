import React from "react";
import { CheckCircle, Crown, XCircle } from "lucide-react";
import styles from "./PrivilegesSummaryCard.module.scss";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";

/** Permette di passare l'utente intero OPPURE i soli flag */
type FromUser = {
  user: any;
  className?: string;
};
type FromFlags = {
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  className?: string;
};
type Props = FromUser | FromFlags;

const isFromUser = (p: Props): p is FromUser => "user" in p;

const PrivilegesSummaryCard: React.FC<Props> = (props) => {
  const isActive = isFromUser(props)
    ? !!props.user.is_active
    : !!props.is_active;
  const isStaff = isFromUser(props) ? !!props.user.is_staff : !!props.is_staff;
  const isSuperuser = isFromUser(props)
    ? !!props.user.is_superuser
    : !!props.is_superuser;

  console.log(
    "USER",
    isFromUser(props) ? props.user : { isActive, isStaff, isSuperuser }
  );

  return (
    <DeviceCard
      title="Riassunto Privilegi"
      icon={<Crown size={18} />}
      className={props.className}
    >
      <div className={styles.list}>
        <div
          className={[
            styles.item,
            isActive ? styles.itemActive : styles.itemInactive,
          ].join(" ")}
        >
          {isActive ? (
            <CheckCircle className={styles.itemIcon} />
          ) : (
            <XCircle className={styles.itemIcon} />
          )}
          <span>Account {isActive ? "Attivo" : "Disattivato"}</span>
        </div>

        <div
          className={[
            styles.item,
            isStaff ? styles.itemActive : styles.itemInactive,
          ].join(" ")}
        >
          {isStaff ? (
            <CheckCircle className={styles.itemIcon} />
          ) : (
            <XCircle className={styles.itemIcon} />
          )}
          <span>Accesso Staff {isStaff ? "Abilitato" : "Disabilitato"}</span>
        </div>

        <div
          className={[
            styles.item,
            isSuperuser ? styles.itemActive : styles.itemInactive,
          ].join(" ")}
        >
          {isSuperuser ? (
            <CheckCircle className={styles.itemIcon} />
          ) : (
            <XCircle className={styles.itemIcon} />
          )}
          <span>
            Super Amministratore {isSuperuser ? "Abilitato" : "Disabilitato"}
          </span>
        </div>
      </div>
    </DeviceCard>
  );
};

export default PrivilegesSummaryCard;
