import { useState, useMemo, useEffect } from 'react';
import { Deck, DeckFilters, DeckCategory } from '../types/deck.types';
import {
  filterDecks,
  sortDecks,
  calculateDeckStats,
} from '../utils/deckFilters';
import {
  fetchUserDecks,
  createDeck as createDeckApi,
  updateDeck as updateDeckApi,
  deleteDeck as deleteDeckApi,
} from '../../../core/api/supabaseDecksApi';
import type { DeckRow } from '../../../core/lib/supabase';

// Données mockées pour les tests
const MOCK_DECKS: Deck[] = [
  {
    id: '1',
    name: 'Grammaire de base',
    description: 'Les règles fondamentales de la grammaire occitane',
    cardCount: 45,
    category: 'grammar',
    tags: ['quotidien', 'basique'],
    lastModified: new Date('2024-01-15'),
    isPublic: true,
    createdAt: new Date('2024-01-10'),
    userId: 'user1',
  },
  {
    id: '2',
    name: 'Conjugaison présent',
    description: 'Conjugaison des verbes au présent',
    cardCount: 23,
    category: 'conjugation',
    tags: ['quotidien', 'travail'],
    lastModified: new Date('2024-01-14'),
    isPublic: false,
    createdAt: new Date('2024-01-08'),
    userId: 'user1',
  },
  {
    id: '3',
    name: 'Vocabulaire famille',
    description: 'Mots de vocabulaire liés à la famille',
    cardCount: 67,
    category: 'vocabulary',
    tags: ['famille', 'quotidien'],
    lastModified: new Date('2024-01-12'),
    isPublic: true,
    createdAt: new Date('2024-01-05'),
    userId: 'user1',
  },
  {
    id: '4',
    name: 'Expressions idiomatiques',
    description: 'Expressions courantes en occitan',
    cardCount: 12,
    category: 'expressions',
    tags: ['culture', 'quotidien'],
    lastModified: new Date('2024-01-13'),
    isPublic: true,
    createdAt: new Date('2024-01-03'),
    userId: 'user1',
  },
];

export function useDecks() {
  const [filters, setFilters] = useState<DeckFilters>({
    search: '',
    category: 'all',
    tags: [],
    sortBy: 'lastModified',
    sortOrder: 'desc',
  });

  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtrer et trier les decks
  const filteredAndSortedDecks = useMemo(() => {
    const filtered = filterDecks(decks, filters);
    return sortDecks(filtered, filters.sortBy, filters.sortOrder);
  }, [decks, filters]);

  // Fonction pour convertir DeckRow en Deck
  const convertDeckRowToDeck = (deckRow: DeckRow): Deck => ({
    id: deckRow.id,
    name: deckRow.title,
    description: deckRow.description || '',
    category: deckRow.difficulty_level as DeckCategory,
    tags: deckRow.tags,
    isPublic: deckRow.is_public,
    cardCount: deckRow.card_count,
    createdAt: new Date(deckRow.created_at),
    lastModified: new Date(deckRow.updated_at),
    userId: deckRow.user_id,
  });

  // Charger les decks depuis Supabase
  useEffect(() => {
    const loadDecks = async () => {
      try {
        setLoading(true);
        setError(null);
        const deckRows = await fetchUserDecks();
        const convertedDecks = deckRows.map(convertDeckRowToDeck);
        setDecks(convertedDecks);
      } catch (err) {
        console.error('Erreur lors du chargement des decks:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        // Fallback vers les données mockées en cas d'erreur
        setDecks(MOCK_DECKS);
      } finally {
        setLoading(false);
      }
    };

    loadDecks();
  }, []);

  // Calculer les statistiques
  const stats = useMemo(() => {
    return calculateDeckStats(decks);
  }, [decks]);

  // Actions
  const updateFilters = (newFilters: Partial<DeckFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const addDeck = async (
    deck: Omit<Deck, 'id' | 'createdAt' | 'lastModified'>
  ) => {
    try {
      const deckData = {
        title: deck.name,
        description: deck.description,
        difficulty_level: deck.category as
          | 'débutant'
          | 'intermédiaire'
          | 'avancé',
        tags: deck.tags,
        is_public: deck.isPublic,
      };

      const newDeckRow = await createDeckApi(deckData);
      const newDeck = convertDeckRowToDeck(newDeckRow);
      setDecks((prev) => [newDeck, ...prev]);
    } catch (err) {
      console.error('Erreur lors de la création du deck:', err);
      throw err;
    }
  };

  const updateDeck = async (id: string, updates: Partial<Deck>) => {
    try {
      const updateData: Record<string, unknown> = {};
      if (updates.name) updateData.name = updates.name;
      if (updates.description) updateData.description = updates.description;
      if (updates.category) updateData.category = updates.category;
      if (updates.tags) updateData.tags = updates.tags;
      if (updates.isPublic !== undefined)
        updateData.is_public = updates.isPublic;

      await updateDeckApi(id, updateData);
      setDecks((prev) =>
        prev.map((deck) =>
          deck.id === id
            ? { ...deck, ...updates, lastModified: new Date() }
            : deck
        )
      );
    } catch (err) {
      console.error('Erreur lors de la mise à jour du deck:', err);
      throw err;
    }
  };

  const deleteDeck = async (id: string) => {
    try {
      await deleteDeckApi(id);
      setDecks((prev) => prev.filter((deck) => deck.id !== id));
    } catch (err) {
      console.error('Erreur lors de la suppression du deck:', err);
      throw err;
    }
  };

  return {
    decks: filteredAndSortedDecks,
    stats,
    filters,
    loading,
    error,
    updateFilters,
    addDeck,
    updateDeck,
    deleteDeck,
  };
}
