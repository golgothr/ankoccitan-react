import React, { useState } from 'react';
import { useCards } from '../hooks/useCards';
import { CardFormData, CARD_TYPES, CardType } from '../types/card.types';
import { FrenchToOccitanCard } from './card-types/FrenchToOccitanCard';
import { ImageToOccitanCard } from './card-types/ImageToOccitanCard';
import { ClozeCard } from './card-types/ClozeCard';
import { ManualCard } from './card-types/ManualCard';

interface CardCreatorProps {
  deckId: string;
}

export const CardCreator: React.FC<CardCreatorProps> = ({ deckId }) => {
  const {
    addCard,
    saveAllPending,
    pendingCards,
    saveMode,
    setSaveMode,
    loading,
    error,
    cards,
  } = useCards(deckId);

  const [activeTab, setActiveTab] = useState<CardType>('revirada');
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Gère le changement d'onglet/type de carte
  const handleTabChange = (type: CardType) => {
    setActiveTab(type);
    setFormError(null);
    setSuccess(null);
  };

  // Gère l'ajout d'une carte
  const handleCardCreated = async (cardData: CardFormData) => {
    setFormError(null);
    setSuccess(null);
    try {
      await addCard(cardData);
      setSuccess('Carte ajoutée !');
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : "Erreur lors de l'ajout";
      setFormError(errorMessage);
    }
  };

  // Sauvegarde groupée
  const handleSaveAll = async () => {
    setFormError(null);
    setSuccess(null);
    try {
      await saveAllPending();
      setSuccess('Toutes les cartes ont été sauvegardées !');
    } catch (e: unknown) {
      const errorMessage =
        e instanceof Error ? e.message : 'Erreur lors de la sauvegarde groupée';
      setFormError(errorMessage);
    }
  };

  // Rendu du composant spécialisé selon l'onglet actif
  const renderCardForm = () => {
    switch (activeTab) {
      case 'revirada':
        return <FrenchToOccitanCard onCardCreated={handleCardCreated} />;
      case 'votz':
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">
              Composant Audio → Occitan à implémenter
            </p>
          </div>
        );
      case 'pexels':
        return <ImageToOccitanCard onCardCreated={handleCardCreated} />;
      case 'cloze':
        return <ClozeCard onCardCreated={handleCardCreated} />;
      case 'manual':
        return <ManualCard onCardCreated={handleCardCreated} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow">
      {/* Onglets dynamiques */}
      <div className="flex mb-4">
        {Object.values(CARD_TYPES).map((type) => (
          <button
            key={type.id}
            className={`px-4 py-2 rounded-t ${activeTab === type.id ? 'bg-orange-200 font-bold' : 'bg-gray-100'}`}
            onClick={() => handleTabChange(type.id)}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Formulaire spécialisé */}
      {renderCardForm()}

      {/* Feedback utilisateur */}
      {formError && <div className="mt-2 text-red-600">{formError}</div>}
      {success && <div className="mt-2 text-green-600">{success}</div>}
      {error && <div className="mt-2 text-red-600">{error}</div>}

      {/* Options de sauvegarde */}
      <div className="mt-4 flex items-center gap-2">
        <label>
          <input
            type="checkbox"
            checked={saveMode === 'immediate'}
            onChange={(e) =>
              setSaveMode(e.target.checked ? 'immediate' : 'batch')
            }
          />{' '}
          Sauvegarde immédiate
        </label>
        {saveMode === 'batch' && pendingCards.length > 0 && (
          <button
            className="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            onClick={handleSaveAll}
            disabled={loading}
            type="button"
          >
            Sauvegarder toutes les cartes ({pendingCards.length})
          </button>
        )}
      </div>

      {/* Liste des cartes déjà créées */}
      <div className="mt-6">
        <h4 className="font-bold mb-2">Cartes du deck</h4>
        <ul className="space-y-1">
          {cards.map((card) => (
            <li key={card.id} className="border-b py-1 text-sm">
              <span className="font-mono text-gray-500">{card.card_type}</span>{' '}
              : {card.front_content} → {card.back_content}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
