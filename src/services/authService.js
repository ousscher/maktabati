// src/services/authService.js
import axios from "axios";
import API from "@/utils/api-client";
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "@/lib/firebaseConfig";

const setToken = (token) => {
  localStorage.setItem("token", token);
};

const getToken = () => {
  return localStorage.getItem("token");
};

const removeToken = () => {
  localStorage.removeItem("token");
};

const loginWithEmail = async (email, password) => {
  try {
    const response = await axios.post("/api/auth/login", {
      email,
      password,
    });

    const { token } = response.data;
    if (token) {
      setToken(token);
      return response.data;
    }
    throw new Error("Authentification échouée");
  } catch (error) {
    throw error;
  }
};

const signupWithEmail = async (email, password) => {
  try {
    const response = await axios.post("/api/auth/signup", {
      email,
      password,
    });

    const { token } = response.data;
    if (token) {
      setToken(token);
      return response.data;
    }
    throw new Error("Inscription échouée");
  } catch (error) {
    throw error;
  }
};

const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const token = await result.user.getIdToken();

    const response = await axios.post("/api/auth/google", { token });

    if (response.data.token) {
      setToken(response.data.token);
      return response.data;
    }
    throw new Error("Authentification Google échouée");
  } catch (error) {
    console.error("Erreur Google Auth:", error);
    throw error;
  }
};

const changePassword = async (newPassword) => {
  try {
    const token = getToken();
    if (!token) throw new Error("Unauthorized");
    const response = await API.post("/auth/change-password", { newPassword });
    return response.data;
  } catch (error) {
    console.error("Error :", error);
    throw error;
  }
};

const logout = async () => {
  try {
    await signOut(auth);
    removeToken();
    return true;
  } catch (error) {
    console.error("Erreur de déconnexion:", error);
    throw error;
  }
};

const isAuthenticated = () => {
  return !!getToken();
};

export {
  loginWithEmail,
  signupWithEmail,
  loginWithGoogle,
  logout,
  isAuthenticated,
  getToken,
  changePassword
};
