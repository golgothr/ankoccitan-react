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
  console.log('Tentative d\'inscription avec:', { email: userData.email, username: userData.username });
  
  // Vérifier la configuration Supabase
  console.log('URL Supabase:', import.meta.env.VITE_SUPABASE_URL);
  console.log('Clé Supabase présente:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  
  if (!supabase.auth) {
    throw new Error('Configuration Supabase manquante. Vérifiez vos variables d\'environnement.');
  }

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
    console.error('Erreur Supabase auth:', error);
    throw new Error(error.message);
  }

  if (!data.user) {
    console.error('Pas d\'utilisateur retourné par Supabase');
    throw new Error('Erreur lors de la création du compte');
  }

  console.log('Utilisateur créé avec succès:', data.user.id);

  // Retry pour récupérer le profil utilisateur (trigger Supabase peut être lent)
  let profile = null;
  let profileError = null;
  for (let i = 0; i < 5; i++) {
    console.log(`Tentative ${i + 1}/5 de récupération du profil...`);
    const { data: p, error: e } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    if (p) {
      profile = p;
      console.log('Profil récupéré:', profile);
      break;
    }
    profileError = e;
    console.log(`Erreur profil ${i + 1}:`, e);
    await new Promise((res) => setTimeout(res, 500));
  }
  
  if (!profile) {
    console.error('Impossible de récupérer le profil après 5 tentatives');
    throw new Error('Profil utilisateur non disponible après création. Veuillez réessayer.');
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