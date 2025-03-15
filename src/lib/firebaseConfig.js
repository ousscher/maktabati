import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAwyC2Mb5fI4O4kb7R1BpB6GsVj8sPGePo",
    authDomain: "maktabati-e65bd.firebaseapp.com",
    projectId: "maktabati-e65bd",
    storageBucket: "maktabati-e65bd.firebasestorage.app",
    messagingSenderId: "737197937381",
    appId: "1:737197937381:web:14d4517767136839e1fa0c"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword };
