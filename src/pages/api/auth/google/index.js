// // src/pages/api/auth/google.js
// import { auth, GoogleAuthProvider, signInWithPopup } from "@/lib/firebaseConfig";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const { idToken } = req.body;
//       if (idToken) {
//         const credential = GoogleAuthProvider.credential(idToken);
        
//         const result = await signInWithCredential(auth, credential);
//         const user = result.user;
//         const token = await user.getIdToken();
        
//         return res.status(200).json({
//           uid: user.uid,
//           email: user.email,
//           token,
//           isNewUser: result._tokenResponse.isNewUser
//         });
//       } else {
//         return res.status(400).json({ error: "Aucun token fourni" });
//       }
//     } catch (error) {
//       console.error("Erreur d'authentification Google:", error);
//       return res.status(400).json({ error: error.message });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }

// src/pages/api/auth/google.js
import { admin, db } from "@/lib/firebaseAdminConfig";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Token manquant" });
      }
      
      // Vérifier le token d'authentification
      const decodedToken = await admin.auth().verifyIdToken(token);
      const { uid, email } = decodedToken;
      
      // Vérifier si l'utilisateur existe déjà dans Firestore
      const userDoc = await db.collection("users").doc(uid).get();
      
      if (!userDoc.exists) {
        // Créer un nouveau document utilisateur si c'est un nouvel utilisateur
        await db.collection("users").doc(uid).set({
          email,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          authProvider: "google"
        });
      }
      
      // Retourner les informations de l'utilisateur et le token
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