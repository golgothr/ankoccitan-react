import { useEffect, useState, useMemo } from 'react';
import { fetchDeckStats } from '@/core/api/supabaseDecksApi';
import { fetchRandomCard } from '@/core/api/supabaseCardsApi';
import { logger } from '@/core/utils/logger';
import type { CardRow } from '@/core/lib/supabase';
import { useAuth } from '@/core/hooks/useAuth';

export function DashboardMain() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [deckCount, setDeckCount] = useState(0);
  const [cardCount, setCardCount] = useState(0);
  const [randomCard, setRandomCard] = useState<CardRow | null>(null);

  // Calculer les statistiques du dashboard avec useMemo
  const dashboardStats = useMemo(() => {
    return {
      totalCards: cardCount,
      totalDecks: deckCount,
      averageCardsPerDeck:
        deckCount > 0 ? Math.round(cardCount / deckCount) : 0,
      hasData: cardCount > 0 || deckCount > 0,
    };
  }, [cardCount, deckCount]);

  // Utiliser les stats calculées
  const { totalCards, totalDecks } = dashboardStats;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Charger les statistiques des decks
        const stats = await fetchDeckStats();
        setDeckCount(stats.totalDecks);
        setCardCount(stats.totalCards);

        // Charger une carte aléatoire
        const randomCardData = await fetchRandomCard();
        setRandomCard(randomCardData);
      } catch (e) {
        logger.error('Erreur lors du chargement des données du dashboard:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 overflow-y-auto p-6" role="main">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-occitan-orange"></div>
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
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
            <p className="text-4xl font-bold text-gray-900">{totalDecks}</p>
            <button className="mt-4 text-sm text-occitan-red hover:text-occitan-orange">
              Voir tous mes decks
            </button>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-md flex flex-col items-center justify-center">
            <p className="text-sm text-gray-600 mb-2">Total de cartes</p>
            <p className="text-4xl font-bold text-gray-900">{totalCards}</p>
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
