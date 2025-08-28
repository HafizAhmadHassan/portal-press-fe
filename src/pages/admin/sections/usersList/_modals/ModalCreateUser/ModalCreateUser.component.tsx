import React, { useState } from "react";
import Modal from "@components/shared/modal/Modal";
import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { AlertCircle, Plus } from "lucide-react";

import CredentialsCard from "./_components/CredentialsCard/CredentialsCard.component";
import PersonalInfoCard from "./_components/PersonalInfoCard/PersonalInfoCard.component";
import StatusPrivilegesCard from "./_components/StatusPrivilegesCard/StatusPrivilegesCard.component";
import PermissionsCard from "./_components/PermissionsCard/PermissionsCard.component";
import SummaryCard from "./_components/SummaryCard/SummaryCard.component";

import styles from "./ModalCreateUser.module.scss";
import type {
  ModalCreateUserProps,
  FormData,
  FormErrors,
} from "./_types/ModalCreateUser.types";

export const ModalCreateUser: React.FC<ModalCreateUserProps> = ({
  onSave,
  triggerButton,
}) => {
  const [formData, setFormData] = useState<FormData>({
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

    if (!formData.password) e.password = "Password è obbligatoria";
    else if (formData.password.length < 8) e.password = "Minimo 8 caratteri";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      e.password = "Serve maiuscola, minuscola e numero";

    if (!formData.confirmPassword) e.confirmPassword = "Conferma la password";
    else if (formData.password !== formData.confirmPassword)
      e.confirmPassword = "Le password non coincidono";

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
      delete payload.confirmPassword;
      await onSave?.(payload);
      resetForm();
    } catch (error: any) {
      setErrors({
        general: error?.message || "Errore durante la creazione dell'utente",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = (
    <SimpleButton variant="outline" color="primary" size="sm" icon={Plus}>
      Nuovo Utente
    </SimpleButton>
  );

  return (
    <Modal
      size="lg"
      triggerButton={triggerButton || defaultTrigger}
      title="Crea Nuovo Utente"
      confirmText="Crea Utente"
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
