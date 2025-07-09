import { Deck, DeckFilters } from '../types/deck.types';

export function filterDecks(decks: Deck[], filters: DeckFilters): Deck[] {
  return decks.filter((deck) => {
    // Filtre par recherche textuelle
    if (
      filters.search &&
      !deck.name.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    // Filtre par catégorie
    if (filters.category !== 'all' && deck.category !== filters.category) {
      return false;
    }

    // Filtre par tags
    if (filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        deck.tags.includes(tag)
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
}

export function sortDecks(
  decks: Deck[],
  sortBy: DeckFilters['sortBy'],
  sortOrder: 'asc' | 'desc'
): Deck[] {
  return [...decks].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'cardCount':
        comparison = a.cardCount - b.cardCount;
        break;
      case 'lastModified':
        comparison =
          new Date(a.lastModified).getTime() -
          new Date(b.lastModified).getTime();
        break;
      case 'createdAt':
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });
}

export function calculateDeckStats(decks: Deck[]) {
  const stats = {
    totalDecks: decks.length,
    totalCards: decks.reduce((sum, deck) => sum + deck.cardCount, 0),
    lastActivity:
      decks.length > 0
        ? new Date(
            Math.max(...decks.map((d) => new Date(d.lastModified).getTime()))
          )
        : null,
    categoryDistribution: {
      grammar: 0,
      conjugation: 0,
      vocabulary: 0,
      expressions: 0,
      culture: 0,
    },
  };

  decks.forEach((deck) => {
    stats.categoryDistribution[deck.category]++;
  });

  return stats;
}
