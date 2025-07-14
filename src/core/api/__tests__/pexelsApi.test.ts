import { describe, it, expect, vi, beforeEach } from 'vitest';
import { pexelsApi } from '../pexelsApi';
import { settingsApi } from '../settingsApi';

// Mock du service settingsApi
vi.mock('../settingsApi', () => ({
  settingsApi: {
    getApiKey: vi.fn(),
  },
}));

// Mock de fetch global
global.fetch = vi.fn();

describe('pexelsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('isPexelsConfigured', () => {
    it('should return true when API key is configured and active', async () => {
      const mockApiKey = {
        id: '1',
        user_id: 'user1',
        service_name: 'pexels' as const,
        api_key: 'test-key',
        is_active: true,
        usage_count: 0,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      vi.mocked(settingsApi.getApiKey).mockResolvedValue(mockApiKey);

      const result = await pexelsApi.isPexelsConfigured();
      expect(result).toBe(true);
      expect(settingsApi.getApiKey).toHaveBeenCalledWith('pexels');
    });

    it('should return false when API key is not configured', async () => {
      vi.mocked(settingsApi.getApiKey).mockResolvedValue(null);

      const result = await pexelsApi.isPexelsConfigured();
      expect(result).toBe(false);
    });

    it('should return false when API key is inactive', async () => {
      const mockApiKey = {
        id: '1',
        user_id: 'user1',
        service_name: 'pexels' as const,
        api_key: 'test-key',
        is_active: false,
        usage_count: 0,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      vi.mocked(settingsApi.getApiKey).mockResolvedValue(mockApiKey);

      const result = await pexelsApi.isPexelsConfigured();
      expect(result).toBe(false);
    });
  });

  describe('testApiKey', () => {
    it('should return true when API key is valid', async () => {
      const mockApiKey = {
        id: '1',
        user_id: 'user1',
        service_name: 'pexels' as const,
        api_key: 'test-key',
        is_active: true,
        usage_count: 0,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      vi.mocked(settingsApi.getApiKey).mockResolvedValue(mockApiKey);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => ({ photos: [] }),
      } as Response);

      const result = await pexelsApi.testApiKey();
      expect(result).toBe(true);
    });

    it('should return false when API key is not configured', async () => {
      vi.mocked(settingsApi.getApiKey).mockResolvedValue(null);

      const result = await pexelsApi.testApiKey();
      expect(result).toBe(false);
    });

    it('should return false when API request fails', async () => {
      const mockApiKey = {
        id: '1',
        user_id: 'user1',
        service_name: 'pexels' as const,
        api_key: 'test-key',
        is_active: true,
        usage_count: 0,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      vi.mocked(settingsApi.getApiKey).mockResolvedValue(mockApiKey);
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401,
      } as Response);

      const result = await pexelsApi.testApiKey();
      expect(result).toBe(false);
    });
  });

  describe('searchImages', () => {
    it('should throw error when API key is not configured', async () => {
      vi.mocked(settingsApi.getApiKey).mockResolvedValue(null);

      await expect(pexelsApi.searchImages({ query: 'test' })).rejects.toThrow(
        'Clé API Pexels non configurée ou inactive'
      );
    });

    it('should make correct API request when configured', async () => {
      const mockApiKey = {
        id: '1',
        user_id: 'user1',
        service_name: 'pexels' as const,
        api_key: 'test-key',
        is_active: true,
        usage_count: 0,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      const mockResponse = {
        total_results: 1,
        page: 1,
        per_page: 15,
        photos: [
          {
            id: 1,
            width: 1000,
            height: 1000,
            url: 'https://example.com',
            photographer: 'Test Photographer',
            photographer_url: 'https://example.com',
            src: {
              original: 'https://example.com/original.jpg',
              large2x: 'https://example.com/large2x.jpg',
              large: 'https://example.com/large.jpg',
              medium: 'https://example.com/medium.jpg',
              small: 'https://example.com/small.jpg',
              portrait: 'https://example.com/portrait.jpg',
              landscape: 'https://example.com/landscape.jpg',
              tiny: 'https://example.com/tiny.jpg',
            },
            alt: 'Test image',
          },
        ],
      };

      vi.mocked(settingsApi.getApiKey).mockResolvedValue(mockApiKey);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await pexelsApi.searchImages({ query: 'test' });

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.pexels.com/v1/search?query=test&page=1&per_page=15',
        {
          headers: {
            Authorization: 'test-key',
            'Content-Type': 'application/json',
          },
        }
      );
    });
  });
});
