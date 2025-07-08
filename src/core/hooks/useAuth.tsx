import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, User } from '@/core/lib/supabase';

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
    }
  };

  useEffect(() => {
    checkAuthStatus();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
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
        setAuthState({ isLoggedIn: false, user: null, token: null });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const login = (data: { user: User; token: string }) => {
    setAuthState({ isLoggedIn: true, user: data.user, token: data.token });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthState({ isLoggedIn: false, user: null, token: null });
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
