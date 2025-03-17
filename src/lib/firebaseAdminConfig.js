import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), 
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        token_uri: "https://oauth2.googleapis.com/token",
      }),
  });
}

const db = admin.firestore();

export { admin, db };
