import { apiClient } from './apiClient';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    username?: string;
  };
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Simulation d'API pour le développement local
const isDevelopment = import.meta.env.DEV;

/**
 * Authentifie un utilisateur avec email et mot de passe
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  if (isDevelopment) {
    // Simulation d'une réponse réussie en développement
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simuler un délai réseau
    
    return {
      user: {
        id: '1',
        email: credentials.email,
        name: credentials.email.split('@')[0], // Utiliser la partie avant @ comme nom
        username: credentials.email.split('@')[0],
      },
      token: `mock-jwt-token-${Date.now()}`,
    };
  }

  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error('Identifiants invalides');
  }
};

/**
 * Enregistre un nouvel utilisateur
 */
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  if (isDevelopment) {
    // Simulation d'une réponse réussie en développement
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler un délai réseau
    
    return {
      user: {
        id: `user-${Date.now()}`,
        email: userData.email,
        name: userData.name,
        username: userData.name.toLowerCase().replace(/\s+/g, ''),
      },
      token: `mock-jwt-token-${Date.now()}`,
    };
  }

  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error('Erreur lors de l\'inscription');
  }
};

/**
 * Déconnecte l'utilisateur
 */
export const logoutUser = async (): Promise<void> => {
  if (isDevelopment) {
    // En développement, on simule juste un délai
    await new Promise(resolve => setTimeout(resolve, 500));
    return;
  }

  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Ignorer les erreurs de déconnexion
    console.warn('Erreur lors de la déconnexion:', error);
  }
};

/**
 * Rafraîchit le token d'authentification
 */
export const refreshToken = async (): Promise<AuthResponse> => {
  if (isDevelopment) {
    // Simulation d'un refresh réussi en développement
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      user: {
        id: '1',
        email: 'user@example.com',
        name: 'Utilisateur Test',
        username: 'utilisateur',
      },
      token: `mock-jwt-token-refresh-${Date.now()}`,
    };
  }

  try {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    return response.data;
  } catch (error) {
    throw new Error('Impossible de rafraîchir le token');
  }
}; 