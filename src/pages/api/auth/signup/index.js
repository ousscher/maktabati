import { auth, createUserWithEmailAndPassword } from "@/lib/firebaseConfig";
import { admin, db } from "@/lib/firebaseAdminConfig";


export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Veuillez remplir tous les champs" });
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      try {
        const token = await user.getIdToken();
        
        // Définir explicitement la collection et le document
        await db.collection("users").doc(user.uid).set({
          email,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        return res.status(201).json({ 
          uid: user.uid, 
          email: user.email, 
          token 
        });
      } catch (firestoreError) {
        console.error("Erreur Firestore:", firestoreError);
        // Retourner l'utilisateur même en cas d'échec Firestore
        return res.status(206).json({ 
          uid: user.uid, 
          email: user.email,
          warning: "Utilisateur créé mais données non sauvegardées" 
        });
      }
      

    } catch (error) {
      // Gérer les erreurs spécifiques à Firebase
      if (error.code === 'auth/email-already-in-use') {
        return res.status(400).json({ error: "Cette adresse e-mail est déjà utilisée" });
      } else if (error.code === 'auth/weak-password') {
        return res.status(401).json({ error: "Le mot de passe est trop faible" });
      } else if (error.code === 'auth/invalid-email') {
        return res.status(402).json({ error: "Adresse e-mail invalide" });
      }
      
      // Pour toute autre erreur
      return res.status(403).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}