import React, { useState } from 'react';
import { CardFormData } from '../../types/card.types';

interface ImageToOccitanCardProps {
  onCardCreated: (card: CardFormData) => Promise<void>;
}

export const ImageToOccitanCard: React.FC<ImageToOccitanCardProps> = ({
  onCardCreated,
}) => {
  const [formData, setFormData] = useState({
    imageQuery: '',
    selectedImage: '',
    imageAlt: '',
    frenchDescription: '',
    occitanTranslation: '',
  });

  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Simuler l'API de recherche d'images (à remplacer par l'API réelle)
  const searchImages = async (query: string): Promise<string> => {
    // TODO: Intégrer l'API Pexels
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simule un délai
    return `https://example.com/images/${encodeURIComponent(query)}.jpg`;
  };

  // Simuler l'API de traduction (à remplacer par l'API réelle)
  const translateToOccitan = async (text: string): Promise<string> => {
    // TODO: Intégrer l'API Revirada
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simule un délai
    return `Traduction de "${text}" en occitan`;
  };

  const handleSearchImages = async () => {
    if (!formData.imageQuery.trim()) {
      setError('Veuillez entrer un terme de recherche');
      return;
    }

    setIsSearchingImages(true);
    setError(null);
    try {
      const imageUrl = await searchImages(formData.imageQuery);
      setFormData((prev) => ({
        ...prev,
        selectedImage: imageUrl,
        imageAlt: formData.imageQuery,
      }));
      setSuccess('Image trouvée !');
    } catch {
      setError("Erreur lors de la recherche d'image");
    } finally {
      setIsSearchingImages(false);
    }
  };

  const handleTranslate = async () => {
    if (!formData.frenchDescription.trim()) {
      setError('Veuillez entrer une description en français');
      return;
    }

    setIsTranslating(true);
    setError(null);
    try {
      const translation = await translateToOccitan(formData.frenchDescription);
      setFormData((prev) => ({ ...prev, occitanTranslation: translation }));
      setSuccess('Traduction effectuée !');
    } catch {
      setError('Erreur lors de la traduction');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.selectedImage ||
      !formData.frenchDescription.trim() ||
      !formData.occitanTranslation.trim()
    ) {
      setError('Veuillez sélectionner une image et remplir les descriptions');
      return;
    }

    setError(null);
    try {
      const cardData: CardFormData = {
        cardType: 'pexels',
        frontContent: formData.selectedImage, // L'image sera affichée au recto
        backContent: formData.occitanTranslation, // La traduction au verso
        imageUrl: formData.selectedImage,
        metadata: {
          imageQuery: formData.imageQuery,
          imageAlt: formData.imageAlt,
          frenchDescription: formData.frenchDescription,
          translationSource: 'revirada',
        },
      };

      await onCardCreated(cardData);
      setSuccess('Carte ajoutée au deck !');

      // Réinitialiser le formulaire
      setFormData({
        imageQuery: '',
        selectedImage: '',
        imageAlt: '',
        frenchDescription: '',
        occitanTranslation: '',
      });
    } catch {
      setError("Erreur lors de l'ajout de la carte");
    }
  };

  return (
    <div className="space-y-6">
      {/* Titre et description */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Image → Occitan
        </h3>
        <p className="text-sm text-gray-600">
          Créez des cartes avec des images et leur traduction en occitan
        </p>
      </div>

      {/* Formulaire */}
      <div className="space-y-4">
        {/* Recherche d'image */}
        <div>
          <label
            htmlFor="image-query"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Rechercher une image *
          </label>
          <div className="flex space-x-2">
            <input
              id="image-query"
              type="text"
              value={formData.imageQuery}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, imageQuery: e.target.value }))
              }
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
              placeholder="Ex: chat, maison, voiture..."
            />
            <button
              onClick={handleSearchImages}
              disabled={isSearchingImages || !formData.imageQuery.trim()}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSearchingImages ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </>
              ) : (
                <>
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Image sélectionnée */}
        {formData.selectedImage && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Image sélectionnée
            </h4>
            <div className="flex items-center space-x-3">
              <img
                src={formData.selectedImage}
                alt={formData.imageAlt}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEg0NFYzNkgyMFYyOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDQwSDQ0VjQ4SDIwVjQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                }}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{formData.imageAlt}</p>
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      selectedImage: '',
                      imageAlt: '',
                    }))
                  }
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Changer d'image
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Description française */}
        <div>
          <label
            htmlFor="french-description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description en français *
          </label>
          <textarea
            id="french-description"
            value={formData.frenchDescription}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                frenchDescription: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
            placeholder="Décrivez ce qui est visible sur l'image..."
            rows={2}
          />
        </div>

        {/* Bouton de traduction */}
        <div className="flex justify-center">
          <button
            onClick={handleTranslate}
            disabled={isTranslating || !formData.frenchDescription.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-occitan-orange hover:bg-occitan-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-occitan-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isTranslating ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Traduction en cours...
              </>
            ) : (
              <>
                <svg
                  className="-ml-1 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                Traduire
              </>
            )}
          </button>
        </div>

        {/* Traduction occitan */}
        <div>
          <label
            htmlFor="occitan-translation"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Traduction en occitan *
          </label>
          <textarea
            id="occitan-translation"
            value={formData.occitanTranslation}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                occitanTranslation: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
            placeholder="La traduction apparaîtra ici..."
            rows={2}
          />
        </div>

        {/* Bouton d'ajout */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={
              !formData.selectedImage ||
              !formData.frenchDescription.trim() ||
              !formData.occitanTranslation.trim()
            }
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-occitan-orange hover:bg-occitan-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-occitan-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Ajouter au deck
          </button>
        </div>
      </div>

      {/* Messages de feedback */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}
    </div>
  );
};
