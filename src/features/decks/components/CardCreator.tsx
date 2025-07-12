import React, { useState } from 'react';
import { Toast } from '../../../components/Toast';
import { useCards } from '../hooks/useCards';
import { CardFormData, CARD_TYPES, CardType } from '../types/card.types';
import { FrenchToOccitanCard } from './card-types/FrenchToOccitanCard';
import { ImageToOccitanCard } from './card-types/ImageToOccitanCard';
import { ClozeCard } from './card-types/ClozeCard';
import { ManualCard } from './card-types/ManualCard';

interface CardCreatorProps {
  deckId: string;
  activeTab?: CardType;
  onTabChange?: (type: CardType) => void;
  hideTabs?: boolean;
}

export const CardCreator: React.FC<CardCreatorProps> = ({
  deckId,
  activeTab: activeTabProp,
  onTabChange,
  hideTabs,
}) => {
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

  const [activeTab, setActiveTab] = useState<CardType>(
    activeTabProp ?? 'revirada'
  );

  React.useEffect(() => {
    if (activeTabProp) {
      setActiveTab(activeTabProp);
    }
  }, [activeTabProp]);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Gère le changement d'onglet/type de carte
  const handleTabChange = (type: CardType) => {
    if (!activeTabProp) {
      setActiveTab(type);
    }
    onTabChange?.(type);
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
    <div className="grid md:grid-cols-3 gap-6 bg-white rounded shadow p-4">
      <div className="md:col-span-2">
        {/* Navigation verticale */}
        {!hideTabs && (
          <div className="flex md:flex-col mb-4 md:mb-0 md:mr-4">
            {Object.values(CARD_TYPES).map((type) => (
              <button
                key={type.id}
                className={`px-4 py-2 md:w-full text-left border-b md:border-b-0 md:border-l ${activeTab === type.id ? 'bg-orange-200 font-bold border-orange-300' : 'bg-gray-100'}`}
                onClick={() => handleTabChange(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>
        )}

        {/* Formulaire spécialisé */}
        {renderCardForm()}

        {/* Options de sauvegarde */}
        <div className="mt-4 flex items-center gap-2">
          <label className="text-sm">
            <input
              type="checkbox"
              checked={saveMode === 'immediate'}
              onChange={(e) =>
                setSaveMode(e.target.checked ? 'immediate' : 'batch')
              }
              className="mr-2"
            />
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
      </div>

      {/* Aperçu / cartes du deck */}
      <div className="md:col-span-1">
        <h4 className="font-bold mb-2">Cartes du deck</h4>
        <ul className="space-y-1 text-sm">
          {cards.map((card) => (
            <li key={card.id} className="border-b py-1">
              <span className="font-mono text-gray-500">{card.card_type}</span>{' '}
              : {card.front_content} → {card.back_content}
            </li>
          ))}
        </ul>
      </div>

      {/* Feedback utilisateur */}
      {formError && (
        <Toast
          type="error"
          message={formError}
          onClose={() => setFormError(null)}
        />
      )}
      {success && <Toast message={success} onClose={() => setSuccess(null)} />}
      {error && <Toast type="error" message={error} onClose={() => {}} />}
    </div>
  );
};
