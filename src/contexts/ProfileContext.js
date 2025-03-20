// contexts/ProfileContext.js
import { createContext, useContext, useState, useEffect } from "react";
import useSWR from "swr";
import API from "@/utils/api-client";

const ProfileContext = createContext();

const fetcher = async (url) => {
  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    // Si erreur 401, on la capture spécifiquement pour éviter les re-fetch
    if (error.response && error.response.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    throw error;
  }
};

export function ProfileProvider({ children }) {
  const [shouldFetch, setShouldFetch] = useState(false);

  // Vérifier l'authentification au chargement initial
  useEffect(() => {
    const token = localStorage.getItem("token");
    setShouldFetch(!!token);
  }, []);

  const { data, error, isLoading, mutate } = useSWR(
    // Ne fetch que si shouldFetch est true
    shouldFetch ? "/profile" : null,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      // Arrêter les tentatives sur erreur 401
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        if (error.message === "UNAUTHORIZED") {
          setShouldFetch(false); // Désactiver les futures tentatives
          return;
        }

        // Pour les autres erreurs, limiter à 3 tentatives
        if (retryCount >= 3) return;

        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    }
  );

  const updateProfile = async (updatedData) => {
    try {
      const response = await API.put("/profile", updatedData);
      mutate(response.data, false);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      throw error;
    }
  };

  // Méthode pour déclencher manuellement le fetch du profil
  const refreshProfile = () => {
    setShouldFetch(true);
    return mutate(); // Force la revalidation
  };

  const value = {
    profile: data,
    isLoading,
    error,
    updateProfile,
    refreshProfile, // Exposer cette méthode pour l'utiliser après login
    isAuthenticated: !!data, // Un shorthand pour savoir si l'utilisateur est authentifié
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (context === undefined) {
    throw new Error(
      "useProfile doit être utilisé à l'intérieur d'un ProfileProvider"
    );
  }

  return context;
}
