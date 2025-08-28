// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyD_huYlgRzWHgLk50KEpdZ39LWfmYOpwB4",
  authDomain: "training-3f6e4.firebaseapp.com",
  projectId: "training-3f6e4",
  storageBucket: "training-3f6e4.appspot.com",
  messagingSenderId: "112115028405",
  appId: "1:112115028405:web:8ddbfc1844cc8a71ccc9fc",
};

const app = initializeApp(firebaseConfig);

// 👇 chỉ tạo messaging nếu đang ở client và có service worker
export let messaging: Messaging | null = null;

// Helper function to check if service worker is supported and registered
const checkServiceWorkerSupport = async () => {
  if (typeof window === "undefined") {
    console.log("❌ Not in browser environment");
    return false;
  }

  if (!("serviceWorker" in navigator)) {
    console.log("❌ Service Worker not supported");
    return false;
  }

  if (!("Notification" in window)) {
    console.log("❌ Notifications not supported");
    return false;
  }

  console.log("✅ Service Worker and Notifications supported");
  return true;
};

// Check if Firebase messaging service worker is registered
const checkServiceWorkerRegistration = async () => {
  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const fcmRegistration = registrations.find(registration => 
      registration.scope.includes('firebase-cloud-messaging-push-scope')
    );
    
    if (fcmRegistration) {
      console.log("✅ Firebase messaging service worker is registered");
      return true;
    } else {
      console.log("⚠️ Firebase messaging service worker not found in registrations");
      return false;
    }
  } catch (error) {
    console.error("❌ Error checking service worker registration:", error);
    return false;
  }
};

// Initialize Firebase messaging
const initializeFirebaseMessaging = async () => {
  const isSupported = await checkServiceWorkerSupport();
  if (!isSupported) {
    console.log("❌ Firebase messaging not supported in this environment");
    return null;
  }

  // Check if service worker is registered
  await checkServiceWorkerRegistration();

  try {
    messaging = getMessaging(app);
    console.log("✅ Firebase messaging initialized successfully");
    return messaging;
  } catch (e) {
    console.error("❌ Firebase messaging init failed:", e);
    return null;
  }
};

// Initialize messaging on module load
if (typeof window !== "undefined") {
  initializeFirebaseMessaging();
}

// Manual service worker registration for Firebase messaging
const registerFirebaseServiceWorker = async () => {
  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/firebase-cloud-messaging-push-scope'
      });
      console.log("✅ Firebase service worker registered successfully:", registration);
      return registration;
    }
  } catch (error) {
    console.error("❌ Failed to register Firebase service worker:", error);
    return null;
  }
};

export const requestForToken = async () => {
  // Ensure messaging is initialized
  if (!messaging) {
    messaging = await initializeFirebaseMessaging();
    if (!messaging) {
      console.log("❌ Cannot get FCM token - messaging not available");
      return null;
    }
  }

  try {
    // 🔹 xin quyền thông báo trước
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.warn(`❌ Notification permission ${permission}. Cannot get FCM token.`);
      return null;
    }

    console.log("✅ Notification permission granted");

    // 🔹 chỉ khi granted mới gọi getToken
    let token;
    try {
      token = await getToken(messaging, {
        vapidKey:
          "BJDtkdivt0vi7kRIM10t1QJdP1U0lwag4yxgyitOkCF8zbAilx6HbdF9ng8MMGMcLo8dM8YpI3eXRDZ0SYlNAAw",
      });
    } catch (error) {
      console.log("⚠️ First attempt to get token failed, trying manual service worker registration...");
      // Try manual service worker registration
      await registerFirebaseServiceWorker();
      // Wait a bit for registration to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Try again
      token = await getToken(messaging, {
        vapidKey:
          "BJDtkdivt0vi7kRIM10t1QJdP1U0lwag4yxgyitOkCF8zbAilx6HbdF9ng8MMGMcLo8dM8YpI3eXRDZ0SYlNAAw",
      });
    }

    if (token) {
      console.log("✅ FCM Token:", token);
      return token;
    } else {
      console.log("⚠️ No registration token available. Request permission again.");
      return null;
    }
  } catch (err) {
    console.error("❌ An error occurred while retrieving token.", err);
    return null;
  }
};

// Listen foreground messages (client only)
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) {
      console.log("❌ Messaging not available for foreground listener");
      return resolve(null);
    }
    
    onMessage(messaging, (payload) => {
      console.log("✅ Foreground message received:", payload);
      resolve(payload);
    });
  });
