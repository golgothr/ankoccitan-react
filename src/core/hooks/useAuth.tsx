import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, User } from '@/core/lib/supabase';
import { clearAuthState } from '@/core/utils/authUtils';

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

interface AuthContextProps extends AuthState {
  login: (data: { user: User; token: string }) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    token: null,
  });

  const checkAuthStatus = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setAuthState({
          isLoggedIn: true,
          user: profile,
          token: session.access_token,
        });
      } else {
        // S'assurer que l'état est bien réinitialisé si pas de session
        setAuthState({
          isLoggedIn: false,
          user: null,
          token: null,
        });
      }
    } catch (error) {
      console.error(
        "Erreur lors de la vérification du statut d'authentification:",
        error
      );
      // En cas d'erreur, réinitialiser l'état
      setAuthState({
        isLoggedIn: false,
        user: null,
        token: null,
      });
    }
  };

  useEffect(() => {
    checkAuthStatus();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(
        "[useAuth] Événement d'authentification:",
        event,
        session?.user?.id
      );

      if (event === 'SIGNED_IN' && session?.user) {
        try {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setAuthState({
            isLoggedIn: true,
            user: profile,
            token: session.access_token,
          });
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          setAuthState({ isLoggedIn: false, user: null, token: null });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('[useAuth] Utilisateur déconnecté');
        setAuthState({ isLoggedIn: false, user: null, token: null });
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('[useAuth] Token rafraîchi');
        if (session?.user) {
          setAuthState((prev) => ({
            ...prev,
            token: session.access_token,
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (data: { user: User; token: string }) => {
    setAuthState({ isLoggedIn: true, user: data.user, token: data.token });
  };

  const logout = async () => {
    try {
      console.log('[useAuth] Déconnexion en cours...');

      // Déconnecter de Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Erreur lors de la déconnexion Supabase:', error);
      }

      // Réinitialiser l'état local immédiatement
      setAuthState({ isLoggedIn: false, user: null, token: null });

      // Nettoyer complètement l'état d'authentification
      clearAuthState();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, nettoyer complètement
      setAuthState({ isLoggedIn: false, user: null, token: null });
      clearAuthState();
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (authState.user) {
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', authState.user.id)
        .select()
        .single();

      if (!error && data) {
        setAuthState((prev) => ({ ...prev, user: data }));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{ ...authState, login, logout, updateUser, checkAuthStatus }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
