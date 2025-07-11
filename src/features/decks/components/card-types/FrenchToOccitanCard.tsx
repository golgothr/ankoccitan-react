import React, { useState } from 'react';
import { Toast } from '../../../../components/Toast';
import { CardFormData } from '../../types/card.types';

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
  });

  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isSearchingImage, setIsSearchingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Simuler l'API de traduction (à remplacer par l'API réelle)
  const translateToOccitan = async (text: string): Promise<string> => {
    // TODO: Intégrer l'API Revirada
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simule un délai
    return `Traduction de "${text}" en occitan`;
  };

  // Simuler l'API de génération audio (à remplacer par l'API réelle)
  const generateAudio = async (text: string): Promise<string> => {
    // TODO: Intégrer l'API Votz
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simule un délai
    return `https://example.com/audio/${encodeURIComponent(text)}.mp3`;
  };

  // Simuler l'API de recherche d'images (à remplacer par l'API réelle)
  const searchImages = async (query: string): Promise<string> => {
    // TODO: Intégrer l'API Pexels
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simule un délai
    return `https://example.com/images/${encodeURIComponent(query)}.jpg`;
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
    } catch {
      setError('Erreur lors de la traduction');
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
    } catch {
      setError('Erreur lors de la génération audio');
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const handleSearchImage = async () => {
    if (!formData.imageQuery.trim()) {
      setError('Veuillez entrer un terme de recherche');
      return;
    }

    setIsSearchingImage(true);
    setError(null);
    try {
      const imageUrl = await searchImages(formData.imageQuery);
      setFormData((prev) => ({ ...prev, imageUrl }));
      setSuccess('Image trouvée !');
    } catch {
      setError("Erreur lors de la recherche d'image");
    } finally {
      setIsSearchingImage(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.frenchText.trim() || !formData.occitanText.trim()) {
      setError('Veuillez remplir les champs français et occitan');
      return;
    }

    setError(null);
    try {
      const cardData: CardFormData = {
        cardType: 'revirada',
        frontContent: formData.frenchText,
        backContent: formData.occitanText,
        pronunciation: formData.includeAudio
          ? formData.pronunciation
          : undefined,
        audioUrl: formData.includeAudio ? formData.pronunciation : undefined,
        imageUrl: formData.includeImage ? formData.imageUrl : undefined,
        metadata: {
          originalText: formData.frenchText,
          translationSource: 'revirada',
          hasAudio: formData.includeAudio,
          hasImage: formData.includeImage,
        },
      };

      await onCardCreated(cardData);
      setSuccess('Carte ajoutée au deck !');

      // Réinitialiser le formulaire
      setFormData({
        frenchText: '',
        occitanText: '',
        pronunciation: '',
        includeAudio: false,
        includeImage: false,
        imageQuery: '',
        imageUrl: '',
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
          Français → Occitan
        </h3>
        <p className="text-sm text-gray-600">
          Traduisez du français vers l'occitan et ajoutez des ressources
          multimédia
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
        </div>

        {/* Bouton de traduction */}
        <div className="flex justify-center">
          <button
            onClick={handleTranslate}
            disabled={isTranslating || !formData.frenchText.trim()}
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
            rows={3}
          />
        </div>

        {/* Options avancées */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center justify-between w-full px-3 py-2 bg-gray-100 rounded"
          >
            <span className="text-sm font-medium text-gray-700">Options avancées</span>
            <span className="text-sm">{showAdvanced ? '-' : '+'}</span>
          </button>
          {showAdvanced && (
            <>

          {/* Audio */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
              <button
                onClick={handleGenerateAudio}
                disabled={isGeneratingAudio}
                className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {isGeneratingAudio ? 'Génération...' : 'Générer'}
              </button>
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
                {formData.imageQuery && (
                  <button
                    onClick={handleSearchImage}
                    disabled={isSearchingImage}
                    className="text-xs px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                  >
                    {isSearchingImage ? 'Recherche...' : 'Rechercher'}
                  </button>
                )}
              </div>
            )}
          </div>
        </>
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
        <Toast
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}
      {success && (
        <Toast
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}
    </div>
  );
};
