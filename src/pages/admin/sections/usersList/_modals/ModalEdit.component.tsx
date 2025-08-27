import React, { useEffect, useState } from "react";

import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";

import { RoleBadge } from "@shared/roleBadge/RoleBadge.tsx";
import { Avatar } from "@shared/avatar/Avatar.compoent.tsx";
import {
  Calendar,
  Edit,
  Mail,
  Settings,
  Shield,
  User as UserIcon,
} from "lucide-react";
import type { User } from "@store_admin/users/user.types";
import { UserRoleLabels, UserRoles } from "@utils/constants/userRoles.ts";
import styles from "./ModalEdit.module.scss";
import Modal from "@components/shared/modal/Modal";
import { Input } from "@components/shared/inputs/Input.component";
import {
  Checkbox,
  CheckboxGroup,
} from "@components/shared/checkbox/CheckBox.component";

interface ModalEditComponentProps {
  user: User;
  onSave?: (updatedUser: Partial<User>) => void;
}

export const ModalEditComponent: React.FC<ModalEditComponentProps> = ({
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    id: user.id || 0,
    username: user.username || "",
    email: user.email || "",
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    fullName: user.fullName || "",
    isActive: user.isActive || false,
    is_staff: user.is_staff || false,
    is_superuser: user.is_superuser || false,
    user_permissions: user.user_permissions || [],
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFormData({
      id: user.id || 0,
      username: user.username || "",
      email: user.email || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      fullName: user.fullName || "",
      isActive: user.isActive || false,
      is_staff: user.is_staff || false,
      is_superuser: user.is_superuser || false,
      user_permissions: user.user_permissions || [],
    });
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!formData.username.trim())
      errors.push("Il campo Username è obbligatorio.");
    if (!formData.email.trim()) errors.push("Il campo Email è obbligatorio.");
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.push("L'email non è valida.");
    return errors;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const errors = validateForm();
      if (errors.length > 0) {
        // eslint-disable-next-line no-console
        console.log("Errori di validazione:", errors);
        setIsLoading(false);
        return;
      }
      await onSave?.(formData);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Errore nel salvataggio:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      size="lg"
      triggerButton={
        <SimpleButton size="bare" color="warning" variant="ghost" icon={Edit} />
      }
      title="Modifica utente"
      confirmText="Salva Modifiche"
      cancelText="Annulla"
      onConfirm={handleSave}
      variant="primary"
      loading={isLoading}
    >
      <div className={styles.modalContent}>
        {/* Header con avatar */}
        <div className={styles.userHeader}>
          <Avatar user={user} size="lg" />
          <div className={styles.userInfo}>
            <h3 className={styles.userName}>
              {user.fullName ||
                `${user.first_name} ${user.last_name}`.trim() ||
                user.username}
            </h3>
            <p className={styles.userEmail}>{user.email}</p>
            <div className={styles.userBadges}>
              <RoleBadge user={user} />
              <span
                className={`${styles.statusBadge} ${
                  user.isActive ? styles.statusActive : styles.statusInactive
                }`}
              >
                {user.isActive ? "Attivo" : "Inattivo"}
              </span>
            </div>
          </div>
        </div>

        {/* Info di sistema */}
        <div className={styles.systemInfo}>
          <div className={styles.systemInfoItem}>
            <UserIcon className={styles.systemIcon} />
            <div>
              <p className={styles.systemLabel}>ID Utente</p>
              <p className={styles.systemValue}>#{user.id}</p>
            </div>
          </div>
          <div className={styles.systemInfoItem}>
            <Calendar className={styles.systemIcon} />
            <div>
              <p className={styles.systemLabel}>Data Creazione</p>
              <p className={styles.systemValue}>
                {formatDate(user.dataJoined)}
              </p>
            </div>
          </div>
          <div className={styles.systemInfoItem}>
            <Calendar className={styles.systemIcon} />
            <div>
              <p className={styles.systemLabel}>Ultimo Login</p>
              <p className={styles.systemValue}>
                {formatDate(user.last_login)}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <Settings className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Informazioni Modificabili</h4>
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Inserisci username"
              icon={UserIcon}
              disabled={isLoading}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Inserisci email"
              icon={Mail}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Nome"
              name="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              placeholder="Inserisci nome"
              disabled={isLoading}
            />
            <Input
              label="Cognome"
              name="last_name"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              placeholder="Inserisci cognome"
              disabled={isLoading}
            />
          </div>

          <Input
            label="Nome Completo"
            name="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Inserisci nome completo"
            disabled={isLoading}
          />

          <div className={styles.privilegesSection}>
            <div className={styles.sectionHeader}>
              <Shield className={styles.sectionIcon} />
              <h5 className={styles.sectionSubtitle}>Stati e Privilegi</h5>
            </div>

            <div className={styles.checkboxGrid}>
              <Checkbox
                label="Utente Attivo"
                checked={formData.isActive}
                onChange={(checked) => handleInputChange("isActive", checked)}
                disabled={isLoading}
                color="success"
              />
              <Checkbox
                label="Staff"
                checked={formData.is_staff}
                onChange={(checked) => handleInputChange("is_staff", checked)}
                disabled={isLoading}
                color="warning"
              />
              <Checkbox
                label="Super Admin"
                checked={formData.is_superuser}
                onChange={(checked) =>
                  handleInputChange("is_superuser", checked)
                }
                disabled={isLoading}
                color="danger"
              />
            </div>
          </div>

          <div className={styles.permissionsSection}>
            <CheckboxGroup
              label="Permessi Utente"
              description="Seleziona i permessi da assegnare all'utente"
              options={Object.values(UserRoles).map((role) => ({
                label: UserRoleLabels[role],
                value: role,
              }))}
              value={formData.user_permissions}
              onChange={(permissions) =>
                handleInputChange("user_permissions", permissions)
              }
              layout="grid"
              columns={2}
              disabled={isLoading}
              color="primary"
            />
          </div>
        </div>

        <div className={styles.infoNote}>
          <p className={styles.infoNoteText}>
            <strong>Nota:</strong> Le modifiche diventeranno effettive dopo il
            salvataggio. L'utente potrebbe dover effettuare nuovamente il login
            se vengono modificati i permessi.
          </p>
        </div>
      </div>
    </Modal>
  );
};
