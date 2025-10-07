// Firebase Messaging Service Worker
// This file must be served from the site root as /firebase-messaging-sw.js

// Import Firebase compat libraries for service worker context
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase config (same as your frontend config)
const firebaseConfig = {
  apiKey: "AIzaSyBW0WrwAEX3jHGr3qvnGyUJtFsmVJa2dmg",
  authDomain: "testpress-f73d9.firebaseapp.com",
  projectId: "testpress-f73d9",
  storageBucket: "testpress-f73d9.firebasestorage.app",
  messagingSenderId: "9991499805",
  appId: "1:9991499805:web:68a68fa946c3e4648556f4",
};

// Initialize Firebase in the Service Worker
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('📱 Messaggio ricevuto in background:', payload);

  const notificationTitle = payload.notification?.title || 'Port Press';
  const notificationOptions = {
    body: payload.notification?.body || 'Hai una nuova notifica',
    // Usa percorsi assoluti per evitare problemi con Workbox
    icon: payload.notification?.icon || self.location.origin + '/assets/icons/icon-192.png',
    badge: self.location.origin + '/assets/icons/icon-72.png',
    tag: payload.data?.tag || 'default',
    data: payload.data,
    actions: [
      {
        action: 'open',
        title: 'Apri App'
      },
      {
        action: 'close',
        title: 'Chiudi'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
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
