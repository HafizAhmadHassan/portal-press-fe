import admin from "firebase-admin";
import fs from "fs";
import path from "path";

// Utility for sending FCM messages from server using firebase-admin
// Usage: create a service account JSON from Firebase Console (Project Settings -> Service accounts)
// and place it in the project root as `serviceAccountKey.json` (or set SERVICE_ACCOUNT_PATH env var).

const serviceAccountPath =
  process.env.SERVICE_ACCOUNT_PATH ||
  path.resolve(process.cwd(), "serviceAccountKey.json");

async function initAdmin() {
  if (admin.apps.length) return;
  if (fs.existsSync(serviceAccountPath)) {
    // dynamic import to satisfy ESM/TypeScript rules
    const serviceAccount =
      (await import(serviceAccountPath))?.default ||
      (await import(serviceAccountPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  } else {
    console.warn(
      "No service account key found at",
      serviceAccountPath,
      "→ send functions will fail unless you provide a service account."
    );
  }
}

export async function sendNotificationToDevice(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string | number | boolean>
) {
  await initAdmin();
  if (!admin.apps.length) {
    throw new Error(
      "firebase-admin not initialized. Provide a service account JSON at project root or set SERVICE_ACCOUNT_PATH env var."
    );
  }

  const message: admin.messaging.Message = {
    token,
    notification: {
      title,
      body,
    },
    data: data
      ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)]))
      : undefined,
  };

  try {
    const response = await admin.messaging().send(message);
    return { success: true, response };
  } catch (err) {
    return { success: false, error: err };
  }
}

export default sendNotificationToDevice;
