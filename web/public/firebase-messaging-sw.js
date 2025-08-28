// Import and configure Firebase in the service worker
try {
  importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
  importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");
  
  console.log("[firebase-messaging-sw.js] Firebase scripts loaded successfully");
} catch (error) {
  console.error("[firebase-messaging-sw.js] Failed to load Firebase scripts:", error);
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD_huYlgRzWHgLk50KEpdZ39LWfmYOpwB4",
  authDomain: "training-3f6e4.firebaseapp.com",
  projectId: "training-3f6e4",
  storageBucket: "training-3f6e4.appspot.com",
  messagingSenderId: "112115028405",
  appId: "1:112115028405:web:8ddbfc1844cc8a71ccc9fc",
  vapidKey: "BJDtkdivt0vi7kRIM10t1QJdP1U0lwag4yxgyitOkCF8zbAilx6HbdF9ng8MMGMcLo8dM8YpI3eXRDZ0SYlNAAw",
};

let messaging;
try {
  firebase.initializeApp(firebaseConfig);
  messaging = firebase.messaging();
  console.log("[firebase-messaging-sw.js] Firebase initialized successfully");
} catch (error) {
  console.error("[firebase-messaging-sw.js] Failed to initialize Firebase:", error);
}

// Handle background messages
if (messaging) {
  messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/next.svg",
    badge: "/next.svg",
    image: payload.notification?.image,
    tag: payload.data?.type || "default",
    data: payload.data || {},
    actions: [{ action: "view", title: "View" }],
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked:", event.notification);
  event.notification.close();
  const urlToOpen = event.notification.data.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Service worker installation
self.addEventListener('install', (event) => {
  console.log("[firebase-messaging-sw.js] Service Worker installed");
});

// Service worker activation
self.addEventListener('activate', (event) => {
  console.log("[firebase-messaging-sw.js] Service Worker activated");
});
