// src/pages/api/login/index.js
import { auth, signInWithEmailAndPassword } from "@/lib/firebaseConfig";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Veuillez remplir tous les champs" });
      }
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      return res.status(200).json({ uid: user.uid, email: user.email, token });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}