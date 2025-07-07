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
  };
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

/**
 * Authentifie un utilisateur avec email et mot de passe
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
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
  try {
    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    return response.data;
  } catch (error) {
    throw new Error('Impossible de rafraîchir le token');
  }
}; 