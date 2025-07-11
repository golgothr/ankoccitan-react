import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CardCreator } from '../components/CardCreator';
import { useDecks } from '../hooks/useDecks';
// import { Deck } from '../types/deck.types';

export const CardCreationPage: React.FC = () => {
  const navigate = useNavigate();
  const { deckId } = useParams<{ deckId?: string }>();
  const { decks } = useDecks();
  const [selectedDeckId, setSelectedDeckId] = useState<string | undefined>(
    deckId
  );

  // Si un deckId est fourni dans l'URL, l'utiliser
  React.useEffect(() => {
    if (deckId) {
      setSelectedDeckId(deckId);
    }
  }, [deckId]);

  const handleBackToDecks = () => {
    navigate('/decks');
  };

  const handleDeckChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeckId(event.target.value || undefined);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-occitan-orange/10 via-white to-occitan-red/10">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* En-tête avec navigation */}
        <div className="sticky top-0 z-10 bg-white/70 backdrop-blur flex items-center justify-between px-4 py-3 shadow-sm">
          <button
            onClick={handleBackToDecks}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-occitan-orange"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour aux Decks
          </button>
          <div className="text-center flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Créer des cartes</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Sélection du deck */}
          <div>
            <label htmlFor="deck-select" className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un deck
            </label>
            <select
              id="deck-select"
              value={selectedDeckId || ''}
              onChange={handleDeckChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-occitan-orange"
            >
              <option value="">Choisir un deck...</option>
              {decks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.name} ({deck.cardCount} cartes)
                </option>
              ))}
            </select>
          </div>

          {/* Affichage conditionnel du CardCreator */}
          <div>
            {selectedDeckId ? (
              <CardCreator deckId={selectedDeckId} />
            ) : (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun deck sélectionné</h3>
                <p className="mt-1 text-sm text-gray-500">Veuillez sélectionner un deck pour commencer à créer des cartes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
