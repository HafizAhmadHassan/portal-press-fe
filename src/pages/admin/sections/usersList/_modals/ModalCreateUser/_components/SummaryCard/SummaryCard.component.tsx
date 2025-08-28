import { CheckCircle } from "lucide-react";
import styles from "./SummaryCard.module.scss";
import { UserRoleLabels } from "@utils/constants/userRoles.ts";
import DeviceCard from "@root/pages/device/sections/_components/DeviceCard/DeviceCard.component";

type Props = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  permissions: string[];
};

export default function SummaryCard({
  username,
  email,
  firstName,
  lastName,
  fullName,
  isActive,
  permissions,
}: Props) {
  const name =
    fullName || `${firstName} ${lastName}`.trim() || "Non specificato";
  const perms = permissions.length
    ? permissions.map((p) => UserRoleLabels[p]).join(", ")
    : "Nessun permesso";

  return (
    <DeviceCard title="Riassunto Utente" icon={<CheckCircle size={18} />}>
      <div className={styles.row}>
        <strong>Username:</strong> {username || "Non specificato"}
      </div>
      <div className={styles.row}>
        <strong>Email:</strong> {email || "Non specificata"}
      </div>
      <div className={styles.row}>
        <strong>Nome:</strong> {name}
      </div>
      <div className={styles.row}>
        <strong>Stato:</strong> {isActive ? "Attivo" : "Inattivo"}
      </div>
      <div className={styles.row}>
        <strong>Permessi:</strong> {perms}
      </div>
    </DeviceCard>
  );
}
