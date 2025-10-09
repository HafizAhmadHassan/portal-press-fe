// 🧪 Componente per testare le notifiche push
import React, { useState, useEffect } from "react";
import {
  requestNotificationPermission,
  onMessageListener,
} from "../../firebase/firebaseConfig";
import "./NotificationTester.module.scss";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface NotificationTesterProps {}

export const NotificationTester: React.FC<NotificationTesterProps> = () => {
  const [token, setToken] = useState<string>("");
  const [permission, setPermission] =
    useState<NotificationPermission>("default");
  const [lastMessage, setLastMessage] = useState<unknown>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    // Verifica se le notifiche sono supportate
    setIsSupported("Notification" in window && "serviceWorker" in navigator);
    setPermission(Notification.permission);

    // Ascolta i messaggi in arrivo
    onMessageListener()
      .then((payload) => {
        console.log("📱 Messaggio ricevuto:", payload);
        setLastMessage(payload);

        // Mostra notifica se l'app è in primo piano
        if (
          Notification.permission === "granted" &&
          typeof payload === "object" &&
          payload !== null
        ) {
          const message = payload as {
            notification?: { title?: string; body?: string };
          };
          const baseUrl = window.location.origin;

          new Notification(message.notification?.title || "Nuova notifica", {
            body: message.notification?.body,
            icon: `${baseUrl}/assets/icons/icon-192.png`,
            badge: `${baseUrl}/assets/icons/icon-96.png`,
          });
        }
      })
      .catch((err) => console.log("❌ Errore listener messaggi:", err));
  }, []);

  const handleRequestPermission = async () => {
    try {
      const fcmToken = await requestNotificationPermission();
      if (fcmToken) {
        setToken(fcmToken);
        setPermission("granted");
        console.log("✅ Token FCM:", fcmToken);
      } else {
        console.log("❌ Permesso negato o token non ottenuto");
        setPermission("denied");
      }
    } catch (error) {
      console.error("❌ Errore richiesta permesso:", error);
    }
  };

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(token);
    alert("📋 Token copiato negli appunti!");
  };

  const sendTestNotification = async () => {
    console.log("🔍 Inizio test notifica...");

    // Verifica 1: Permessi
    console.log("1️⃣ Permesso notifiche:", Notification.permission);
    if (Notification.permission !== "granted") {
      alert(
        "❌ Devi prima autorizzare le notifiche! Clicca 'Richiedi Permesso Notifiche'"
      );
      return;
    }

    // Verifica 2: Service Worker
    if (!("serviceWorker" in navigator)) {
      alert("❌ Service Worker non supportato dal browser");
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      console.log("2️⃣ Service Worker pronto:", registration);

      // Usa URL assoluto per evitare problemi con Workbox
      const baseUrl = window.location.origin;

      console.log("3️⃣ Invio notifica...");
      await registration.showNotification("🧪 Test Notifica", {
        body: "Questa è una notifica di test dal componente React!",
        icon: `${baseUrl}/assets/icons/icon-192.png`,
        badge: `${baseUrl}/assets/icons/icon-96.png`,
        tag: "test-notification-" + Date.now(),
        requireInteraction: false,
        data: {
          dateOfArrival: Date.now(),
          primaryKey: "test-notification",
        },
      });

      console.log("✅ Notifica inviata con successo!");
      alert("✅ Notifica inviata! Dovresti vederla adesso.");
    } catch (error) {
      console.error("❌ Errore durante l'invio della notifica:", error);
      alert(`❌ Errore: ${error}`);
    }
  };

  if (!isSupported) {
    return (
      <div className="notification-tester notification-tester--error">
        <h3>❌ Notifiche Non Supportate</h3>
        <p>
          Il tuo browser non supporta le notifiche push o i Service Workers.
        </p>
      </div>
    );
  }

  return (
    <div className="notification-tester">
      <div className="notification-tester__header">
        <h2>🧪 Test Notifiche Push</h2>
        <div className={`permission-status permission-status--${permission}`}>
          Status:{" "}
          {permission === "granted"
            ? "✅ Autorizzato"
            : permission === "denied"
            ? "❌ Negato"
            : "⏳ In attesa"}
        </div>
      </div>

      <div className="notification-tester__actions">
        {permission !== "granted" && (
          <button
            onClick={handleRequestPermission}
            className="btn btn--primary"
            disabled={permission === "denied"}
          >
            🔔 Richiedi Permesso Notifiche
          </button>
        )}

        {permission === "granted" && (
          <>
            <button
              onClick={sendTestNotification}
              className="btn btn--secondary"
            >
              🧪 Invia Test Notifica
            </button>

            <button
              onClick={handleRequestPermission}
              className="btn btn--outline"
            >
              🔄 Aggiorna Token
            </button>
          </>
        )}
      </div>

      {token && (
        <div className="notification-tester__token">
          <h3>🔑 FCM Token</h3>
          <div className="token-display">
            <code className="token-text">{token}</code>
            <button onClick={copyTokenToClipboard} className="btn btn--small">
              📋 Copia
            </button>
          </div>
          <p className="token-info">
            💡 Usa questo token per inviare notifiche a questo dispositivo dal
            backend
          </p>
        </div>
      )}

      {lastMessage && (
        <div className="notification-tester__last-message">
          <h3>📱 Ultimo Messaggio Ricevuto</h3>
          <pre className="message-display">
            {JSON.stringify(lastMessage, null, 2)}
          </pre>
        </div>
      )}

      <div className="notification-tester__info">
        <h3>ℹ️ Informazioni</h3>
        <ul>
          <li>
            <strong>🌐 Browser:</strong> {navigator.userAgent.split(" ")[0]}
          </li>
          <li>
            <strong>📱 Service Worker:</strong>{" "}
            {"serviceWorker" in navigator
              ? "✅ Supportato"
              : "❌ Non supportato"}
          </li>
          <li>
            <strong>🔔 Notifiche:</strong>{" "}
            {"Notification" in window ? "✅ Supportato" : "❌ Non supportato"}
          </li>
          <li>
            <strong>🔐 Protocollo:</strong>{" "}
            {window.location.protocol === "https:" ? "✅ HTTPS" : "⚠️ HTTP"}
          </li>
        </ul>
      </div>
    </div>
  );
};
