import { DeckStats as Stats, DECK_CATEGORIES } from '../types/deck.types';

interface DeckStatsProps {
  stats: Stats;
}

export function DeckStats({ stats }: DeckStatsProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Aucune activité';

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return `Il y a ${Math.floor(diffDays / 30)} mois`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/30 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total des decks */}
        <div className="text-center">
          <div className="text-3xl font-bold text-occitan-orange mb-1">
            {stats.totalDecks}
          </div>
          <div className="text-sm text-gray-600">Decks créés</div>
        </div>

        {/* Total des cartes */}
        <div className="text-center">
          <div className="text-3xl font-bold text-occitan-red mb-1">
            {stats.totalCards}
          </div>
          <div className="text-sm text-gray-600">Cartes créées</div>
        </div>

        {/* Dernière activité */}
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900 mb-1">
            {formatDate(stats.lastActivity)}
          </div>
          <div className="text-sm text-gray-600">Dernière activité</div>
        </div>
      </div>

      {/* Répartition par catégorie */}
      {stats.totalDecks > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Répartition par catégorie
          </h3>
          <div className="space-y-2">
            {Object.entries(stats.categoryDistribution).map(
              ([category, count]) => {
                if (count === 0) return null;

                const percentage = Math.round((count / stats.totalDecks) * 100);
                return (
                  <div
                    key={category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 w-24">
                        {
                          DECK_CATEGORIES[
                            category as keyof typeof DECK_CATEGORIES
                          ]
                        }
                      </span>
                      <div className="flex-1 mx-3 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-occitan-orange h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
}
