import React, { useState } from 'react';
import { Toast } from '../../../../components/Toast';
import { CardFormData } from '../../types/card.types';
import { logger } from '@/core/utils/logger';
import { ImageSearchButton } from '../ImageSearchButton';
import { PexelsImage } from '../../../../core/api/pexelsApi';
import { reviradaApi, votzApi } from '@/core/api';

interface FrenchToOccitanCardProps {
  onCardCreated: (card: CardFormData) => Promise<void>;
}

export const FrenchToOccitanCard: React.FC<FrenchToOccitanCardProps> = ({
  onCardCreated,
}) => {
  const [formData, setFormData] = useState({
    frenchText: '',
    occitanText: '',
    pronunciation: '',
    includeAudio: false,
    includeImage: false,
    imageQuery: '',
    imageUrl: '',
    imageAlt: '',
  });

  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Traduction via l'API Revirada
  const translateToOccitan = async (text: string): Promise<string> => {
    const { text: translated } = await reviradaApi.translate(text);
    return translated;
  };

  // Génération audio via l'API Votz
  const generateAudio = async (text: string): Promise<string> => {
    const { url } = await votzApi.textToSpeech(text);
    return url;
  };

  const handleTranslate = async () => {
    if (!formData.frenchText.trim()) {
      setError('Veuillez entrer un texte en français');
      return;
    }

    setIsTranslating(true);
    setError(null);
    try {
      const translation = await translateToOccitan(formData.frenchText);
      setFormData((prev) => ({ ...prev, occitanText: translation }));
      setSuccess('Traduction effectuée !');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Erreur lors de la traduction';
      setError(message);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!formData.occitanText.trim()) {
      setError("Veuillez d'abord traduire le texte");
      return;
    }

    setIsGeneratingAudio(true);
    setError(null);
    try {
      const audioUrl = await generateAudio(formData.occitanText);
      setFormData((prev) => ({ ...prev, pronunciation: audioUrl }));
      setSuccess('Audio généré !');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Erreur lors de la génération audio';
      setError(message);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleImageSelected = (image: PexelsImage) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: image.src.medium,
      imageAlt: image.alt || `Image de ${image.photographer}`,
      imageQuery: image.alt || 'Image sélectionnée',
    }));
    setSuccess('Image sélectionnée !');
  };

  const handleSubmit = async () => {
    if (!formData.frenchText.trim()) {
      setError('Veuillez entrer un texte en français');
      return;
    }

    if (!formData.occitanText.trim()) {
      setError('Veuillez traduire le texte en occitan');
      return;
    }

    try {
      const cardData: CardFormData = {
        cardType: 'revirada',
        frontContent: formData.frenchText,
        backContent: formData.occitanText,
        pronunciation: formData.pronunciation,
        audioUrl: formData.pronunciation,
        imageUrl: formData.imageUrl,
        metadata: {
          source: 'revirada',
          includeAudio: formData.includeAudio,
          includeImage: formData.includeImage,
          imageAlt: formData.imageAlt,
          tags: ['french-to-occitan'],
        },
      };

      await onCardCreated(cardData);

      // Réinitialiser le formulaire
      setFormData({
        frenchText: '',
        occitanText: '',
        pronunciation: '',
        includeAudio: false,
        includeImage: false,
        imageQuery: '',
        imageUrl: '',
        imageAlt: '',
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
          Français → Occitan
        </h3>
        <p className="text-sm text-gray-600">
          Traduisez du français vers l'occitan avec support audio et images
        </p>
      </div>

      {/* Formulaire */}
      <div className="space-y-4">
        {/* Texte français */}
        <div>
          <label
            htmlFor="french-text"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Texte en français *
          </label>
          <textarea
            id="french-text"
            value={formData.frenchText}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, frenchText: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
            placeholder="Entrez le texte à traduire..."
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !formData.frenchText.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isTranslating ? 'Traduction...' : 'Traduire en occitan'}
            </button>
          </div>
        </div>

        {/* Traduction occitan */}
        <div>
          <label
            htmlFor="occitan-text"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Traduction en occitan *
          </label>
          <textarea
            id="occitan-text"
            value={formData.occitanText}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, occitanText: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
            placeholder="La traduction apparaîtra ici..."
            rows={2}
          />
        </div>

        {/* Options avancées */}
        <div className="border-t pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className={`w-4 h-4 mr-2 transition-transform ${
                showAdvanced ? 'rotate-90' : ''
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            Options avancées
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-4 pl-6">
              {/* Audio */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="include-audio"
                    checked={formData.includeAudio}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        includeAudio: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-occitan-orange focus:ring-occitan-orange border-gray-300 rounded"
                  />
                  <label
                    htmlFor="include-audio"
                    className="text-sm font-medium text-gray-700"
                  >
                    Ajouter audio (API Votz)
                  </label>
                </div>

                {formData.includeAudio && formData.occitanText && (
                  <div className="ml-7">
                    <button
                      onClick={handleGenerateAudio}
                      disabled={isGeneratingAudio}
                      className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      {isGeneratingAudio ? 'Génération...' : 'Générer audio'}
                    </button>
                    {formData.pronunciation && (
                      <p className="text-xs text-gray-500 mt-1">
                        Audio généré ✓
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Image */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="include-image"
                    checked={formData.includeImage}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        includeImage: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-occitan-orange focus:ring-occitan-orange border-gray-300 rounded"
                  />
                  <label
                    htmlFor="include-image"
                    className="text-sm font-medium text-gray-700"
                  >
                    Ajouter image (API Pexels)
                  </label>
                </div>

                {formData.includeImage && (
                  <div className="ml-7 space-y-2">
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
                          placeholder="Terme de recherche pour l'image..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
                        />
                      </div>
                      <ImageSearchButton
                        onImageSelected={handleImageSelected}
                        placeholder="Rechercher"
                        variant="outline"
                        size="sm"
                      />
                    </div>

                    {formData.imageUrl && (
                      <div className="flex items-center space-x-3">
                        <img
                          src={formData.imageUrl}
                          alt={formData.imageAlt}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src =
                              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEg0NFYzNkgyMFYyOFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHBhdGggZD0iTTIwIDQwSDQ0VjQ4SDIwVjQwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
                          }}
                        />
                        <div className="flex-1">
                          <p className="text-xs text-gray-600">
                            {formData.imageAlt}
                          </p>
                          <button
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                imageUrl: '',
                                imageAlt: '',
                                imageQuery: '',
                              }))
                            }
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bouton d'ajout */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={
              !formData.frenchText.trim() || !formData.occitanText.trim()
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
