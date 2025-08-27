import React, { useState } from "react";

import { SimpleButton } from "@shared/simple-btn/SimpleButton.component.tsx";
import { Input } from "@shared/inputs/Input.component.tsx";

import {
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Plus,
  Shield,
  User as UserIcon,
} from "lucide-react";
import type { User } from "@store_admin/users/user.types";
import { UserRoleLabels, UserRoles } from "@utils/constants/userRoles.ts";
import styles from "./ModalCreateUser.module.scss";
import {
  Checkbox,
  CheckboxGroup,
} from "@components/shared/checkbox/CheckBox.component";
import Modal from "@components/shared/modal/Modal";

interface ModalCreateUserProps {
  onSave?: (userData: Partial<User>) => Promise<void>;
  triggerButton?: React.ReactNode;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  isStaff: boolean;
  isSuperuser: boolean;
  user_permissions: string[];
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

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
    user_permissions: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username?.trim())
      newErrors.username = "Username è obbligatorio";
    else if (formData.username.length < 3)
      newErrors.username = "Minimo 3 caratteri";
    else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username))
      newErrors.username = "Ammessi lettere, numeri, _ e -";

    if (!formData.email?.trim()) newErrors.email = "Email è obbligatoria";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Formato email non valido";

    if (!formData.password) newErrors.password = "Password è obbligatoria";
    else if (formData.password.length < 8)
      newErrors.password = "Minimo 8 caratteri";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = "Serve maiuscola, minuscola e numero";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Conferma la password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Le password non coincidono";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const generateFullName = () => {
    const fullName = `${formData.first_name} ${formData.last_name}`.trim();
    handleInputChange("fullName", fullName);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setErrors({});
    try {
      const userData: any = { ...formData };
      delete userData.confirmPassword;
      await onSave?.(userData);
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        first_name: "",
        last_name: "",
        fullName: "",
        isActive: true,
        is_staff: false,
        is_superuser: false,
        user_permissions: [],
      });
    } catch (error: any) {
      setErrors({
        general: error?.message || "Errore durante la creazione dell'utente",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[a-z]/.test(password)) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^a-zA-Z\d]/.test(password)) s++;
    return s;
  };
  const passwordStrength = getPasswordStrength(formData.password);

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
      variant="filled"
      loading={isLoading}
    >
      <div className={styles.modalContent}>
        {errors.general && (
          <div className={styles.errorAlert}>
            <AlertCircle className={styles.errorIcon} />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Credenziali */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Lock className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Credenziali di Accesso</h4>
            <span className={styles.sectionBadge}>Obbligatorio</span>
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="es. john_doe"
              icon={UserIcon}
              disabled={isLoading}
              required
              error={errors.username}
            />

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="es. john@example.com"
              icon={Mail}
              disabled={isLoading}
              required
              error={errors.email}
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.passwordField}>
              <Input
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Inserisci password sicura"
                icon={Lock}
                disabled={isLoading}
                required
                error={errors.password}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className={styles.passwordField}>
              <Input
                label="Conferma Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                placeholder="Ripeti la password"
                icon={Lock}
                disabled={isLoading}
                required
                error={errors.confirmPassword}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword((v) => !v)}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {formData.password && (
            <div className={styles.passwordStrength}>
              <div className={styles.strengthLabel}>Sicurezza password:</div>
              <div className={styles.strengthBar}>
                <div
                  className={`${styles.strengthFill} ${
                    styles[`strength${passwordStrength}`]
                  }`}
                  style={{ width: `${(passwordStrength / 5) * 100}%` }}
                />
              </div>
              <div className={styles.strengthText}>
                {passwordStrength <= 2 && "Debole"}
                {passwordStrength === 3 && "Media"}
                {passwordStrength === 4 && "Forte"}
                {passwordStrength === 5 && "Molto forte"}
              </div>
            </div>
          )}
        </div>

        {/* Info personali */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <UserIcon className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Informazioni Personali</h4>
            <span className={styles.sectionBadgeOptional}>Opzionale</span>
          </div>

          <div className={styles.formGrid}>
            <Input
              label="Nome"
              name="first_name"
              value={formData.first_name}
              onChange={(e) => {
                handleInputChange("first_name", e.target.value);
                setTimeout(generateFullName, 0);
              }}
              placeholder="es. John"
              disabled={isLoading}
            />

            <Input
              label="Cognome"
              name="last_name"
              value={formData.last_name}
              onChange={(e) => {
                handleInputChange("last_name", e.target.value);
                setTimeout(generateFullName, 0);
              }}
              placeholder="es. Doe"
              disabled={isLoading}
            />
          </div>

          <Input
            label="Nome Completo"
            name="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            placeholder="Generato automaticamente o inserisci manualmente"
            disabled={isLoading}
          />
        </div>

        {/* Stati e privilegi */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Shield className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Stati e Privilegi</h4>
          </div>

          <div className={styles.privilegesGrid}>
            <Checkbox
              label="Utente Attivo"
              description="L'utente può accedere al sistema"
              checked={formData.isActive}
              onChange={(checked) => handleInputChange("isActive", checked)}
              disabled={isLoading}
              color="success"
            />
            <Checkbox
              label="Staff"
              description="Accesso alle funzioni di amministrazione"
              checked={formData.is_staff}
              onChange={(checked) => handleInputChange("is_staff", checked)}
              disabled={isLoading}
              color="warning"
            />
            <Checkbox
              label="Super Amministratore"
              description="Accesso completo a tutte le funzioni"
              checked={formData.is_superuser}
              onChange={(checked) => handleInputChange("is_superuser", checked)}
              disabled={isLoading}
              color="danger"
            />
          </div>
        </div>

        {/* Permessi */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <Shield className={styles.sectionIcon} />
            <h4 className={styles.sectionTitle}>Permessi Utente</h4>
          </div>

          <div className={styles.permissionsContainer}>
            <CheckboxGroup
              description="Seleziona i permessi da assegnare al nuovo utente"
              options={Object.values(UserRoles).map((role) => ({
                label: UserRoleLabels[role],
                value: role,
                description: `Permessi di ${UserRoleLabels[
                  role
                ].toLowerCase()}`,
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

        {/* Riassunto */}
        <div className={styles.summarySection}>
          <div className={styles.summaryHeader}>
            <CheckCircle className={styles.summaryIcon} />
            <h4 className={styles.summaryTitle}>Riassunto Utente</h4>
          </div>

          <div className={styles.summaryContent}>
            <div className={styles.summaryItem}>
              <strong>Username:</strong>{" "}
              {formData.username || "Non specificato"}
            </div>
            <div className={styles.summaryItem}>
              <strong>Email:</strong> {formData.email || "Non specificata"}
            </div>
            <div className={styles.summaryItem}>
              <strong>Nome:</strong>{" "}
              {formData.fullName ||
                `${formData.first_name} ${formData.last_name}`.trim() ||
                "Non specificato"}
            </div>
            <div className={styles.summaryItem}>
              <strong>Stato:</strong>{" "}
              {formData.isActive ? "Attivo" : "Inattivo"}
            </div>
            <div className={styles.summaryItem}>
              <strong>Permessi:</strong>{" "}
              {formData.user_permissions.length > 0
                ? formData.user_permissions
                    .map((p) => UserRoleLabels[p])
                    .join(", ")
                : "Nessun permesso"}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
