import React, { useState, useEffect, useCallback } from 'react';
import {
  pexelsApi,
  PexelsImage,
  PexelsSearchParams,
} from '../../../core/api/pexelsApi';

interface ImageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (image: PexelsImage) => void;
  searchQuery?: string;
}

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  searchQuery = '',
}) => {
  const [query, setQuery] = useState(searchQuery);
  const [images, setImages] = useState<PexelsImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);

  const searchImages = useCallback(
    async (page: number = 1) => {
      if (!query.trim()) return;

      try {
        setIsLoading(true);
        setError(null);

        const searchParams: PexelsSearchParams = {
          query: query.trim(),
          page,
          per_page: 20,
          orientation: 'landscape',
          size: 'medium',
        };

        const response = await pexelsApi.searchImages(searchParams);

        if (page === 1) {
          setImages(response.photos);
        } else {
          setImages((prev) => [...prev, ...response.photos]);
        }

        setHasMore(response.photos.length === searchParams.per_page);
        setCurrentPage(page);
      } catch (error) {
        console.error("Erreur lors de la recherche d'images:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Erreur lors de la recherche d'images"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    if (isOpen) {
      checkPexelsConfiguration();
      if (query.trim()) {
        searchImages();
      }
    }
  }, [isOpen, query, searchImages]);

  const checkPexelsConfiguration = async () => {
    try {
      const configured = await pexelsApi.isPexelsConfigured();
      setIsConfigured(configured);
      if (!configured) {
        setError(
          'Clé API Pexels non configurée. Veuillez configurer votre clé dans les paramètres.'
        );
      }
    } catch (error) {
      console.error(
        'Erreur lors de la vérification de la configuration:',
        error
      );
      setError('Erreur lors de la vérification de la configuration Pexels');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    searchImages(1);
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      searchImages(currentPage + 1);
    }
  };

  const handleImageSelect = (image: PexelsImage) => {
    onSelectImage(image);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Rechercher une image
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isConfigured ? (
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <a
                href="/settings"
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Configurer la clé API
              </a>
            </div>
          ) : (
            <>
              {/* Search Form */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher une image (ex: nature, ville, animaux...)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !query.trim()}
                    className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Recherche...' : 'Rechercher'}
                  </button>
                </div>
              </form>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Images Grid */}
              {images.length > 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="group relative cursor-pointer rounded-lg overflow-hidden border hover:border-orange-500 transition-colors"
                        onClick={() => handleImageSelect(image)}
                      >
                        <img
                          src={image.src.medium}
                          alt={image.alt || `Image de ${image.photographer}`}
                          className="w-full h-32 object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <svg
                              className="w-8 h-8 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                          <p className="text-white text-xs truncate">
                            {image.photographer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="text-center">
                      <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isLoading ? 'Chargement...' : 'Charger plus'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && images.length === 0 && query.trim() && !error && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    Aucune image trouvée pour "{query}"
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Essayez avec d'autres mots-clés
                  </p>
                </div>
              )}

              {/* Initial State */}
              {!isLoading && images.length === 0 && !query.trim() && !error && (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <p className="text-gray-600">
                    Recherchez une image pour commencer
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Ex: nature, ville, animaux, nourriture...
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
