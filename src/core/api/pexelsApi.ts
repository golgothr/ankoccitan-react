import { settingsApi } from './settingsApi';
import { logger } from '@/core/utils/logger';

export interface PexelsImage {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsImage[];
  next_page?: string;
}

export interface PexelsSearchParams {
  query: string;
  page?: number;
  per_page?: number;
  orientation?: 'landscape' | 'portrait' | 'square';
  size?: 'large' | 'medium' | 'small';
  color?: string;
  locale?: string;
}

export const pexelsApi = {
  // Rechercher des images sur Pexels
  async searchImages(
    params: PexelsSearchParams
  ): Promise<PexelsSearchResponse> {
    try {
      // Récupérer la clé API de l'utilisateur
      const apiKey = await settingsApi.getApiKey('pexels');
      if (!apiKey || !apiKey.is_active) {
        throw new Error('Clé API Pexels non configurée ou inactive');
      }

      // Construire l'URL de recherche
      const searchParams = new URLSearchParams({
        query: params.query,
        page: (params.page || 1).toString(),
        per_page: (params.per_page || 15).toString(),
      });

      if (params.orientation) {
        searchParams.append('orientation', params.orientation);
      }
      if (params.size) {
        searchParams.append('size', params.size);
      }
      if (params.color) {
        searchParams.append('color', params.color);
      }
      if (params.locale) {
        searchParams.append('locale', params.locale);
      }

      const response = await fetch(
        `https://api.pexels.com/v1/search?${searchParams.toString()}`,
        {
          headers: {
            Authorization: apiKey.api_key,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Clé API Pexels invalide');
        } else if (response.status === 429) {
          throw new Error('Limite de requêtes Pexels dépassée');
        } else {
          throw new Error(`Erreur Pexels: ${response.status}`);
        }
      }

      const data: PexelsSearchResponse = await response.json();
      return data;
    } catch (error) {
      logger.error('Erreur lors de la recherche Pexels:', error);
      throw error;
    }
  },

  // Obtenir une image aléatoire (curated)
  async getCuratedImages(
    page: number = 1,
    per_page: number = 15
  ): Promise<PexelsSearchResponse> {
    try {
      const apiKey = await settingsApi.getApiKey('pexels');
      if (!apiKey || !apiKey.is_active) {
        throw new Error('Clé API Pexels non configurée ou inactive');
      }

      const response = await fetch(
        `https://api.pexels.com/v1/curated?page=${page}&per_page=${per_page}`,
        {
          headers: {
            Authorization: apiKey.api_key,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Clé API Pexels invalide');
        } else if (response.status === 429) {
          throw new Error('Limite de requêtes Pexels dépassée');
        } else {
          throw new Error(`Erreur Pexels: ${response.status}`);
        }
      }

      const data: PexelsSearchResponse = await response.json();
      return data;
    } catch (error) {
      logger.error('Erreur lors de la récupération des images curated:', error);
      throw error;
    }
  },

  // Vérifier si la clé API Pexels est configurée et valide
  async isPexelsConfigured(): Promise<boolean> {
    try {
      const apiKey = await settingsApi.getApiKey('pexels');
      return !!(apiKey && apiKey.is_active);
    } catch (error) {
      logger.error(
        'Erreur lors de la vérification de la configuration Pexels:',
        error
      );
      return false;
    }
  },

  // Tester la clé API Pexels
  async testApiKey(): Promise<boolean> {
    try {
      const apiKey = await settingsApi.getApiKey('pexels');
      if (!apiKey || !apiKey.is_active) {
        return false;
      }

      // Faire une requête de test simple
      const response = await fetch(
        'https://api.pexels.com/v1/curated?page=1&per_page=1',
        {
          headers: {
            Authorization: apiKey.api_key,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.ok;
    } catch (error) {
      logger.error('Erreur lors du test de la clé API Pexels:', error);
      return false;
    }
  },
};
