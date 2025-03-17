import { auth, sendPasswordResetEmail } from "@/lib/firebaseConfig";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Veuillez fournir une adresse e-mail" });
    }

    // Send the password reset email
    await sendPasswordResetEmail(auth, email, {
      url: `http://localhost:3000/login`,
      handleCodeInApp: true,
    });

    return res.status(200).json({ message: "Email de réinitialisation envoyé" });

  } catch (error) {
    console.error("Erreur d'envoi :", error.message);
    
    if (error.code === "auth/user-not-found") {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    } else if (error.code === "auth/invalid-email") {
      return res.status(400).json({ error: "Adresse e-mail invalide" });
    } else {
      return res.status(500).json({ error: "Erreur lors de l'envoi de l'e-mail" });
    }
  }
}
