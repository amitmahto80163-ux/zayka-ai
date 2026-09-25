importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCC6Ixo__q8X4QFMI-UA1I1CydD8C8QFxM",
  authDomain: "zayka-ai.firebaseapp.com",
  projectId: "zayka-ai",
  storageBucket: "zayka-ai.firebasestorage.app",
  messagingSenderId: "656092612044",
  appId: "1:656092612044:web:62dc7f2c34c1e4a37e4969"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
