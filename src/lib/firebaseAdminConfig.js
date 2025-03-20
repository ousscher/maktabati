import admin from "firebase-admin";

const base64EncodedServiceAccount = process.env.BASE64_ENCODED_SERVICE_ACCOUNT;
if (!base64EncodedServiceAccount) {
  throw new Error("Missing BASE64_ENCODED_SERVICE_ACCOUNT environment variable");
}

const decodedServiceAccount = Buffer.from(base64EncodedServiceAccount, 'base64').toString('utf-8');
const serviceAccount = JSON.parse(decodedServiceAccount);


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

export { admin, db };