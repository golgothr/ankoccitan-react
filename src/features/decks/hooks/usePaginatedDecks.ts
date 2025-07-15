import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { DeckRow } from '../../../core/lib/supabase';
import { fetchUserDecksPage } from '../../../core/api/supabaseDecksApi';
import { Deck, DeckCategory } from '../types/deck.types';
import { logger } from '@/core/utils/logger';

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

export function usePaginatedDecks(pageSize = 20) {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ['decks', page, pageSize],
    queryFn: () => fetchUserDecksPage(page, pageSize),
    keepPreviousData: true,
    onError: (err) => {
      logger.error('Erreur lors du chargement des decks paginés:', err);
    },
  });

  const decks = (query.data?.data || []).map(convertDeckRowToDeck);
  const total = query.data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const error = query.error ? (query.error as Error).message : null;

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return {
    decks,
    page,
    total,
    totalPages,
    loading: query.isLoading,
    error,
    nextPage,
    prevPage,
    setPage,
    refetch: query.refetch,
  };
}
