import { useState, useEffect } from 'react';
import { supabase, User } from '@/core/lib/supabase';

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

    // Écouter les changements d'authentification Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Récupérer le profil utilisateur
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
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            isLoggedIn: false,
            user: null,
            token: null,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthStatus = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      // Récupérer le profil utilisateur
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
    }
  };

  const login = (userData: { user: User; token: string }) => {
    setAuthState({
      isLoggedIn: true,
      user: userData.user,
      token: userData.token,
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthState({
      isLoggedIn: false,
      user: null,
      token: null,
    });
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
        setAuthState(prev => ({
          ...prev,
          user: data,
        }));
      }
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