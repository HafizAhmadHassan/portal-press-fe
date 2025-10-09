import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBW0WrwAEX3jHGr3qvnGyUJtFsmVJa2dmg",
  authDomain: "testpress-f73d9.firebaseapp.com",
  projectId: "testpress-f73d9",
  storageBucket: "testpress-f73d9.firebasestorage.app",
  messagingSenderId: "9991499805",
  appId: "1:9991499805:web:68a68fa946c3e4648556f4",
};

const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Registra il service worker Firebase separatamente
      let registration: ServiceWorkerRegistration | undefined;

      if ("serviceWorker" in navigator) {
        try {
          // Registra il service worker Firebase da /public
          registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            { scope: "/" }
          );
          console.log("✅ Service Worker FCM registrato:", registration);

          // Aspetta che sia attivo
          if (registration.installing) {
            await new Promise((resolve) => {
              registration!.installing!.addEventListener("statechange", (e) => {
                if ((e.target as ServiceWorker).state === "activated") {
                  resolve(true);
                }
              });
            });
          }
        } catch (swError) {
          console.error("❌ Errore registrazione SW FCM:", swError);
        }
      }

      // const token = await getToken(messaging, {
      //   vapidKey:
      //     "BMBPYrjI6YS0t4rtvCVhph_u4h3KE_f2YRChRYHQ-73-pmni6JZK4YgLfKRy_F4I04CyfBvzRhgrxwncmFqeDcs",
      //   serviceWorkerRegistration: registration,
      // });
      // console.log("🔑 Token FCM:", token);
      return null;
    } else {
      console.warn("⚠️ Notifiche non autorizzate");
      return null;
    }
  } catch (error) {
    console.error("❌ Errore nel richiedere il token:", error);
    return null;
  }
};

// Utility: register the firebase messaging service worker explicitly (optional)
export const registerFcmServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );
        console.log("Service Worker FCM registrato:", registration);
        return registration;
      } catch (err) {
        console.error("Errore registrazione SW FCM:", err);
        return null;
      }
    }
    return null;
  };

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
