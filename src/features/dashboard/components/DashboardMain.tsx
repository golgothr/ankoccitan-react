import { useEffect, useState } from 'react';
import { fetchUserDecks } from '@/core/api/supabaseDecksApi';
import { fetchUserCards } from '@/core/api/supabaseCardsApi';
import type { CardRow } from '@/core/lib/supabase';
import { useAuth } from '@/core/hooks/useAuth';

export function DashboardMain() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [deckCount, setDeckCount] = useState(0);
  const [cards, setCards] = useState<CardRow[]>([]);
  const [randomCard, setRandomCard] = useState<CardRow | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const decks = await fetchUserDecks();
        setDeckCount(decks.length);
        const allCards = await fetchUserCards();
        setCards(allCards);
        if (allCards.length > 0) {
          const idx = Math.floor(Math.random() * allCards.length);
          setRandomCard(allCards[idx]);
        }
      } catch (e) {
        console.error('Erreur lors du chargement des données du dashboard:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-6" role="main">
        <p>Chargement...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto" role="main">
      <div className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bonjour {user?.name ?? ''}, bienvenue sur ton dashboard !
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 mb-2">Total de decks</p>
            <p className="text-4xl font-bold text-gray-900">{deckCount}</p>
            <button className="mt-4 text-sm text-occitan-red hover:text-occitan-orange">
              Voir tous mes decks
            </button>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 mb-2">Total de cartes</p>
            <p className="text-4xl font-bold text-gray-900">{cards.length}</p>
            <button className="mt-4 text-sm text-occitan-red hover:text-occitan-orange">
              Créer une nouvelle carte
            </button>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 mb-2">Carte aléatoire</p>
            {randomCard ? (
              <>
                <p className="text-lg font-semibold text-gray-900">
                  {randomCard.front_content}
                </p>
                <p className="text-gray-600 mt-1">{randomCard.back_content}</p>
              </>
            ) : (
              <p className="text-gray-600">Aucune carte</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
