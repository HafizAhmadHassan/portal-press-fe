// components/LoginForm/LoginForm.tsx
import React, { useState } from "react";
import styles from "./LoginForm.module.scss";
import { Input } from "@root/components/shared/inputs/Input.component";
import { SimpleButton } from "@root/components/shared/simple-btn/SimpleButton.component";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface LoginFormData {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    emailOrUsername: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Clear errors when user starts typing
    if (error || localError) {
      onClearError();
      setLocalError(null);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Determine if input is email (for UI/validation, NOT for payload)
  const isEmail = (input: string): boolean => {
    return input.includes("@") && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
  };

  // Updated validation
  const validateForm = (): string | null => {
    if (!formData.emailOrUsername) {
      return "Email o username richiesti";
    }
    // If contains @, validate as email
    if (
      formData.emailOrUsername.includes("@") &&
      !isEmail(formData.emailOrUsername)
    ) {
      return "Email non valida";
    }
    // If doesn't contain @, validate as username (at least 3 chars, no spaces)
    if (!formData.emailOrUsername.includes("@")) {
      if (formData.emailOrUsername.length < 3) {
        return "Username deve essere di almeno 3 caratteri";
      }
      if (formData.emailOrUsername.includes(" ")) {
        return "Username non può contenere spazi";
      }
    }
    if (!formData.password) {
      return "Password richiesta";
    }
    if (formData.password.length < 6) {
      return "Password deve essere di almeno 6 caratteri";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Local validation
    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Login form error:", err);
      setLocalError("Errore imprevisto durante il login");
    }
  };

  // Determine which error to show
  const displayError = localError || error;

  return (
    <div className={styles.loginForm}>
      <div className={styles.formHeader}>
        <h3>Accedi</h3>
        <p>Inserisci le tue credenziali</p>
      </div>

      {/* Error Display */}
      {displayError && (
        <div className={styles.errorMessage}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <Input
              label="Email o Username"
              type="text"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleInputChange}
              placeholder="Inserisci email o username"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.inputWrapper}>
            <Input
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Inserisci la tua password"
              required
              disabled={isLoading}
            />
            <SimpleButton
              variant="ghost"
              size="sm"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeIcon /> : <EyeOffIcon />}
            </SimpleButton>
          </div>
        </div>

        <div className={styles.formOptions}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe || false}
              onChange={handleInputChange}
              disabled={isLoading}
            />
            <span className={styles.checkmark}></span>
            Ricordami
          </label>
          <a href="#forgot" className={styles.forgotLink}>
            Password dimenticata?
          </a>
        </div>

        <SimpleButton
          type="submit"
          className={styles.loginBtn}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.spinner}></span>
              Accesso in corso...
            </>
          ) : (
            "Accedi"
          )}
        </SimpleButton>
      </form>

      <div className={styles.loginFooter}>
        <p>
          Non hai un account?{" "}
          <a href="#signup" className={styles.signupLink}>
            Registrati qui
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
