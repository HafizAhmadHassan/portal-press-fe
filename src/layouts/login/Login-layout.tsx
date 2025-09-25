// pages/Login/Login-layout.tsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@store_admin/auth/hooks/useAuth";

import styles from "./Login-layout.module.scss";
import BackgroundDecorations from "./_components/BackgroundDecorations/BackgroundDecorations.component";
import LoginHeader from "./_components/LoginHeader/LoginHeader.component";
import LoginCard from "./_components/LoginCard/LoginCard.component";

interface LoginFormData {
  emailOrUsername: string;
  password: string;
  rememberMe?: boolean;
}

const LoginLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, isAuthenticated, user, clearError } =
    useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    console.log("Auth state in LoginLayout:", {
      isAuthenticated,
      user: user?.email,
      isInitialized: true,
    });
    if (isAuthenticated) {
      const from = /*  (location.state as any)?.from?.pathname || */ "/admin";
      console.log("User authenticated, redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleFormSubmit = async (formData: LoginFormData) => {
    try {
      // Send username as identifier (email or username)
      const loginData = {
        username: formData.emailOrUsername,
        password: formData.password,
        rememberMe: formData.rememberMe,
      };
      await login(loginData);
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };

  return (
    <div className={styles.loginPage}>
      <BackgroundDecorations />

      <div className={styles.loginContainer}>
        <LoginHeader />

        <div className={styles.loginContent}>
          {/* <SidePanel /> */}
          <LoginCard
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
            error={error}
            onClearError={clearError}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginLayout;
