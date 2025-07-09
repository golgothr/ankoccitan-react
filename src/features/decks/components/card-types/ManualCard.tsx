import React, { useState } from 'react';
import { CardFormData } from '../../types/card.types';

interface ManualCardProps {
  onCardCreated: (card: CardFormData) => Promise<void>;
}

export const ManualCard: React.FC<ManualCardProps> = ({ onCardCreated }) => {
  const [formData, setFormData] = useState({
    frontContent: '',
    backContent: '',
    pronunciation: '',
    notes: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.frontContent.trim() || !formData.backContent.trim()) {
      setError('Veuillez remplir le recto et le verso de la carte');
      return;
    }

    setError(null);
    try {
      const cardData: CardFormData = {
        cardType: 'manual',
        frontContent: formData.frontContent,
        backContent: formData.backContent,
        pronunciation: formData.pronunciation || undefined,
        metadata: {
          notes: formData.notes,
          createdManually: true,
        },
      };

      await onCardCreated(cardData);
      setSuccess('Carte ajoutée au deck !');

      // Réinitialiser le formulaire
      setFormData({
        frontContent: '',
        backContent: '',
        pronunciation: '',
        notes: '',
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
          Carte manuelle
        </h3>
        <p className="text-sm text-gray-600">
          Créez des cartes personnalisées sans utiliser d'API
        </p>
      </div>

      {/* Formulaire */}
      <div className="space-y-4">
        {/* Recto de la carte */}
        <div>
          <label
            htmlFor="front-content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Recto de la carte *
          </label>
          <textarea
            id="front-content"
            value={formData.frontContent}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, frontContent: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
            placeholder="Ce qui sera affiché au recto de la carte..."
            rows={3}
          />
        </div>

        {/* Verso de la carte */}
        <div>
          <label
            htmlFor="back-content"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Verso de la carte *
          </label>
          <textarea
            id="back-content"
            value={formData.backContent}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, backContent: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
            placeholder="Ce qui sera affiché au verso de la carte..."
            rows={3}
          />
        </div>

        {/* Prononciation (optionnel) */}
        <div>
          <label
            htmlFor="pronunciation"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Prononciation (optionnel)
          </label>
          <input
            id="pronunciation"
            type="text"
            value={formData.pronunciation}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                pronunciation: e.target.value,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
            placeholder="Guide de prononciation..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Ex: [ʃa] pour "chat" en occitan
          </p>
        </div>

        {/* Notes (optionnel) */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Notes (optionnel)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, notes: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange focus:border-occitan-orange"
            placeholder="Notes personnelles, contexte, exemples..."
            rows={2}
          />
        </div>

        {/* Aperçu de la carte */}
        {(formData.frontContent || formData.backContent) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aperçu de la carte
            </label>
            <div className="p-4 border border-gray-300 rounded-md bg-white">
              {formData.frontContent && (
                <div className="mb-3">
                  <span className="text-xs font-medium text-gray-500">
                    Recto :
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {formData.frontContent}
                  </p>
                </div>
              )}
              {formData.backContent && (
                <div>
                  <span className="text-xs font-medium text-gray-500">
                    Verso :
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {formData.backContent}
                  </p>
                </div>
              )}
              {formData.pronunciation && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs font-medium text-gray-500">
                    Prononciation :
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.pronunciation}
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
              !formData.frontContent.trim() || !formData.backContent.trim()
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
