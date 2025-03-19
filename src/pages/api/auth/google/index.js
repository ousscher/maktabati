import { admin, db } from "@/lib/firebaseAdminConfig";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Token manquant" });
      }
      
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { uid, email } = decodedToken;
      
      const userDoc = await db.collection("users").doc(uid).get();
      
      if (!userDoc.exists) {
        await db.collection("users").doc(uid).set({
          email,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          authProvider: "google"
        });
      }
      
      return res.status(200).json({
        uid,
        email,
        token,
        isNewUser: !userDoc.exists
      });
      
    } catch (error) {
      console.error("Erreur d'authentification Google:", error);
      return res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}