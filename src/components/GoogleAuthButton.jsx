// src/components/GoogleAuthButton.js
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { loginWithGoogle } from '@/services/authService';

const GoogleAuthButton = ({ t }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const userData = await loginWithGoogle();
      console.log("Utilisateur connecté:", userData);
      
      // Rediriger vers la page d'accueil après connexion réussie
      router.push("/home");
    } catch (error) {
      console.error("Erreur lors de l'authentification Google:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="relative w-full flex items-center justify-center border py-3 rounded-3xl text-gray-700 hover:bg-gray-100 transition"
    >
      <Image 
        src="/images/icons/google.svg" 
        alt="Google Logo" 
        className="absolute left-5" 
        width={24} 
        height={24} 
      />
      {isLoading ? t("Loading") : t("Google")}
    </button>
  );
};

export default GoogleAuthButton;