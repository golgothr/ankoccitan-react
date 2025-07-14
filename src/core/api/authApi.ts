import { supabase } from '../lib/supabase';
import { env } from '../config/env';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthApiResponse {
  user: any; // Changed from User to any as User type is removed
  token: string;
}

export const authApi = {
  // Connexion utilisateur
  async loginUser(credentials: LoginCredentials): Promise<AuthApiResponse> {
    try {
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

      return {
        user: data.user,
        token: data.session?.access_token || '',
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  },

  // Inscription utilisateur
  async registerUser(
    credentials: RegisterCredentials
  ): Promise<AuthApiResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Erreur lors de la création du compte');
      }

      return {
        user: data.user,
        token: data.session?.access_token || '',
      };
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      throw error;
    }
  },

  // Déconnexion utilisateur
  async logoutUser(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  },

  // Vérifier l'état de l'authentification
  async checkAuthStatus(): Promise<any> {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error
        );
        return null;
      }

      return user;
    } catch (error) {
      console.error(
        "Erreur lors de la vérification de l'authentification:",
        error
      );
      return null;
    }
  },

  // Vérifier la configuration Supabase
  async checkSupabaseConfig(): Promise<boolean> {
    try {
      console.log('URL Supabase:', env.SUPABASE_URL);
      console.log('Clé anonyme configurée:', !!env.SUPABASE_ANON_KEY);

      // Test de connexion simple
      const { error } = await supabase.from('users').select('count').limit(1);

      if (error) {
        console.error('Erreur de connexion Supabase:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error(
        'Erreur lors de la vérification de la configuration:',
        error
      );
      return false;
    }
  },
};

/**
 * Méthode pour vérifier la configuration Supabase
 */
export const checkSupabaseConfig = async (): Promise<boolean> => {
  try {
    console.log('URL Supabase:', env.SUPABASE_URL);
    console.log('Clé anonyme configurée:', !!env.SUPABASE_ANON_KEY);

    // Test de connexion simple
    const { error } = await supabase.from('users').select('count').limit(1);

    if (error) {
      console.error('Erreur de connexion Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la vérification de la configuration:', error);
    return false;
  }
};
