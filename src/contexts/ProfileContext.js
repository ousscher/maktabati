// contexts/ProfileContext.js
import { createContext, useContext } from 'react';
import useSWR from 'swr';
import API from '@/utils/api-client';

const ProfileContext = createContext();

const fetcher = async (url) => {
  try {
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de la récupération des données de profil');
  }
};

export function ProfileProvider({ children }) {
  const { data, error, isLoading, mutate } = useSWR('/profile', fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const updateProfile = async (updatedData) => {
    try {
      const response = await API.put('/profile', updatedData);
      mutate(response.data, false);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw error;
    }
  };

  const value = {
    profile: data,
    isLoading,
    error,
    updateProfile,
    mutate,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  
  if (context === undefined) {
    throw new Error('useProfile doit être utilisé à l\'intérieur d\'un ProfileProvider');
  }
  
  return context;
}