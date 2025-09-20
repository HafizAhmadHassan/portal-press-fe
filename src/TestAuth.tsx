// components/TestAuth.tsx - FOCUS SOLO SUL REFRESH TOKEN
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@root/store";

import { useAuthInvalidation } from "@hooks/useAuthInvalidation";
import { refreshTokenAsync } from "@store_admin/auth/auth.thunks";
import {
  debugToken,
  isTokenExpired,
  getTokenTimeRemaining,
  formatTokenTimeRemaining,
} from "@utils/jwtUtils";
import { useAppDispatch } from "./pages/admin/core/store/store.hooks";

interface TestResult {
  type: "success" | "error" | "warning" | "info";
  message: string;
  timestamp: string;
}

export const TestAuth: React.FC = () => {
  const dispatch = useAppDispatch();
  const [enabled, setEnabled] = useState(true);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const isRunningRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { forceRefreshAndInvalidate } = useAuthInvalidation();

  const { user, token, refresh, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  const username = user?.username;
  const hasToken = !!token;
  const hasRefresh = !!refresh;

  // Helper per aggiungere risultati
  const addResult = useCallback((type: TestResult["type"], message: string) => {
    const result: TestResult = {
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };

    setTestResults((prev) => [result, ...prev].slice(0, 15)); // Mantieni ultimi 15
  }, []);

  const analyzeTokens = useCallback(() => {
    const results = [];

    if (token) {
      const isExpired = isTokenExpired(token);
      const timeRemaining = formatTokenTimeRemaining(token);

      if (isExpired) {
        results.push({
          type: "error" as const,
          message: "Access token SCADUTO",
        });
      } else {
        results.push({
          type: "success" as const,
          message: `Access token OK (${timeRemaining})`,
        });
      }
    }

    if (refresh) {
      const isExpired = isTokenExpired(refresh);
      const timeRemaining = formatTokenTimeRemaining(refresh);

      if (isExpired) {
        results.push({
          type: "error" as const,
          message: "Refresh token SCADUTO - Rifare login",
        });
      } else {
        results.push({
          type: "info" as const,
          message: `Refresh token OK (${timeRemaining})`,
        });
      }
    }

    return results;
  }, [token, refresh]);

  const runTokenTest = useCallback(async () => {
    if (isRunningRef.current) {
      console.log("⏩ Test già in corso, skip");
      return;
    }

    isRunningRef.current = true;
    console.group("🔄 Token Refresh Test");
    addResult("info", "Test token avviato...");

    try {
      // 1. Analisi stato attuale
      const tokenAnalysis = analyzeTokens();
      tokenAnalysis.forEach((result) => addResult(result.type, result.message));

      // 2. Debug dettagliato token
      if (token) {
        debugToken(token, "Current Access Token");

        // Controlla payload
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.user_id) {
            addResult("info", `Token per user_id: ${payload.user_id}`);
          }
          if (!payload.username && !payload.email) {
            addResult("warning", "Token minimale (solo user_id)");
          }
        } catch (e) {
          addResult("error", "Token JWT malformato");
        }
      }

      if (refresh) {
        debugToken(refresh, "Current Refresh Token");
      }

      // 3. Test refresh se necessario o casuale
      const shouldRefresh =
        (token && getTokenTimeRemaining(token) < 300) || // Token scade tra meno di 5 minuti
        Math.random() < 0.25; // 25% delle volte

      if (refresh && shouldRefresh) {
        addResult("info", "Avvio test refresh...");
        console.log("🔄 Testing token refresh...");

        // Salva info pre-refresh per confronto
        const oldTokenPayload = token
          ? JSON.parse(atob(token.split(".")[1]))
          : null;

        try {
          const result = await dispatch(refreshTokenAsync()).unwrap();
          console.log("✅ Refresh successful, new tokens received:", {
            hasNewAccess: !!result.access,
            hasNewRefresh: !!result.refresh,
          });

          addResult("success", "Refresh completato - nuovi token ricevuti");

          // Confronta token vecchi vs nuovi
          if (result.access && oldTokenPayload) {
            const newPayload = JSON.parse(atob(result.access.split(".")[1]));
            const timeDiff = newPayload.exp - oldTokenPayload.exp;
            addResult(
              "info",
              `Nuova scadenza: +${Math.round(timeDiff / 60)}min`
            );
          }
        } catch (error: any) {
          console.log("❌ Refresh failed:", error);
          addResult(
            "error",
            `Refresh fallito: ${error?.message || error?.status || "Unknown"}`
          );

          // Se refresh fallisce, potrebbe essere che il refresh token è scaduto
          if (error?.status === 401 || error?.status === 403) {
            addResult(
              "warning",
              "Refresh token probabilmente scaduto - rifare login"
            );
          }
        }
      }

      // 4. Verifica finale stato
      addResult(
        "info",
        `Stato finale: Auth=${isAuthenticated}, Token=${!!token}, Refresh=${!!refresh}`
      );
    } catch (error: any) {
      console.error("💥 Token test error:", error);
      addResult("error", `Test error: ${error?.message || "Unknown error"}`);
    } finally {
      isRunningRef.current = false;
      console.groupEnd();
    }
  }, [dispatch, token, refresh, isAuthenticated, analyzeTokens, addResult]);

  useEffect(() => {
    if (localStorage.getItem("STOP_AUTH_TEST") === "true" || !enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Test più frequente per tokens che scadono presto
    const interval =
      token && getTokenTimeRemaining(token) < 600 ? 15000 : 45000; // 15s se scade presto, 45s normale
    intervalRef.current = setInterval(runTokenTest, interval);

    runTokenTest();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, runTokenTest, token]);

  const handleManualRefresh = async () => {
    console.log("🔄 Manual refresh triggered by user");
    addResult("info", "Refresh manuale...");

    const success = await forceRefreshAndInvalidate();
    addResult(
      success ? "success" : "error",
      success ? "Refresh manuale OK" : "Refresh manuale fallito"
    );
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getResultColor = (type: TestResult["type"]): string => {
    switch (type) {
      case "success":
        return "#52c41a";
      case "error":
        return "#ff4d4f";
      case "warning":
        return "#faad14";
      case "info":
        return "#1890ff";
      default:
        return "#666";
    }
  };

  const getResultIcon = (type: TestResult["type"]): string => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      default:
        return "•";
    }
  };

  // Calcola statistiche token
  const accessTokenTime = token ? formatTokenTimeRemaining(token) : "N/A";
  const refreshTokenTime = refresh ? formatTokenTimeRemaining(refresh) : "N/A";
  const accessTokenExpired = token ? isTokenExpired(token) : false;
  const refreshTokenExpired = refresh ? isTokenExpired(refresh) : false;

  return (
    <div
      style={{
        padding: "1rem",
        background: enabled ? "#e6ffed" : "#ffe6e6",
        color: "#333",
        border: "1px solid #ccc",
        margin: "1rem",
        borderRadius: "8px",
        fontFamily: "monospace",
        fontSize: "14px",
        maxWidth: "900px",
      }}
    >
      <h3 style={{ margin: "0 0 1rem 0" }}>🔄 Token Refresh Monitor</h3>

      {/* Token Status */}
      <div
        style={{
          marginBottom: "1rem",
          background: "#f0f0f0",
          padding: "0.5rem",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.5rem",
            fontSize: "12px",
          }}
        >
          <div>
            <strong>Access Token:</strong>
            <span
              style={{
                color: accessTokenExpired ? "#ff4d4f" : "#52c41a",
                marginLeft: "8px",
              }}
            >
              {accessTokenExpired ? "🔴 SCADUTO" : "🟢 VALIDO"}
            </span>
            <br />
            <small>Scade tra: {accessTokenTime}</small>
          </div>
          <div>
            <strong>Refresh Token:</strong>
            <span
              style={{
                color: refreshTokenExpired ? "#ff4d4f" : "#52c41a",
                marginLeft: "8px",
              }}
            >
              {refreshTokenExpired ? "🔴 SCADUTO" : "🟢 VALIDO"}
            </span>
            <br />
            <small>Scade tra: {refreshTokenTime}</small>
          </div>
        </div>
      </div>

      {/* Main Status */}
      <div style={{ marginBottom: "1rem" }}>
        <div>
          <strong>Monitor:</strong> {enabled ? "🟢 ATTIVO" : "🔴 DISATTIVATO"}
        </div>
        <div>
          <strong>Auth:</strong> {isAuthenticated ? "🟢 OK" : "🔴 NO"}
        </div>
        <div>
          <strong>User:</strong> {username || user?.email || user?.id || "N/A"}
        </div>
        <div>
          <strong>Auto Test:</strong>{" "}
          {isRunningRef.current ? "🔄 Running" : "⏸️ Idle"}
        </div>
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => setEnabled((prev) => !prev)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            background: enabled ? "#ff4d4f" : "#52c41a",
            color: "#fff",
            fontSize: "12px",
          }}
        >
          {enabled ? "Stop Monitor" : "Start Monitor"}
        </button>

        <button
          onClick={handleManualRefresh}
          disabled={!hasRefresh || isRunningRef.current}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor:
              !hasRefresh || isRunningRef.current ? "not-allowed" : "pointer",
            background:
              !hasRefresh || isRunningRef.current ? "#ccc" : "#1890ff",
            color: "#fff",
            fontSize: "12px",
            opacity: !hasRefresh || isRunningRef.current ? 0.6 : 1,
          }}
        >
          🔄 Force Refresh
        </button>

        <button
          onClick={clearResults}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            background: "#666",
            color: "#fff",
            fontSize: "12px",
          }}
        >
          🗑️ Clear Log
        </button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div
          style={{
            maxHeight: "250px",
            overflowY: "auto",
            background: "#f5f5f5",
            borderRadius: "4px",
            padding: "0.5rem",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: "bold",
              marginBottom: "0.5rem",
            }}
          >
            📋 Test Log ({testResults.length}/15)
          </div>
          {testResults.map((result, index) => (
            <div
              key={index}
              style={{
                fontSize: "11px",
                marginBottom: "0.25rem",
                padding: "0.25rem",
                background: "#fff",
                borderRadius: "3px",
                borderLeft: `3px solid ${getResultColor(result.type)}`,
              }}
            >
              <span style={{ color: getResultColor(result.type) }}>
                {getResultIcon(result.type)}
              </span>
              <span
                style={{
                  color: "#666",
                  marginLeft: "0.5rem",
                  fontSize: "10px",
                }}
              >
                [{result.timestamp}]
              </span>
              <span style={{ marginLeft: "0.5rem" }}>{result.message}</span>
            </div>
          ))}
        </div>
      )}

      <p
        style={{
          fontSize: "11px",
          color: "#666",
          margin: "0",
          lineHeight: "1.4",
        }}
      >
        🔍 Monitor focalizzato solo sul refresh dei token.
        <br />
        ⏱️ Test automatico più frequente quando token sta per scadere.
        <br />
        🤖 Nessuna chiamata API extra - solo refresh quando necessario.
      </p>
    </div>
  );
};
