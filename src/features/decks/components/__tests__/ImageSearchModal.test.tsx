import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageSearchModal } from '../ImageSearchModal';
import { pexelsApi } from '../../../../core/api/pexelsApi';

// Mock du service pexelsApi
vi.mock('../../../../core/api/pexelsApi', () => ({
  pexelsApi: {
    isPexelsConfigured: vi.fn(),
    searchImages: vi.fn(),
  },
}));

describe('ImageSearchModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSelectImage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <ImageSearchModal
        isOpen={false}
        onClose={mockOnClose}
        onSelectImage={mockOnSelectImage}
      />
    );

    expect(screen.queryByText('Rechercher une image')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    vi.mocked(pexelsApi.isPexelsConfigured).mockResolvedValue(true);

    render(
      <ImageSearchModal
        isOpen={true}
        onClose={mockOnClose}
        onSelectImage={mockOnSelectImage}
      />
    );

    expect(screen.getByText('Rechercher une image')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Rechercher une image/)
    ).toBeInTheDocument();
  });

  it('should show configuration error when Pexels is not configured', async () => {
    vi.mocked(pexelsApi.isPexelsConfigured).mockResolvedValue(false);

    render(
      <ImageSearchModal
        isOpen={true}
        onClose={mockOnClose}
        onSelectImage={mockOnSelectImage}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Clé API Pexels non configurée/)
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Configurer la clé API')).toBeInTheDocument();
  });

  it('should handle search when configured', async () => {
    vi.mocked(pexelsApi.isPexelsConfigured).mockResolvedValue(true);
    vi.mocked(pexelsApi.searchImages).mockResolvedValue({
      total_results: 1,
      page: 1,
      per_page: 20,
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
    });

    render(
      <ImageSearchModal
        isOpen={true}
        onClose={mockOnClose}
        onSelectImage={mockOnSelectImage}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Rechercher une image/);
    const searchButton = screen.getByText('Rechercher');

    fireEvent.change(searchInput, { target: { value: 'nature' } });
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(pexelsApi.searchImages).toHaveBeenCalledWith({
        query: 'nature',
        page: 1,
        per_page: 20,
        orientation: 'landscape',
        size: 'medium',
      });
    });
  });

  it('should call onClose when close button is clicked', () => {
    vi.mocked(pexelsApi.isPexelsConfigured).mockResolvedValue(true);

    render(
      <ImageSearchModal
        isOpen={true}
        onClose={mockOnClose}
        onSelectImage={mockOnSelectImage}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
