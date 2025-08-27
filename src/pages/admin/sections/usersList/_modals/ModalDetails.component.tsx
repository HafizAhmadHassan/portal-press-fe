import React from "react";

import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { RoleBadge } from "@shared/roleBadge/RoleBadge.tsx";
import { Avatar } from "@shared/avatar/Avatar.compoent.tsx";
import {
  Badge,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  Eye,
  Settings,
  Shield,
  User as UserIcon,
  Users,
  XCircle,
} from "lucide-react";
import type { User } from "@store_admin/users/user.types";
import { UserRoleLabels } from "@utils/constants/userRoles.ts";
import styles from "./ModalDetails.module.scss";

import Modal from "@components/shared/modal/Modal";

interface ModalDetailsProps {
  user: User;
}

export const ModalDetails: React.FC<ModalDetailsProps> = ({ user }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Mai";
    const date = new Date(dateString);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return null;
    const d = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - d.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Oggi";
    if (diffInDays === 1) return "Ieri";
    if (diffInDays < 7) return `${diffInDays} giorni fa`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} settimane fa`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} mesi fa`;
    return `${Math.floor(diffInDays / 365)} anni fa`;
  };

  const displayName =
    user.fullName ||
    `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
    user.username;

  return (
    <Modal
      size="lg"
      triggerButton={
        <SimpleButton size="bare" color="primary" variant="ghost" icon={Eye} />
      }
      cancelText="Chiudi"
      variant="primary"
    >
      <div className={styles.modalContent}>
        {/* Header */}
        <div className={styles.userHeader}>
          <div className={styles.avatarSection}>
            <Avatar user={user} size="xl" />
            <div className={styles.statusIndicator}>
              {user.isActive ? (
                <CheckCircle className={styles.statusIconActive} />
              ) : (
                <XCircle className={styles.statusIconInactive} />
              )}
            </div>
          </div>

          <div className={styles.userMainInfo}>
            <h3 className={styles.userName}>{displayName}</h3>
            <p className={styles.userEmail}>{user.email || "Nessuna email"}</p>
            <p className={styles.userUsername}>@{user.username}</p>

            <div className={styles.userBadges}>
              <RoleBadge user={user} />
              <span
                className={`${styles.statusBadge} ${
                  user.isActive ? styles.statusActive : styles.statusInactive
                }`}
              >
                {user.isActive ? "Attivo" : "Inattivo"}
              </span>
              {user.is_staff && (
                <span className={styles.staffBadge}>
                  <Settings className={styles.badgeIcon} />
                  Staff
                </span>
              )}
              {user.is_superuser && (
                <span className={styles.superuserBadge}>
                  <Crown className={styles.badgeIcon} />
                  Super Admin
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Info personali */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <UserIcon className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Informazioni Personali</h4>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Nome</span>
              <span className={styles.infoValue}>
                {user.first_name || "Non specificato"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Cognome</span>
              <span className={styles.infoValue}>
                {user.last_name || "Non specificato"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Nome Completo</span>
              <span className={styles.infoValue}>
                {user.fullName || "Non specificato"}
              </span>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Shield className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Informazioni Account</h4>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>ID Utente</span>
              <span className={styles.infoValue}>#{user.id}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Username</span>
              <span className={styles.infoValue}>@{user.username}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>
                {user.email ? (
                  <a href={`mailto:${user.email}`} className={styles.emailLink}>
                    {user.email}
                  </a>
                ) : (
                  "Nessuna email"
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Calendar className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Date e Accessi</h4>
          </div>

          <div className={styles.dateGrid}>
            <div className={styles.dateCard}>
              <div className={styles.dateCardHeader}>
                <Calendar className={styles.dateIcon} />
                <span className={styles.dateCardTitle}>Data Creazione</span>
              </div>
              <div className={styles.dateCardContent}>
                <span className={styles.dateValue}>
                  {formatDate(user.dataJoined)}
                </span>
                <span className={styles.dateRelative}>
                  {getRelativeTime(user.dataJoined)}
                </span>
              </div>
            </div>

            <div className={styles.dateCard}>
              <div className={styles.dateCardHeader}>
                <Clock className={styles.dateIcon} />
                <span className={styles.dateCardTitle}>Ultimo Login</span>
              </div>
              <div className={styles.dateCardContent}>
                <span className={styles.dateValue}>
                  {formatDate(user.last_login)}
                </span>
                <span className={styles.dateRelative}>
                  {user.last_login
                    ? getRelativeTime(user.last_login)
                    : "Mai effettuato login"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Permessi */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Badge className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Permessi e Ruoli</h4>
          </div>

          <div className={styles.permissionsContainer}>
            {user.user_permissions && user.user_permissions.length > 0 ? (
              <div className={styles.permissionsList}>
                {user.user_permissions.map((permission, index) => (
                  <div key={index} className={styles.permissionChip}>
                    <Shield className={styles.permissionIcon} />
                    {UserRoleLabels[permission] || permission}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noPermissions}>
                <Users className={styles.noPermissionsIcon} />
                <span>Nessun permesso assegnato</span>
              </div>
            )}
          </div>
        </div>

        {/* Gruppi */}
        {user.groups && user.groups.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <Users className={styles.sectionIcon} />
              <h4 className={styles.sectionTitle}>Gruppi</h4>
            </div>

            <div className={styles.groupsList}>
              {user.groups.map((group, index) => (
                <div key={index} className={styles.groupChip}>
                  <Users className={styles.groupIcon} />
                  {group}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privilegi */}
        <div className={styles.privilegesSection}>
          <div className={styles.sectionHeader}>
            <Crown className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Riassunto Privilegi</h4>
          </div>

          <div className={styles.privilegesList}>
            <div
              className={`${styles.privilegeItem} ${
                user.isActive
                  ? styles.privilegeActive
                  : styles.privilegeInactive
              }`}
            >
              {user.isActive ? (
                <CheckCircle className={styles.privilegeIcon} />
              ) : (
                <XCircle className={styles.privilegeIcon} />
              )}
              <span>Account {user.isActive ? "Attivo" : "Disattivato"}</span>
            </div>

            <div
              className={`${styles.privilegeItem} ${
                user.is_staff
                  ? styles.privilegeActive
                  : styles.privilegeInactive
              }`}
            >
              {user.is_staff ? (
                <CheckCircle className={styles.privilegeIcon} />
              ) : (
                <XCircle className={styles.privilegeIcon} />
              )}
              <span>
                Accesso Staff {user.is_staff ? "Abilitato" : "Disabilitato"}
              </span>
            </div>

            <div
              className={`${styles.privilegeItem} ${
                user.is_superuser
                  ? styles.privilegeActive
                  : styles.privilegeInactive
              }`}
            >
              {user.is_superuser ? (
                <CheckCircle className={styles.privilegeIcon} />
              ) : (
                <XCircle className={styles.privilegeIcon} />
              )}
              <span>
                Super Amministratore{" "}
                {user.is_superuser ? "Abilitato" : "Disabilitato"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
