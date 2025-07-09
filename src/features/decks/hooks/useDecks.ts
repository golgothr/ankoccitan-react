import { useState, useMemo } from 'react';
import { Deck, DeckFilters } from '../types/deck.types';
import {
  filterDecks,
  sortDecks,
  calculateDeckStats,
} from '../utils/deckFilters';

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

  const [decks, setDecks] = useState<Deck[]>(MOCK_DECKS);

  // Filtrer et trier les decks
  const filteredAndSortedDecks = useMemo(() => {
    const filtered = filterDecks(decks, filters);
    return sortDecks(filtered, filters.sortBy, filters.sortOrder);
  }, [decks, filters]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    return calculateDeckStats(decks);
  }, [decks]);

  // Actions
  const updateFilters = (newFilters: Partial<DeckFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const addDeck = (deck: Omit<Deck, 'id' | 'createdAt' | 'lastModified'>) => {
    const newDeck: Deck = {
      ...deck,
      id: Date.now().toString(),
      createdAt: new Date(),
      lastModified: new Date(),
    };
    setDecks((prev) => [newDeck, ...prev]);
  };

  const updateDeck = (id: string, updates: Partial<Deck>) => {
    setDecks((prev) =>
      prev.map((deck) =>
        deck.id === id
          ? { ...deck, ...updates, lastModified: new Date() }
          : deck
      )
    );
  };

  const deleteDeck = (id: string) => {
    setDecks((prev) => prev.filter((deck) => deck.id !== id));
  };

  return {
    decks: filteredAndSortedDecks,
    stats,
    filters,
    updateFilters,
    addDeck,
    updateDeck,
    deleteDeck,
  };
}
