import { Deck } from '../types/deck.types';
import { DeckCard } from './DeckCard';

interface DeckGridProps {
  decks: Deck[];
  onEdit: (deck: Deck) => void;
  onDuplicate: (deck: Deck) => void;
  onDelete: (deck: Deck) => void;
}

export function DeckGrid({
  decks,
  onEdit,
  onDuplicate,
  onDelete,
}: DeckGridProps) {
  if (decks.length === 0) {
    return (
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Aucun deck trouvé
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Commencez par créer votre premier deck de cartes.
        </p>
        <div className="mt-6">
          <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-occitan-orange hover:bg-occitan-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-occitan-orange">
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
            Créer un deck
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {decks.map((deck) => (
        <DeckCard
          key={deck.id}
          deck={deck}
          onEdit={onEdit}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
