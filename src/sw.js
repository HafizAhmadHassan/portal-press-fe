// Service Worker con Firebase Messaging integrato
// Usato da vite-plugin-pwa per gestire notifiche push e funzionalità PWA

/* global self */

// Import Firebase scripts for messaging
// Note: We use compat importScripts inside the SW context.
// importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase config must match the app's config
// const firebaseConfig = {
//   apiKey: "AIzaSyBW0WrwAEX3jHGr3qvnGyUJtFsmVJa2dmg",
//   authDomain: "testpress-f73d9.firebaseapp.com",
//   projectId: "testpress-f73d9",
//   storageBucket: "testpress-f73d9.firebasestorage.app",
//   messagingSenderId: "9991499805",
//   appId: "1:9991499805:web:68a68fa946c3e4648556f4",
// };

// Initialize Firebase
// firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();

// Precache manifest will be injected here by Vite PWA
// In development, this might be empty, in production it will contain the app assets
self.__WB_MANIFEST;

// Handle background messages from Firebase
// messaging.onBackgroundMessage((payload) => {
//   console.log('📱 Messaggio ricevuto in background:', payload);

//   const notificationTitle = payload.notification?.title || 'Port Press';
//   const notificationOptions = {
//     body: payload.notification?.body || 'Hai una nuova notifica',
//     icon: payload.notification?.icon || '/assets/icons/icon-192.png',
//     badge: '/assets/icons/icon-72.png',
//     tag: payload.data?.tag || 'default',
//     data: payload.data,
//     actions: [
//       {
//         action: 'open',
//         title: 'Apri App'
//       },
//       {
//         action: 'close',
//         title: 'Chiudi'
//       }
//     ]
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Click sulla notifica:', event.notification);
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Basic service worker lifecycle events
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installato');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker attivato');
  event.waitUntil(self.clients.claim());
});
