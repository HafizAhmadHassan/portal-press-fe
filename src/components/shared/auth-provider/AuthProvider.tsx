// src/_components/shared/auth-provider/AuthProvider.tsx
import React, { type ReactNode, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { initializeAuthAsync as initializeAuth } from "@store_admin/auth/auth.thunks";
import { setInitialized } from "@store_admin/auth/auth.slice";
import type { RootState } from "@root/store";
import { useAuth } from "@store_admin/auth/hooks/useAuth";
import { useAppDispatch } from "@root/pages/admin/core/store/store.hooks";

interface AuthProviderProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  fallback = <div>Caricamento autenticazione…</div>,
}) => {
  const dispatch = useAppDispatch();
  const initStarted = useRef(false);

  const { isInitialized } = useAuth();
  const token = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    // Previeni inizializzazioni multiple
    if (initStarted.current) return;

    initStarted.current = true;

    if (token) {
      console.log("🔐 Token found, initializing auth...");
      dispatch(initializeAuth());
    } else {
      console.log("❌ No token found, skipping auth init");
      dispatch(setInitialized());
    }
  }, []); // <- Rimosso `token` dalle dipendenze

  // Effetto separato per gestire i cambi di token DOPO l'inizializzazione
  useEffect(() => {
    if (!isInitialized) return;

    if (token) {
      console.log("🔄 Token updated after initialization");
      // Qui potresti fare altre azioni se necessario
    } else {
      console.log("🚪 Token removed, user might be logged out");
      // Reset se necessario
      initStarted.current = false;
    }
  }, [token, isInitialized]);

  console.log(
    "🏗️ AuthProvider render - isInitialized:",
    isInitialized,
    "hasToken:",
    !!token
  );

  if (!isInitialized) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// Componente di loading personalizzabile
export const AuthLoadingScreen: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      color: "white",
      fontSize: "18px",
      fontFamily: "Arial, sans-serif",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "3px solid rgba(255,255,255,0.3)",
          borderTop: "3px solid white",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 20px",
        }}
      />
      Inizializzazione...
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  </div>
);
