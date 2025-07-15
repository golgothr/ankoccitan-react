import React, { useState } from 'react';
import { Toast } from '../../../../components/Toast';
import { CardFormData } from '../../types/card.types';
import { ImageSearchButton } from '../ImageSearchButton';
import { PexelsImage } from '../../../../core/api/pexelsApi';
import { logger } from '@/core/utils/logger';

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

  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Simuler l'API de traduction (à remplacer par l'API réelle)
  const translateToOccitan = async (text: string): Promise<string> => {
    // TODO: Intégrer l'API Revirada
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simule un délai
    return `Traduction de "${text}" en occitan`;
  };

  const handleImageSelected = (image: PexelsImage) => {
    setFormData((prev) => ({
      ...prev,
      selectedImage: image.src.medium,
      imageAlt: image.alt || `Image de ${image.photographer}`,
      imageQuery: image.alt || 'Image sélectionnée',
    }));
    setSuccess('Image sélectionnée !');
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
    if (!formData.selectedImage) {
      setError('Veuillez sélectionner une image');
      return;
    }

    if (!formData.frenchDescription.trim()) {
      setError('Veuillez entrer une description en français');
      return;
    }

    if (!formData.occitanTranslation.trim()) {
      setError('Veuillez entrer une traduction en occitan');
      return;
    }

    try {
      const cardData: CardFormData = {
        cardType: 'pexels',
        frontContent: formData.frenchDescription,
        backContent: formData.occitanTranslation,
        imageUrl: formData.selectedImage,
        metadata: {
          imageAlt: formData.imageAlt,
          source: 'pexels',
          photographer: formData.imageAlt.split(' de ')[1] || 'Inconnu',
          tags: ['image', 'occitan'],
        },
      };

      await onCardCreated(cardData);

      // Réinitialiser le formulaire
      setFormData({
        imageQuery: '',
        selectedImage: '',
        imageAlt: '',
        frenchDescription: '',
        occitanTranslation: '',
      });

      setSuccess('Carte ajoutée au deck avec succès !');
    } catch (error) {
      logger.error('Erreur lors de la création de la carte:', error);
      setError('Erreur lors de la création de la carte');
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rechercher une image *
          </label>
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={formData.imageQuery}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    imageQuery: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
                placeholder="Ex: chat, maison, voiture..."
                readOnly
              />
            </div>
            <ImageSearchButton
              onImageSelected={handleImageSelected}
              placeholder="Rechercher"
              variant="primary"
              size="md"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cliquez sur le bouton de recherche pour ouvrir la galerie d'images
            Pexels
          </p>
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
                      imageQuery: '',
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

        {/* Description en français */}
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
            placeholder="Décrivez l'image en français..."
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !formData.frenchDescription.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isTranslating ? 'Traduction...' : 'Traduire en occitan'}
            </button>
          </div>
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

      {error && (
        <Toast type="error" message={error} onClose={() => setError(null)} />
      )}
      {success && <Toast message={success} onClose={() => setSuccess(null)} />}
    </div>
  );
};
