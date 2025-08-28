import React, { useEffect, useMemo, useState } from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { AlertCircle, Edit, Eye, Plus } from "lucide-react";

import CredentialsCard from "./_components/CredentialsCard/CredentialsCard.component";
import PersonalInfoCard from "./_components/PersonalInfoCard/PersonalInfoCard.component";
import StatusPrivilegesCard from "./_components/StatusPrivilegesCard/StatusPrivilegesCard.component";
import PermissionsCard from "./_components/PermissionsCard/PermissionsCard.component";
import SummaryCard from "./_components/SummaryCard/SummaryCard.component";

import styles from "./ModalCreateUpdateUser.module.scss";

import type {
  ModalCreateUpdateUserProps,
  FormData,
  FormErrors,
} from "./_types/ModalCreateUpdateUser.types";

/** Mapper robusto da User (parziale) -> FormData */
function mapInitialUserToForm(u?: Partial<any> | null): FormData {
  const firstName = (u?.firstName ?? u?.first_name ?? "") as string;
  const lastName = (u?.lastName ?? u?.last_name ?? "") as string;

  return {
    username: (u?.username ?? "") as string,
    email: (u?.email ?? "") as string,
    password: "",
    confirmPassword: "",
    firstName,
    lastName,
    fullName: (u?.fullName ??
      u?.full_name ??
      `${firstName} ${lastName}`.trim()) as string,
    isActive: Boolean(u?.isActive ?? u?.is_active ?? true),
    isStaff: Boolean(u?.isStaff ?? u?.is_staff ?? false),
    isSuperuser: Boolean(u?.isSuperuser ?? u?.is_superuser ?? false),
    permissions: (u?.permissions ?? u?.roles ?? []) as string[],
  };
}

export const ModalCreateUpdateUser: React.FC<ModalCreateUpdateUserProps> = ({
  mode,
  onSave,
  triggerButton,
  initialUser,
}) => {
  const isEdit = mode === "edit";

  const [formData, setFormData] = useState<FormData>(
    isEdit
      ? mapInitialUserToForm(initialUser)
      : {
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          fullName: "",
          isActive: true,
          isStaff: false,
          isSuperuser: false,
          permissions: [],
        }
  );

  // Precompila/aggiorna quando cambiano i dati iniziali in edit
  useEffect(() => {
    if (isEdit) {
      setFormData(mapInitialUserToForm(initialUser));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isEdit,
    initialUser?.username,
    initialUser?.email,
    initialUser?.firstName,
    initialUser?.lastName,
    initialUser?.fullName,
    initialUser?.isActive,
    initialUser?.isStaff,
    initialUser?.isSuperuser,
    JSON.stringify(initialUser?.permissions),
  ]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const e: FormErrors = {};

    if (!formData.username?.trim()) e.username = "Username è obbligatorio";
    else if (formData.username.length < 3) e.username = "Minimo 3 caratteri";
    else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username))
      e.username = "Ammessi lettere, numeri, _ e -";

    if (!formData.email?.trim()) e.email = "Email è obbligatoria";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      e.email = "Formato email non valido";

    // Password: obbligatoria SOLO in create.
    // In edit è opzionale: valida solo se compilata.
    const wantsPasswordChange = Boolean(
      formData.password || formData.confirmPassword
    );

    if (!isEdit) {
      if (!formData.password) e.password = "Password è obbligatoria";
    }
    if (!isEdit || wantsPasswordChange) {
      if (formData.password && formData.password.length < 8)
        e.password = "Minimo 8 caratteri";
      else if (
        formData.password &&
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)
      )
        e.password = "Serve maiuscola, minuscola e numero";

      if (!formData.confirmPassword && !isEdit)
        e.confirmPassword = "Conferma la password";
      else if (
        wantsPasswordChange &&
        formData.password !== formData.confirmPassword
      )
        e.confirmPassword = "Le password non coincidono";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if ((errors as any)[field])
      setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const resetForm = () =>
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      fullName: "",
      isActive: true,
      isStaff: false,
      isSuperuser: false,
      permissions: [],
    });

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const payload: any = { ...formData };
      // Non inviare conferma
      delete payload.confirmPassword;
      // In EDIT se password è vuota, non inviarla
      if (isEdit && !payload.password) {
        delete payload.password;
      }

      await onSave?.(payload);

      // Reset solo in create; in edit manteniamo i dati (tipico flusso di aggiornamento)
      if (!isEdit) resetForm();
    } catch (error: any) {
      setErrors({
        general:
          error?.message ||
          (isEdit
            ? "Errore durante l'aggiornamento dell'utente"
            : "Errore durante la creazione dell'utente"),
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = useMemo(() => {
    if (triggerButton) return triggerButton;
    return isEdit ? (
      <SimpleButton variant="ghost" color="warning" size="bare" icon={Edit} />
    ) : (
      <SimpleButton variant="outline" color="primary" size="sm" icon={Plus}>
        Crea Utente
      </SimpleButton>
    );
  }, [isEdit, triggerButton]);

  const modalTitle = isEdit ? "Modifica Utente" : "Crea Nuovo Utente";
  const confirmText = isEdit ? "Salva modifiche" : "Crea Utente";

  return (
    <Modal
      size="lg"
      triggerButton={defaultTrigger}
      title={modalTitle}
      confirmText={confirmText}
      cancelText="Annulla"
      onConfirm={handleSave}
      // loading={isLoading}
    >
      <div className={styles.modalContent}>
        {errors.general && (
          <div className={styles.errorAlert}>
            <AlertCircle className={styles.errorIcon} />
            <span>{errors.general}</span>
          </div>
        )}

        <CredentialsCard
          values={{
            username: formData.username,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          }}
          errors={{
            username: errors.username,
            email: errors.email,
            password: errors.password,
            confirmPassword: errors.confirmPassword,
          }}
          disabled={isLoading}
          onChange={(field, value) =>
            handleChange(field as keyof FormData, value)
          }
        />

        <PersonalInfoCard
          values={{
            firstName: formData.firstName,
            lastName: formData.lastName,
            fullName: formData.fullName,
          }}
          disabled={isLoading}
          onChange={(field, value) =>
            handleChange(field as keyof FormData, value)
          }
        />

        <StatusPrivilegesCard
          values={{
            isActive: formData.isActive,
            isStaff: formData.isStaff,
            isSuperuser: formData.isSuperuser,
          }}
          disabled={isLoading}
          onChange={(field, value) =>
            handleChange(field as keyof FormData, value)
          }
        />

        <PermissionsCard
          permissions={formData.permissions}
          disabled={isLoading}
          onChange={(perms) => handleChange("permissions", perms)}
        />

        <SummaryCard
          username={formData.username}
          email={formData.email}
          firstName={formData.firstName}
          lastName={formData.lastName}
          fullName={formData.fullName}
          isActive={formData.isActive}
          permissions={formData.permissions}
        />
      </div>
    </Modal>
  );
};
