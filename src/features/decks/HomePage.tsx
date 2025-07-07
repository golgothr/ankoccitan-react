import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth/authStore'
import { fetchDecks } from '@/core/api/decksApi'

export function DashboardPage() {
  const { user } = useAuthStore()
  
  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['decks'],
    queryFn: fetchDecks,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div data-testid="loading" className="text-lg text-gray-600">Chargement...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Erreur lors du chargement
        </h2>
        <p className="text-gray-600">
          Impossible de charger les decks. Veuillez réessayer.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Bienvenue sur AnkoCitan
        </h1>
        <p className="text-lg text-gray-600">
          {user ? `Bonjour ${user.name} !` : 'Connectez-vous pour commencer'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks?.map((deck) => (
          <div
            key={deck.id}
            data-testid="deck-card"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {deck.title}
            </h3>
            <p className="text-gray-600 mb-4">{deck.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {deck.cardCount} cartes
              </span>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                Étudier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 