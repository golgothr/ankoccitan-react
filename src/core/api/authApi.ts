import { supabase, User, AuthResponse } from '@/core/lib/supabase';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface AuthApiResponse {
  user: User;
  token: string;
}

/**
 * Authentifie un utilisateur avec email et mot de passe
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthApiResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Aucun utilisateur trouvé');
  }

  // Récupérer les données du profil utilisateur
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    throw new Error('Erreur lors de la récupération du profil');
  }

  return {
    user: profile,
    token: data.session?.access_token || '',
  };
};

/**
 * Enregistre un nouvel utilisateur
 */
export const registerUser = async (userData: RegisterData): Promise<AuthApiResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        name: userData.name,
        username: userData.username,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Erreur lors de la création du compte');
  }

  // Récupérer les données du profil utilisateur
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    throw new Error('Erreur lors de la récupération du profil');
  }

  return {
    user: profile,
    token: data.session?.access_token || '',
  };
};

/**
 * Déconnecte l'utilisateur
 */
export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Rafraîchit le token d'authentification
 */
export const refreshToken = async (): Promise<AuthApiResponse> => {
  const { data, error } = await supabase.auth.refreshSession();
  
  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error('Session invalide');
  }

  // Récupérer les données du profil utilisateur
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('*')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    throw new Error('Erreur lors de la récupération du profil');
  }

  return {
    user: profile,
    token: data.session?.access_token || '',
  };
}; 