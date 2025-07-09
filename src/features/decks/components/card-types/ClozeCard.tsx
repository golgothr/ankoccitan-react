import React, { useState } from 'react';
import { CardFormData } from '../../types/card.types';

interface ClozeCardProps {
  onCardCreated: (card: CardFormData) => Promise<void>;
}

export const ClozeCard: React.FC<ClozeCardProps> = ({ onCardCreated }) => {
  const [formData, setFormData] = useState({
    frenchText: '',
    occitanText: '',
    clozeWords: [] as string[],
    selectedWords: [] as number[],
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

  // Extraire les mots du texte français
  const extractWords = (text: string): string[] => {
    return text
      .split(/\s+/)
      .filter((word) => word.length > 2) // Ignorer les mots trop courts
      .map((word) => word.replace(/[.,!?;:]/g, '')); // Nettoyer la ponctuation
  };

  // Gérer la sélection de mots pour créer les trous
  const handleWordSelection = (wordIndex: number) => {
    setFormData((prev) => {
      const newSelectedWords = prev.selectedWords.includes(wordIndex)
        ? prev.selectedWords.filter((i) => i !== wordIndex)
        : [...prev.selectedWords, wordIndex];

      return {
        ...prev,
        selectedWords: newSelectedWords,
        clozeWords: newSelectedWords.map((i) => prev.clozeWords[i] || ''),
      };
    });
  };

  // Créer le texte avec les trous
  const createClozeText = (text: string, selectedIndices: number[]): string => {
    const words = text.split(/\s+/);
    return words
      .map((word, index) => {
        if (selectedIndices.includes(index)) {
          return '{{c1::' + word.replace(/[.,!?;:]/g, '') + '}}';
        }
        return word;
      })
      .join(' ');
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
      setFormData((prev) => ({
        ...prev,
        occitanText: translation,
        clozeWords: extractWords(prev.frenchText),
      }));
      setSuccess('Traduction effectuée !');
    } catch {
      setError('Erreur lors de la traduction');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.frenchText.trim() || !formData.occitanText.trim()) {
      setError('Veuillez remplir les deux textes');
      return;
    }

    if (formData.selectedWords.length === 0) {
      setError('Veuillez sélectionner au moins un mot à masquer');
      return;
    }

    setError(null);
    try {
      const clozeText = createClozeText(
        formData.frenchText,
        formData.selectedWords
      );

      const cardData: CardFormData = {
        cardType: 'cloze',
        frontContent: clozeText, // Texte avec trous au recto
        backContent: formData.occitanText, // Traduction au verso
        metadata: {
          originalText: formData.frenchText,
          selectedWords: formData.selectedWords,
          clozeWords: formData.clozeWords,
          translationSource: 'revirada',
        },
      };

      await onCardCreated(cardData);
      setSuccess('Carte ajoutée au deck !');

      // Réinitialiser le formulaire
      setFormData({
        frenchText: '',
        occitanText: '',
        clozeWords: [],
        selectedWords: [],
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
          Texte à trous
        </h3>
        <p className="text-sm text-gray-600">
          Créez des cartes avec du texte français et des mots masqués
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
            onChange={(e) => {
              const text = e.target.value;
              setFormData((prev) => ({
                ...prev,
                frenchText: text,
                clozeWords: extractWords(text),
                selectedWords: [], // Réinitialiser la sélection
              }));
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
            placeholder="Entrez votre texte en français..."
            rows={3}
          />
        </div>

        {/* Sélection des mots */}
        {formData.clozeWords.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionnez les mots à masquer *
            </label>
            <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
              <p className="text-xs text-gray-600 mb-2">
                Cliquez sur les mots que vous voulez masquer dans la carte
              </p>
              <div className="flex flex-wrap gap-2">
                {formData.clozeWords.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => handleWordSelection(index)}
                    className={`px-2 py-1 rounded text-sm transition-colors duration-200 ${
                      formData.selectedWords.includes(index)
                        ? 'bg-occitan-orange text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
              {formData.selectedWords.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  {formData.selectedWords.length} mot(s) sélectionné(s)
                </p>
              )}
            </div>
          </div>
        )}

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

        {/* Aperçu de la carte */}
        {formData.selectedWords.length > 0 && formData.frenchText && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aperçu de la carte
            </label>
            <div className="p-4 border border-gray-300 rounded-md bg-white">
              <div className="mb-3">
                <span className="text-xs font-medium text-gray-500">
                  Recto (avec trous) :
                </span>
                <p className="text-sm text-gray-700 mt-1">
                  {createClozeText(formData.frenchText, formData.selectedWords)}
                </p>
              </div>
              {formData.occitanText && (
                <div>
                  <span className="text-xs font-medium text-gray-500">
                    Verso (traduction) :
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {formData.occitanText}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Bouton d'ajout */}
        <div className="flex justify-center pt-4">
          <button
            onClick={handleSubmit}
            disabled={
              !formData.frenchText.trim() ||
              !formData.occitanText.trim() ||
              formData.selectedWords.length === 0
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
