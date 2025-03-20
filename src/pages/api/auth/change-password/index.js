import {admin , db} from "@/lib/firebaseAdminConfig";
import { verifyToken, runMiddleware } from "@/lib/authMiddleware";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Vérification du token
      await runMiddleware(req, res, verifyToken);
      const userId = req.user.uid;
      if (!userId) return;

      const { newPassword } = req.body;
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: "Le mot de passe doit contenir au moins 6 caractères." });
      }

      const user = await admin.auth().getUser(userId);
      await admin.auth().updateUser(user.uid, {
        password: newPassword,
      });

      return res.status(200).json({ message: "Mot de passe mis à jour avec succès !" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
