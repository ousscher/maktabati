// // src/pages/api/auth/signup.js
// import { auth, createUserWithEmailAndPassword } from "@/lib/firebaseConfig";

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const { email, password } = req.body;

//       if (!email || !password) {
//         return res.status(400).json({ error: "Email et mot de passe requis" });
//       }

//       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//       const user = userCredential.user;
//       const token = await user.getIdToken();

//       return res.status(201).json({ 
//         uid: user.uid, 
//         email: user.email, 
//         token: token 
//       });

//     } catch (error) {
//       let errorMessage = "Erreur lors de l'inscription";
//       if (error.code === "auth/email-already-in-use") {
//         errorMessage = "Cet email est déjà utilisé";
//       } else if (error.code === "auth/weak-password") {
//         errorMessage = "Le mot de passe doit faire au moins 6 caractères";
//       }
//       return res.status(400).json({ error: errorMessage });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }