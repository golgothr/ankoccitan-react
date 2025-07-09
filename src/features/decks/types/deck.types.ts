export type DeckCategory =
  | 'grammar'
  | 'conjugation'
  | 'vocabulary'
  | 'expressions'
  | 'culture';

export interface Deck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  category: DeckCategory;
  tags: string[];
  lastModified: Date;
  isPublic: boolean;
  createdAt: Date;
  userId: string;
}

export interface DeckFilters {
  search: string;
  category: DeckCategory | 'all';
  tags: string[];
  sortBy: 'name' | 'cardCount' | 'lastModified' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

export interface DeckStats {
  totalDecks: number;
  totalCards: number;
  lastActivity: Date | null;
  categoryDistribution: Record<DeckCategory, number>;
}

// Catégories prédéfinies
export const DECK_CATEGORIES = {
  grammar: 'Grammaire',
  conjugation: 'Conjugaison',
  vocabulary: 'Vocabulaire',
  expressions: 'Expressions',
  culture: 'Culture',
} as const;

// Tags suggérés
export const SUGGESTED_TAGS = [
  'quotidien',
  'travail',
  'santé',
  'famille',
  'loisirs',
  'alimentation',
  'transport',
  'shopping',
  'voyage',
  'météo',
] as const;
