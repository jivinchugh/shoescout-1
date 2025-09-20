import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface UserPreferencesContextType {
  userPreferences: string[];
  setUserPreferences: (preferences: string[]) => void;
  fetchUserPreferences: () => Promise<void>;
  hasPreferences: boolean;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export const UserPreferencesProvider: React.FC<UserPreferencesProviderProps> = ({ children }) => {
  const [userPreferences, setUserPreferences] = useState<string[]>([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  const fetchUserPreferences = async () => {
    if (!isAuthenticated) {
      setUserPreferences([]);
      return;
    }

    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user-preferences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserPreferences(data.preferences || []);
      }
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      setUserPreferences([]);
    }
  };

  // Fetch preferences when authentication status changes
  useEffect(() => {
    fetchUserPreferences();
  }, [isAuthenticated]);

  const hasPreferences = userPreferences.length > 0;

  const value = {
    userPreferences,
    setUserPreferences,
    fetchUserPreferences,
    hasPreferences,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};