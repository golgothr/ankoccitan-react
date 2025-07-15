import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDecks } from './hooks/useDecks';
import { useAuth } from '../../core/hooks/useAuth';
import { DeckFilters } from './components/DeckFilters';
import { DeckStats } from './components/DeckStats';
import { DeckGrid } from './components/DeckGrid';
import { CreateDeckModal, CreateDeckData } from './components/CreateDeckModal';
import { Deck, DeckCategory } from './types/deck.types';
import { logger } from '@/core/utils/logger';

export function DecksPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ Récupérer l'utilisateur connecté
  const {
    decks,
    stats,
    filters,
    loading,
    error,
    updateFilters,
    deleteDeck,
    addDeck,
  } = useDecks();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleEdit = useCallback((deck: Deck) => {
    // ✅ Naviguer vers la page d'édition (à implémenter plus tard)
    logger.log('Éditer le deck:', deck.name);
    // TODO: Naviguer vers /decks/:id/edit
    // navigate(`/decks/${deck.id}/edit`);
  }, []);

  const handleDuplicate = useCallback(
    async (deck: Deck) => {
      try {
        // ✅ Créer une copie du deck
        const duplicatedDeck = {
          name: `${deck.name} (copie)`,
          description: deck.description,
          category: deck.category,
          tags: deck.tags,
          isPublic: false, // Les copies sont privées par défaut
          cardCount: 0, // Pas de cartes dans la copie
          userId: user?.id || '',
        };

        await addDeck(duplicatedDeck);
        logger.log('Deck dupliqué avec succès');
      } catch (error) {
        logger.error('Erreur lors de la duplication du deck:', error);
        // L'erreur sera gérée par la modal
        throw error;
      }
    },
    [addDeck, user?.id]
  );

  const handleDelete = useCallback((deck: Deck) => {
    setShowDeleteConfirm(deck.id);
  }, []);

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
    // Mapper le niveau de difficulté vers le type DeckCategory
    const difficultyMap: Record<string, DeckCategory> = {
      débutant: 'vocabulary',
      intermédiaire: 'grammar',
      avancé: 'culture',
    };

    const newDeck = {
      name: deckData.name,
      description: deckData.description,
      category: difficultyMap[deckData.difficultyLevel] || 'vocabulary',
      tags: deckData.tags,
      isPublic: deckData.isPublic,
      cardCount: 0,
      userId: user?.id || '', // ✅ Utiliser l'ID de l'utilisateur connecté
    };

    // Créer le deck dans Supabase
    await addDeck(newDeck);
    logger.log('Deck créé avec succès dans Supabase');
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
          <div className="flex items-center space-x-4">
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
            <button
              onClick={() => navigate('/cards')}
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-occitan-orange transition-colors duration-200"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Créer des cartes
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <DeckStats stats={stats} />

        {/* Filtres */}
        <DeckFilters filters={filters} onFiltersChange={updateFilters} />

        {/* Indicateurs de chargement et d'erreur */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-occitan-orange"></div>
            <span className="ml-2 text-gray-600">Chargement des decks...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erreur de chargement
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Grille des decks */}
        {!loading && !error && (
          <DeckGrid
            decks={decks}
            onCreateDeck={handleCreateDeck}
            onEdit={handleEdit}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}

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
