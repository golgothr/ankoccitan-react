import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '../config/env';

// ------- Rate Limiter Configuration -------
const RATE_LIMIT = 5;
const RATE_INTERVAL = 1000; // 5 requêtes par seconde
let tokens = RATE_LIMIT;
const queue: Array<() => void> = [];

setInterval(() => {
  tokens = RATE_LIMIT;
  while (tokens > 0 && queue.length > 0) {
    tokens--;
    const next = queue.shift();
    if (next) next();
  }
}, RATE_INTERVAL);

function acquireToken(): Promise<void> {
  if (tokens > 0) {
    tokens--;
    return Promise.resolve();
  }
  return new Promise((resolve) => queue.push(resolve));
}

// Configuration de l'API client
export const API_BASE_URL = env.API_URL;

// Création de l'instance Axios
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    // En-têtes de sécurité pour toutes les requêtes
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
  },
});

// Intercepteur pour ajouter le token d'authentification et limiter le taux de requêtes
apiClient.interceptors.request.use(
  async (config) => {
    await acquireToken();
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers['X-Frame-Options'] = 'DENY';
    config.headers['X-Content-Type-Options'] = 'nosniff';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tenter de rafraîchir le token
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('auth_token', token);

          // Retenter la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch {
        // Si le refresh échoue, déconnecter l'utilisateur
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/auth';
      }
    }

    return Promise.reject(error);
  }
);

// Types utilitaires
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Fonctions utilitaires pour les requêtes
export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  apiClient.get<T>(url, config);

export const apiPost = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => apiClient.post<T>(url, data, config);

export const apiPut = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => apiClient.put<T>(url, data, config);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  apiClient.delete<T>(url, config);

export const apiPatch = <T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
) => apiClient.patch<T>(url, data, config);
