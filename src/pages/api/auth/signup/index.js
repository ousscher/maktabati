import { auth, createUserWithEmailAndPassword } from "@/lib/firebaseConfig";


export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Veuillez remplir tous les champs" });
      }
      
      // Créer un nouvel utilisateur avec Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Générer un token pour l'utilisateur nouvellement créé
      const token = await user.getIdToken();
      
      // Renvoyer les informations de l'utilisateur et le token
      return res.status(201).json({ 
        uid: user.uid, 
        email: user.email, 
        token 
      });
    } catch (error) {
      // Gérer les erreurs spécifiques à Firebase
      if (error.code === 'auth/email-already-in-use') {
        return res.status(400).json({ error: "Cette adresse e-mail est déjà utilisée" });
      } else if (error.code === 'auth/weak-password') {
        return res.status(400).json({ error: "Le mot de passe est trop faible" });
      } else if (error.code === 'auth/invalid-email') {
        return res.status(400).json({ error: "Adresse e-mail invalide" });
      }
      
      // Pour toute autre erreur
      return res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}