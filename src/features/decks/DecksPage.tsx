import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDecks } from './hooks/useDecks';
import { DeckFilters } from './components/DeckFilters';
import { DeckStats } from './components/DeckStats';
import { DeckGrid } from './components/DeckGrid';
import { CreateDeckModal, CreateDeckData } from './components/CreateDeckModal';
import { Deck, DeckCategory } from './types/deck.types';

export function DecksPage() {
  const navigate = useNavigate();
  const { decks, stats, filters, updateFilters, deleteDeck, addDeck } =
    useDecks();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleEdit = (deck: Deck) => {
    // TODO: Naviguer vers la page d'édition
    console.log('Éditer le deck:', deck.name);
  };

  const handleDuplicate = (deck: Deck) => {
    // TODO: Implémenter la duplication
    console.log('Dupliquer le deck:', deck.name);
  };

  const handleDelete = (deck: Deck) => {
    setShowDeleteConfirm(deck.id);
  };

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteDeck(showDeleteConfirm);
      setShowDeleteConfirm(null);
    }
  };

  const handleCreateDeck = () => {
    setShowCreateModal(true);
  };

  const handleCreateDeckSubmit = async (deckData: CreateDeckData) => {
    try {
      // Mapper la catégorie du formulaire vers le type DeckCategory
      const categoryMap: Record<string, DeckCategory> = {
        Grammaire: 'grammar',
        Vocabulaire: 'vocabulary',
        Conjugaison: 'conjugation',
        Prononciation: 'vocabulary', // Fallback
        Culture: 'culture',
        Histoire: 'culture',
        Géographie: 'culture',
        Littérature: 'culture',
        Autre: 'vocabulary',
      };

      const newDeck = {
        name: deckData.name,
        description: deckData.description,
        category: categoryMap[deckData.category] || 'vocabulary',
        tags: deckData.tags,
        isPublic: deckData.isPublic,
        cardCount: 0,
        userId: 'current-user', // Sera remplacé par l'ID réel de l'utilisateur connecté
      };

      // Créer le deck dans Supabase
      await addDeck(newDeck);
      console.log('Deck créé avec succès dans Supabase');
    } catch (error) {
      console.error('Erreur lors de la création du deck:', error);
      // TODO: Afficher une notification d'erreur à l'utilisateur
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-occitan-orange/10 via-white to-occitan-red/10">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-occitan-orange transition-colors duration-200"
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
              Retour au Dashboard
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mes Decks
              </h1>
              <p className="text-gray-600">
                Gérez vos decks de cartes pour l'apprentissage de l'occitan
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateDeck}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-occitan-orange hover:bg-occitan-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-occitan-orange transition-colors duration-200"
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
            Créer un Deck
          </button>
        </div>

        {/* Statistiques */}
        <DeckStats stats={stats} />

        {/* Filtres */}
        <DeckFilters filters={filters} onFiltersChange={updateFilters} />

        {/* Grille des decks */}
        <DeckGrid
          decks={decks}
          onEdit={handleEdit}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer ce deck ? Cette action est
                irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de création de deck */}
        <CreateDeckModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateDeckSubmit}
        />
      </div>
    </div>
  );
}
