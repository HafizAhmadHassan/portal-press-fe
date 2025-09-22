// components/LoginCard/LoginCard.tsx
import React from "react";

import styles from "./LoginCard.module.scss";
import LoginForm from "../LoginForm/LoginForm.component";

interface LoginFormData {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginCardProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  onClearError: () => void;
}

const LoginCard: React.FC<LoginCardProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
}) => {
  return (
    <div className={styles.loginCard}>
      <div className={styles.cardGlow}></div>
      <LoginForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        error={error}
        onClearError={onClearError}
      />
    </div>
  );
};

export default LoginCard;
