import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    // Vérifier l'état d'authentification au chargement
    checkAuthStatus();

    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setAuthState({
          isLoggedIn: true,
          user,
          token,
        });
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        logout();
      }
    } else {
      setAuthState({
        isLoggedIn: false,
        user: null,
        token: null,
      });
    }
  };

  const login = (userData: { user: User; token: string }) => {
    localStorage.setItem('auth_token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setAuthState({
      isLoggedIn: true,
      user: userData.user,
      token: userData.token,
    });
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAuthState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    }
  };

  return {
    ...authState,
    login,
    logout,
    updateUser,
    checkAuthStatus,
  };
} 